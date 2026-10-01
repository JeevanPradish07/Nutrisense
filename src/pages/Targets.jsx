import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StepIndicator } from '../components/UI';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, Flame, Activity, Target } from 'lucide-react';
import Footer from '../components/Footer';

const COLORS = { protein: '#3B82F6', carbs: '#F59E0B', fat: '#EC4899' };

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="card flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-300">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
);

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-navy-700 border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
            {d.name}: <strong>{d.value}g</strong>
        </div>
    );
};

export default function Targets() {
    const { targets, profile } = useApp();
    const navigate = useNavigate();

    // Fallback mock data if user navigated directly
    const t = targets || { bmr: 1420, tdee: 1980, calorieTarget: 1600, macros: { protein: 100, carbs: 180, fat: 45 } };

    const pieData = [
        { name: 'Protein', value: t.macros.protein, color: COLORS.protein },
        { name: 'Carbs', value: t.macros.carbs, color: COLORS.carbs },
        { name: 'Fat', value: t.macros.fat, color: COLORS.fat },
    ];

    const totalKcal = t.macros.protein * 4 + t.macros.carbs * 4 + t.macros.fat * 9;

    return (
        <div className="min-h-screen flex flex-col py-12 px-4">
            <div className="max-w-3xl mx-auto w-full flex-1">
                <StepIndicator steps={['Profile', 'Targets', 'Recommendations', 'Meal Plan']} current={2} />

                <div className="mb-6">
                    <h1 className="section-title">Daily Targets</h1>
                    <p className="section-sub">Here's what your body needs each day based on your profile.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard icon={Flame} label="BMR" value={t.bmr.toLocaleString()} sub="Basal metabolic rate (kcal)" color="bg-blue-500" />
                    <StatCard icon={Activity} label="TDEE" value={t.tdee.toLocaleString()} sub="Total daily energy exp." color="bg-purple-500" />
                    <StatCard icon={Target} label="Daily Target" value={t.calorieTarget.toLocaleString()} sub="Recommended intake" color="bg-green-500" />
                </div>

                {/* Macro donut + breakdown */}
                <div className="card">
                    <h2 className="font-semibold text-white mb-6">Macro Nutrient Split</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Donut */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {pieData.map((d, i) => (
                                            <Cell key={d.name} fill={d.color} stroke="transparent" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold text-white">{t.calorieTarget}</span>
                                <span className="text-xs text-gray-400">kcal/day</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 space-y-4 w-full">
                            {pieData.map((d) => {
                                const pct = Math.round((d.value * (d.name === 'Fat' ? 9 : 4) / totalKcal) * 100);
                                return (
                                    <div key={d.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                                                <span className="text-sm font-medium text-gray-300">{d.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-white">{d.value}g</span>
                                                <span className="text-xs text-gray-500 ml-2">{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-navy-600 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: d.color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Info banner */}
                <div className="mt-4 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 text-sm text-gray-400">
                    💡 Your targets are computed using the <strong className="text-gray-200">Mifflin-St Jeor equation</strong> adjusted for your activity level and goal.
                </div>

                <button
                    className="btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2"
                    onClick={() => navigate('/recommendations')}
                    id="btn-go-recommendations"
                >
                    Find AI recommendations <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            <div className="max-w-3xl mx-auto w-full mt-8"><Footer /></div>
        </div>
    );
}
