import { Link } from 'react-router-dom';
import { Brain, BarChart3, Calendar, Star, ArrowRight, Zap, ChevronRight, Leaf } from 'lucide-react';
import Footer from '../components/Footer';

const SAMPLE_RECS = [
    { name: 'Vegetable Oats Upma', match: 94, type: 'Breakfast', kcal: 320 },
    { name: 'Moong Dal Chilla', match: 89, type: 'Breakfast', kcal: 280 },
    { name: 'Greek-style Curd Bowl', match: 86, type: 'Snack', kcal: 190 },
];

const FEATURES = [
    {
        icon: BarChart3,
        color: 'text-blue-400 bg-blue-500/10',
        title: 'Profile Analysis',
        desc: 'Calculates your BMR & TDEE from age, weight, height and activity level to give you a precise daily calorie target.',
    },
    {
        icon: Brain,
        color: 'text-purple-400 bg-purple-500/10',
        title: 'Smart Recommendations',
        desc: 'Hybrid AI scores each food on semantic similarity + macro alignment, surfacing the best matches for your profile.',
    },
    {
        icon: Calendar,
        color: 'text-green-400 bg-green-500/10',
        title: 'Daily Meal Plan',
        desc: 'Auto-generates a 7-day meal timeline that meets your calorie targets. Swap any meal with one tap.',
    },
    {
        icon: Star,
        color: 'text-amber-400 bg-amber-500/10',
        title: 'Learns From Feedback',
        desc: 'Rate any meal and the system updates your taste profile, improving every future recommendation.',
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <section className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-20">
                {/* Background glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: copy */}
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 font-medium mb-6">
                            <Zap className="w-4 h-4" /> AI-Powered Meal Planning
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Eat smarter,{' '}
                            <span className="gradient-text">not harder.</span>
                        </h1>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                            NutriSense builds personalised meal plans from your goals, dietary preferences and allergies — powered by a hybrid AI that learns from your feedback.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/profile"
                                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
                                id="cta-plan-meals"
                            >
                                Plan my meals <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/auth?tab=register"
                                className="btn-outline inline-flex items-center gap-2 text-base px-8 py-3"
                                id="cta-create-account"
                            >
                                Create account
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5">
                            {[['1200+', 'Meals indexed'], ['94%', 'Avg match score'], ['7-day', 'Plan coverage']].map(([v, l]) => (
                                <div key={l}>
                                    <div className="text-xl font-bold text-white">{v}</div>
                                    <div className="text-xs text-gray-500">{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: floating preview card */}
                    <div className="relative animate-slide-up flex justify-center lg:justify-end">
                        <div className="w-full max-w-sm bg-navy-800 border border-white/10 rounded-3xl p-6 shadow-2xl glow-green">
                            <div className="flex items-center gap-2 mb-5">
                                <Leaf className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-semibold text-gray-300">AI Recommendations</span>
                                <span className="ml-auto text-xs text-gray-500">Today</span>
                            </div>
                            <div className="space-y-3">
                                {SAMPLE_RECS.map((r, i) => (
                                    <div
                                        key={r.name}
                                        className="bg-navy-700 rounded-xl p-4 border border-white/5 hover:border-green-500/30 transition-all duration-200 group"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors">{r.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{r.type} · {r.kcal} kcal</p>
                                            </div>
                                            <span
                                                className={`text-xs font-bold px-2 py-1 rounded-lg ${r.match >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                                                    }`}
                                            >
                                                {r.match}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${r.match >= 90 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                style={{ width: `${r.match}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Brain className="w-3 h-3" /> Personalised for your profile
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            ✦ AI Powered
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">Everything you need to eat right</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Four pillars work together to give you the most personalised nutrition experience.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="card group hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-3xl p-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to transform how you eat?</h2>
                    <p className="text-gray-400 mb-8">Takes 2 minutes to set up your profile. No credit card required.</p>
                    <Link
                        to="/profile"
                        className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-3"
                        id="cta-get-started"
                    >
                        Get started free <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
