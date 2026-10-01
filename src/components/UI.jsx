// Macro color mapping used across the app
export const MACRO_COLORS = {
    protein: { bg: 'bg-blue-500', text: 'text-blue-400', bar: '#3B82F6', label: 'Protein' },
    carbs: { bg: 'bg-amber-500', text: 'text-amber-400', bar: '#F59E0B', label: 'Carbs' },
    fat: { bg: 'bg-pink-500', text: 'text-pink-400', bar: '#EC4899', label: 'Fat' },
    fiber: { bg: 'bg-green-500', text: 'text-green-400', bar: '#22C55E', label: 'Fiber' },
};

export function MacroBadge({ type, value, unit = 'g' }) {
    const c = MACRO_COLORS[type];
    return (
        <span className={`text-xs font-semibold ${c.text}`}>
            {c.label}: <span className="text-white">{value}{unit}</span>
        </span>
    );
}

export function MacroBar({ protein, carbs, fat, total }) {
    const p = Math.round((protein * 4 / total) * 100);
    const c = Math.round((carbs * 4 / total) * 100);
    const f = Math.round((fat * 9 / total) * 100);
    return (
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
            <div className="bg-blue-500 rounded-l-full transition-all" style={{ width: `${p}%` }} title={`Protein ${p}%`} />
            <div className="bg-amber-500 transition-all" style={{ width: `${c}%` }} title={`Carbs ${c}%`} />
            <div className="bg-pink-500 rounded-r-full transition-all" style={{ width: `${f}%` }} title={`Fat ${f}%`} />
        </div>
    );
}

export function MatchScoreBar({ score, size = 'md' }) {
    const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-orange-500';
    const textColor = score >= 85 ? 'text-green-400' : score >= 70 ? 'text-amber-400' : 'text-orange-400';
    const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
    return (
        <div className="flex items-center gap-2">
            <div className={`flex-1 bg-navy-600 rounded-full ${heights[size]} overflow-hidden`}>
                <div
                    className={`${color} ${heights[size]} rounded-full transition-all duration-700`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className={`text-sm font-bold ${textColor} min-w-[40px] text-right`}>{score}%</span>
        </div>
    );
}

export function SkeletonCard({ lines = 3, height = 'h-32' }) {
    return (
        <div className={`card animate-pulse ${height}`}>
            <div className="space-y-3">
                {Array.from({ length: lines }).map((_, i) => (
                    <div key={i} className="h-3 bg-white/5 rounded-full" style={{ width: i === 0 ? '60%' : '90%' }} />
                ))}
            </div>
        </div>
    );
}

export function EmptyState({ icon: Icon, title, desc }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <Icon className="w-12 h-12 text-gray-600 mb-4" />}
            <h3 className="text-lg font-semibold text-gray-400 mb-1">{title}</h3>
            {desc && <p className="text-sm text-gray-500 max-w-xs">{desc}</p>}
        </div>
    );
}

export function StepIndicator({ steps, current }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, i) => {
                const idx = i + 1;
                const done = idx < current;
                const active = idx === current;
                return (
                    <div key={step} className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-green-500/20 border-2 border-green-500 text-green-400' : 'bg-navy-700 border border-white/10 text-gray-500'
                                }`}
                        >
                            {done ? '✓' : idx}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${active ? 'text-green-400' : done ? 'text-gray-400' : 'text-gray-600'}`}>
                            {step}
                        </span>
                        {i < steps.length - 1 && (
                            <div className={`w-8 sm:w-16 h-px ${done ? 'bg-green-500' : 'bg-white/10'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function StarRating({ value, onChange }) {
    return (
        <div className="flex gap-1" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onChange(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    className={`text-xl transition-all hover:scale-110 focus:outline-none focus:ring-1 focus:ring-green-500 rounded ${star <= (value || 0) ? 'text-amber-400' : 'text-gray-600 hover:text-amber-300'
                        }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
