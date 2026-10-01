import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_MEAL_PLAN_DAYS, swapMeal, submitFeedback } from '../api/mockApi';
import { useApp } from '../context/AppContext';
import { StepIndicator, StarRating, MacroBadge, SkeletonCard } from '../components/UI';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const MEAL_COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899'];
const SLOT_ICONS = { Breakfast: '🌅', 'Mid-Day Snack': '🍎', Lunch: '☀️', Dinner: '🌙' };

function SummaryBar({ meals, target }) {
    const total = meals.reduce((s, m) => s + m.calories, 0);
    const remaining = target - total;
    const over = remaining < 0;
    return (
        <div className="card flex flex-wrap items-center gap-6 mb-4">
            <div>
                <p className="text-xs text-gray-500">Target</p>
                <p className="text-xl font-bold text-white">{target} kcal</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">Planned</p>
                <p className="text-xl font-bold text-green-400">{total} kcal</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">Remaining</p>
                <p className={`text-xl font-bold ${over ? 'text-red-400' : 'text-amber-400'}`}>
                    {over ? '+' : ''}{Math.abs(remaining)} kcal
                </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
                {over ? (
                    <span className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Over target
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Within target ✓
                    </span>
                )}
            </div>
        </div>
    );
}

function MealCard({ meal, onSwap, onFeedback }) {
    const [rating, setRating] = useState(meal.rating);
    const [thumbs, setThumbs] = useState(meal.thumbs);
    const [submitting, setSubmitting] = useState(false);

    const handleRate = async (stars) => {
        setRating(stars);
        setSubmitting(true);
        const result = await submitFeedback({ mealId: meal.id, rating: stars, thumbs });
        setSubmitting(false);
        onFeedback(result.message);
    };

    const handleThumbs = async (val) => {
        setThumbs(val);
        setSubmitting(true);
        const result = await submitFeedback({ mealId: meal.id, rating, thumbs: val });
        setSubmitting(false);
        onFeedback(result.message);
    };

    return (
        <div className="flex gap-4 items-start animate-fade-in">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-navy-700 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                    {SLOT_ICONS[meal.slot]}
                </div>
                <div className="w-px flex-1 bg-white/5 mt-2" />
            </div>

            {/* Card */}
            <div className="flex-1 card mb-4 group hover:border-green-500/20 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5">{meal.time} · {meal.slot}</p>
                        <h3 className="font-semibold text-white">{meal.food}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="text-lg font-bold text-white">{meal.calories}</span>
                        <span className="text-xs text-gray-500 ml-1">kcal</span>
                    </div>
                </div>

                {/* Macros */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <MacroBadge type="protein" value={meal.protein} />
                    <MacroBadge type="carbs" value={meal.carbs} />
                    <MacroBadge type="fat" value={meal.fat} />
                    <MacroBadge type="fiber" value={meal.fiber} />
                </div>

                {/* Feedback + swap */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <StarRating value={rating} onChange={handleRate} />
                        <div className="flex gap-1">
                            <button
                                onClick={() => handleThumbs('up')}
                                className={`p-1.5 rounded-lg transition-all ${thumbs === 'up' ? 'bg-green-500/20 text-green-400' : 'text-gray-600 hover:text-green-400'}`}
                                aria-label="Thumbs up"
                            >👍</button>
                            <button
                                onClick={() => handleThumbs('down')}
                                className={`p-1.5 rounded-lg transition-all ${thumbs === 'down' ? 'bg-red-500/20 text-red-400' : 'text-gray-600 hover:text-red-400'}`}
                                aria-label="Thumbs down"
                            >👎</button>
                        </div>
                        {submitting && <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />}
                    </div>
                    <button
                        className="btn-outline flex items-center gap-2 text-xs py-1.5 px-3"
                        onClick={() => onSwap(meal)}
                        id={`btn-swap-${meal.id}`}
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Swap meal
                    </button>
                </div>
            </div>
        </div>
    );
}

function NutritionTable({ meals }) {
    const totals = meals.reduce(
        (acc, m) => ({
            calories: acc.calories + m.calories,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
            fiber: acc.fiber + m.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    return (
        <div className="card overflow-x-auto">
            <h3 className="font-semibold text-white mb-4">Day Nutrition Breakdown</h3>
            <table className="w-full text-sm" role="table">
                <thead>
                    <tr className="border-b border-white/5">
                        {['Meal', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)'].map(h => (
                            <th key={h} className="text-left py-2 pr-4 text-xs text-gray-500 font-medium">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {meals.map((m) => (
                        <tr key={m.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                            <td className="py-2.5 pr-4 font-medium text-gray-200">{m.slot}</td>
                            <td className="py-2.5 pr-4 text-white font-semibold">{m.calories}</td>
                            <td className="py-2.5 pr-4 text-blue-400">{m.protein}</td>
                            <td className="py-2.5 pr-4 text-amber-400">{m.carbs}</td>
                            <td className="py-2.5 pr-4 text-pink-400">{m.fat}</td>
                            <td className="py-2.5 pr-4 text-green-400">{m.fiber}</td>
                        </tr>
                    ))}
                    <tr className="font-bold">
                        <td className="py-2.5 pr-4 text-gray-300">Total</td>
                        <td className="py-2.5 pr-4 text-white">{totals.calories}</td>
                        <td className="py-2.5 pr-4 text-blue-400">{totals.protein}</td>
                        <td className="py-2.5 pr-4 text-amber-400">{totals.carbs}</td>
                        <td className="py-2.5 pr-4 text-pink-400">{totals.fat}</td>
                        <td className="py-2.5 pr-4 text-green-400">{totals.fiber}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default function MealPlan() {
    const { targets, addToast } = useApp();
    const [activeDay, setActiveDay] = useState(0);
    const [days, setDays] = useState(MOCK_MEAL_PLAN_DAYS);
    const [swapModal, setSwapModal] = useState(null);
    const [swapAlts, setSwapAlts] = useState([]);
    const [swapLoading, setSwapLoading] = useState(false);
    const [insightOpen, setInsightOpen] = useState(true);

    const calorieTarget = targets?.calorieTarget || 1600;
    const currentDay = days[activeDay];

    const handleSwap = async (meal) => {
        setSwapModal(meal);
        setSwapLoading(true);
        const { alternatives } = await swapMeal({ mealId: meal.id, slot: meal.slot });
        setSwapAlts(alternatives);
        setSwapLoading(false);
    };

    const applySwap = (alt) => {
        setDays((prev) =>
            prev.map((day, di) =>
                di !== activeDay
                    ? day
                    : {
                        ...day,
                        meals: day.meals.map((m) =>
                            m.id === swapModal.id
                                ? { ...m, food: alt.food, calories: alt.calories, protein: alt.protein, carbs: alt.carbs, fat: alt.fat }
                                : m
                        ),
                    }
            )
        );
        addToast(`Swapped to "${alt.food}" ✅`);
        setSwapModal(null);
    };

    const chartData = currentDay.meals.map((m, i) => ({ name: m.slot, kcal: m.calories, fill: MEAL_COLORS[i] }));

    return (
        <div className="min-h-screen flex flex-col py-12 px-4">
            <div className="max-w-4xl mx-auto w-full flex-1">
                <StepIndicator steps={['Profile', 'Targets', 'Recommendations', 'Meal Plan']} current={4} />

                <div className="mb-6">
                    <h1 className="section-title">Your 7-Day Meal Plan</h1>
                    <p className="section-sub">AI-generated for your goals. Swap any meal, track nutrition, and give feedback.</p>
                </div>

                {/* Day tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                    {days.map((d, i) => (
                        <button
                            key={d.day}
                            onClick={() => setActiveDay(i)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeDay === i ? 'bg-green-500 text-white' : 'bg-navy-700 text-gray-400 hover:text-white border border-white/5'
                                }`}
                            id={`day-tab-${d.day}`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* Summary bar */}
                <SummaryBar meals={currentDay.meals} target={calorieTarget} />

                {/* Timeline */}
                <div className="mb-6">
                    {currentDay.meals.map((meal) => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            onSwap={handleSwap}
                            onFeedback={(msg) => addToast(msg)}
                        />
                    ))}
                </div>

                {/* Charts + table in grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Stacked bar chart */}
                    <div className="card">
                        <h3 className="font-semibold text-white mb-4">Calories Per Meal</h3>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={chartData} barSize={32}>
                                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#9CA3AF' }}
                                />
                                <Bar dataKey="kcal" radius={[6, 6, 0, 0]}>
                                    {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* AI insight panel */}
                    <div className="card bg-gradient-to-br from-navy-800 to-green-500/5 border-green-500/20">
                        <button
                            className="flex items-center justify-between w-full mb-3"
                            onClick={() => setInsightOpen((v) => !v)}
                        >
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                🤖 AI Insight
                            </h3>
                            {insightOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {insightOpen && (
                            <div className="space-y-3 animate-fade-in">
                                {[
                                    {
                                        label: 'Explanation',
                                        text: 'Your plan balances slow-release carbohydrates in the morning with protein-rich meals later in the day to support your weight-loss goal.',
                                        icon: '🔍',
                                    },
                                    {
                                        label: 'Suggestion',
                                        text: 'Add sprouts or paneer to your snack to increase satiety and hit your protein target more comfortably.',
                                        icon: '💡',
                                    },
                                    {
                                        label: 'Summary',
                                        text: "Today's plan totals 1,270 kcal — 330 below your target, leaving room for an extra evening snack if needed.",
                                        icon: '📊',
                                    },
                                ].map((b) => (
                                    <div key={b.label} className="bg-navy-700/50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-green-400 mb-1">{b.icon} {b.label}</p>
                                        <p className="text-xs text-gray-300 leading-relaxed">{b.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Nutrition table */}
                <NutritionTable meals={currentDay.meals} />
            </div>

            {/* Swap modal */}
            <Modal isOpen={!!swapModal} onClose={() => setSwapModal(null)} title={`Swap "${swapModal?.slot}" meal`} size="md">
                <p className="text-sm text-gray-400 mb-4">3 alternatives with similar calories:</p>
                {swapLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} height="h-16" lines={2} />)}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {swapAlts.map((alt, i) => (
                            <button
                                key={i}
                                onClick={() => applySwap(alt)}
                                className="w-full flex items-center justify-between bg-navy-700 hover:bg-navy-600 border border-white/5 hover:border-green-500/30 rounded-xl px-4 py-3 transition-all text-left"
                                id={`btn-swap-alt-${i}`}
                            >
                                <div>
                                    <p className="font-medium text-white text-sm">{alt.food}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">P {alt.protein}g · C {alt.carbs}g · F {alt.fat}g</p>
                                </div>
                                <span className="text-green-400 font-bold text-sm">{alt.calories} kcal</span>
                            </button>
                        ))}
                    </div>
                )}
            </Modal>

            <div className="max-w-4xl mx-auto w-full mt-8"><Footer /></div>
        </div>
    );
}
