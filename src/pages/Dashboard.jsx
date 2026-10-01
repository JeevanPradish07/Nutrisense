import { useState, useEffect } from 'react';
import { getDashboard } from '../api/mockApi';
import { useApp } from '../context/AppContext';
import { SkeletonCard } from '../components/UI';
import Footer from '../components/Footer';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, Zap, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, iconBg }) => (
    <div className="card flex items-center gap-4 group hover:-translate-y-0.5 transition-transform">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
            {sub && <p className="text-xs text-gray-600">{sub}</p>}
        </div>
    </div>
);

function TasteBar({ item }) {
    const isPos = item.direction === 'positive';
    const w = Math.abs(item.weight) / 2.0 * 100;
    return (
        <div className="flex items-center gap-3 py-2">
            <span className="text-sm text-gray-300 w-36 flex-shrink-0">{item.category}</span>
            <div className="flex-1 h-2 bg-navy-600 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isPos ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${w}%` }}
                />
            </div>
            <span className={`text-xs font-bold w-12 text-right ${isPos ? 'text-green-400' : 'text-orange-400'}`}>
                {isPos ? '+' : ''}{item.weight.toFixed(1)}
            </span>
        </div>
    );
}

function LearnCompare({ before, after }) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {[{ label: 'Before Learning', items: before, color: 'text-gray-400', barColor: 'bg-gray-600' },
            { label: 'After Learning', items: after, color: 'text-green-400', barColor: 'bg-green-500' }].map(col => (
                <div key={col.label} className="card">
                    <h4 className="font-semibold mb-4" style={{ color: col.color === 'text-green-400' ? '#4ADE80' : '#9CA3AF' }}>{col.label}</h4>
                    <div className="space-y-3">
                        {col.items.map((item, i) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300 truncate mr-2">#{i + 1} {item.name}</span>
                                    <span className={`font-bold flex-shrink-0 ${col.color}`}>{item.match}%</span>
                                </div>
                                <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${col.barColor}`} style={{ width: `${item.match}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-navy-700 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
            <p className="text-white font-medium mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} kcal</p>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const { user } = useApp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // GET /dashboard
        getDashboard({ userId: user?.id }).then((d) => {
            setData(d);
            setLoading(false);
        });
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 h-10 bg-white/5 rounded-xl w-1/3 animate-pulse" />
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} height="h-24" lines={2} />)}
                    </div>
                    <SkeletonCard height="h-64" lines={4} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col py-12 px-4">
            <div className="max-w-5xl mx-auto w-full flex-1">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white mb-1">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'there'}</span> 👋
                    </h1>
                    <p className="text-gray-400">Here's how your NutriSense journey is going.</p>
                </div>

                {/* Stat cards */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <StatCard icon={Calendar} label="Plans Generated" value={data.stats.plansGenerated} iconBg="bg-blue-500/10" color="text-blue-400" />
                    <StatCard icon={Zap} label="Avg AI Match" value={`${data.stats.avgMatchScore}%`} iconBg="bg-green-500/10" color="text-green-400" />
                    <StatCard icon={TrendingUp} label="Avg Daily Intake" value={`${data.stats.avgDailyKcal} kcal`} iconBg="bg-purple-500/10" color="text-purple-400" />
                </div>

                {/* Taste Profile */}
                <div className="card mb-6">
                    <h2 className="font-semibold text-white mb-1">Learned Taste Profile</h2>
                    <p className="text-xs text-gray-500 mb-4">Category weights updated from your feedback. Green = preferred, orange = avoided.</p>
                    <div className="divide-y divide-white/5">
                        {data.tasteProfile.map((item) => <TasteBar key={item.category} item={item} />)}
                    </div>
                </div>

                {/* Before / After Learning */}
                <div className="mb-6">
                    <h2 className="font-semibold text-white mb-1">Personalisation Impact</h2>
                    <p className="text-xs text-gray-500 mb-4">Same query: <em>"suggest a healthy meal"</em> — before vs after 12 sessions of feedback.</p>
                    <LearnCompare before={data.beforeLearning} after={data.afterLearning} />
                </div>

                {/* Weekly Calories Chart */}
                <div className="card">
                    <h2 className="font-semibold text-white mb-4">Weekly Calories: Target vs Actual</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={data.weeklyCalories}>
                            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                            <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                            <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target" />
                            <Line type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4, fill: '#22C55E' }} activeDot={{ r: 6 }} name="Actual" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="max-w-5xl mx-auto w-full mt-8"><Footer /></div>
        </div>
    );
}
