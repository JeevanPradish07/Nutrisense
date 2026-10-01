import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, ChevronRight, Info, X } from 'lucide-react';
import { getRecommendations } from '../api/mockApi';
import { useApp } from '../context/AppContext';
import { StepIndicator, SkeletonCard, MatchScoreBar, MacroBadge } from '../components/UI';
import Modal from '../components/Modal';
import Footer from '../components/Footer';

const DIET_COLORS = {
    Vegetarian: 'bg-green-500/15 text-green-400 border-green-500/30',
    Vegan: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'High-Protein': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'High-Fiber': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    'Low-Fat': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'Gluten-Free': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    'Nut-Free': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const EXAMPLE_QUERIES = [
    'light high-protein vegetarian breakfast under 400 calories, no nuts',
    'low-carb lunch under 500 calories, gluten-free',
    'quick vegan snack under 200 calories',
];

function ParsedChips({ parsed }) {
    const chips = [
        parsed.calorieLimit && { label: parsed.calorieLimit, color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
        parsed.diet && { label: parsed.diet, color: 'bg-green-500/15 text-green-400 border-green-500/30' },
        parsed.allergy && { label: parsed.allergy, color: 'bg-red-500/15 text-red-400 border-red-500/30' },
        parsed.mealType && { label: parsed.mealType, color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    ].filter(Boolean);

    if (!chips.length) return null;
    return (
        <div className="flex flex-wrap items-center gap-2 mt-3 p-3 bg-navy-700 rounded-xl border border-white/5 animate-fade-in">
            <span className="text-xs text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3" /> Parsed automatically →</span>
            {chips.map((c) => (
                <span key={c.label} className={`chip border ${c.color}`}>{c.label}</span>
            ))}
        </div>
    );
}

function RecommendationCard({ rec, onWhyThis, onAddToPlan }) {
    return (
        <div className="card hover:border-green-500/30 transition-all duration-300 hover:-translate-y-0.5 animate-slide-up">
            <div className="flex items-start gap-4">
                {/* Rank badge */}
                <div className="w-10 h-10 rounded-xl bg-navy-700 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-400">#{rec.rank}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{rec.name}</h3>
                        <span className="chip bg-purple-500/15 border border-purple-500/30 text-purple-300">{rec.mealType}</span>
                        {rec.dietTags.map((t) => (
                            <span key={t} className={`chip border text-xs ${DIET_COLORS[t] || 'bg-gray-500/15 text-gray-400'}`}>{t}</span>
                        ))}
                    </div>

                    {/* Macros */}
                    <div className="flex flex-wrap gap-4 mb-3">
                        <span className="text-sm font-bold text-white">{rec.calories} kcal</span>
                        <MacroBadge type="protein" value={rec.protein} />
                        <MacroBadge type="carbs" value={rec.carbs} />
                        <MacroBadge type="fat" value={rec.fat} />
                    </div>

                    {/* Match score */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">AI Match</span>
                    </div>
                    <MatchScoreBar score={rec.matchScore} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                <button
                    className="btn-primary flex-1 text-sm py-2"
                    onClick={() => onAddToPlan(rec)}
                    id={`btn-add-${rec.id}`}
                >
                    Add to plan
                </button>
                <button
                    className="btn-outline flex items-center gap-2 text-sm py-2 px-4"
                    onClick={() => onWhyThis(rec)}
                    id={`btn-why-${rec.id}`}
                >
                    <Info className="w-4 h-4" /> Why this?
                </button>
            </div>
        </div>
    );
}

export default function Recommendations() {
    const { profile, setRecommendations: setCtxRecs, addToast } = useApp();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [recs, setRecs] = useState([]);
    const [parsed, setParsed] = useState(null);
    const [loading, setLoading] = useState(false);
    const [whyModal, setWhyModal] = useState(null);
    const [added, setAdded] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const result = await getRecommendations({ query, profile });
            setRecs(result.recommendations);
            setParsed(result.parsed);
        } catch {
            addToast('Failed to fetch recommendations.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlan = (rec) => {
        if (!added.includes(rec.id)) {
            setAdded((a) => [...a, rec.id]);
            addToast(`"${rec.name}" added to your plan ✅`);
        } else {
            addToast(`Already in plan: ${rec.name}`, 'info');
        }
    };

    const handleContinue = () => {
        setCtxRecs(recs.length ? recs : []);
        navigate('/meal-plan');
    };

    return (
        <div className="min-h-screen flex flex-col py-12 px-4">
            <div className="max-w-3xl mx-auto w-full flex-1">
                <StepIndicator steps={['Profile', 'Targets', 'Recommendations', 'Meal Plan']} current={3} />

                <div className="mb-6">
                    <h1 className="section-title">AI Food Recommendations</h1>
                    <p className="section-sub">Describe what you're looking for and our AI will rank the best matches.</p>
                </div>

                {/* Search box */}
                <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        <input
                            id="rec-search"
                            type="text"
                            className="input-field pl-12 pr-28 py-4 text-base"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Try: light high-protein vegetarian breakfast under 400 calories, no nuts"
                            aria-label="Food search query"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm px-4 py-2"
                            disabled={loading || !query.trim()}
                            id="btn-search"
                        >
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : 'Search'}
                        </button>
                    </div>

                    {/* Example queries */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {EXAMPLE_QUERIES.map((q) => (
                            <button
                                key={q}
                                type="button"
                                className="text-xs text-gray-500 hover:text-green-400 border border-white/5 hover:border-green-500/30 bg-navy-800 px-3 py-1.5 rounded-full transition-all truncate max-w-xs"
                                onClick={() => setQuery(q)}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {parsed && <ParsedChips parsed={parsed} />}
                </form>

                {/* Results */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} lines={4} height="h-40" />)}
                    </div>
                ) : recs.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">Showing <strong className="text-white">{recs.length}</strong> ranked results</p>
                        <div className="space-y-4">
                            {recs.map((rec) => (
                                <RecommendationCard
                                    key={rec.id}
                                    rec={rec}
                                    onWhyThis={setWhyModal}
                                    onAddToPlan={handleAddToPlan}
                                />
                            ))}
                        </div>
                        <button
                            className="btn-secondary w-full py-3 mt-6 flex items-center justify-center gap-2"
                            onClick={handleContinue}
                            id="btn-build-plan"
                        >
                            Build my meal plan <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    !loading && (
                        <div className="card text-center py-16">
                            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium mb-1">Search above to get AI recommendations</p>
                            <p className="text-sm text-gray-600">Type a description of what you want to eat</p>
                        </div>
                    )
                )}

                {/* Skip step */}
                <button
                    className="block w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-4"
                    onClick={handleContinue}
                    id="btn-skip-recs"
                >
                    Skip and generate meal plan →
                </button>
            </div>

            {/* Why this? modal */}
            <Modal isOpen={!!whyModal} onClose={() => setWhyModal(null)} title={`Why "${whyModal?.name}"?`} size="md">
                {whyModal && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                            <span className="text-2xl font-extrabold text-green-400">{whyModal.matchScore}%</span>
                            <span className="text-sm text-gray-300">AI Match Score</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{whyModal.explanation}</p>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'Calories', val: `${whyModal.calories} kcal`, color: 'text-white' },
                                { label: 'Protein', val: `${whyModal.protein}g`, color: 'text-blue-400' },
                                { label: 'Carbs', val: `${whyModal.carbs}g`, color: 'text-amber-400' },
                                { label: 'Fat', val: `${whyModal.fat}g`, color: 'text-pink-400' },
                            ].map((m) => (
                                <div key={m.label} className="bg-navy-700 rounded-xl p-3 text-center">
                                    <p className={`text-sm font-bold ${m.color}`}>{m.val}</p>
                                    <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary w-full" onClick={() => { handleAddToPlan && setWhyModal(null); }}>
                            Got it
                        </button>
                    </div>
                )}
            </Modal>

            <div className="max-w-3xl mx-auto w-full mt-8"><Footer /></div>
        </div>
    );
}
