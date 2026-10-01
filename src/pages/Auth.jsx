import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../api/mockApi';
import { useApp } from '../context/AppContext';
import Footer from '../components/Footer';

export default function Auth() {
    const [params] = useSearchParams();
    const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const { setUser, addToast } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        setErrors({});
        setForm({ name: '', email: '', password: '' });
    }, [tab]);

    const validate = () => {
        const e = {};
        if (tab === 'register' && !form.name.trim()) e.name = 'Name is required.';
        if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Enter a valid email.';
        if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setErrors({});
        try {
            const fn = tab === 'register' ? registerUser : loginUser;
            const { user } = await fn(form);
            setUser(user);
            addToast(`Welcome${tab === 'register' ? ', ' + user.name : ' back, ' + user.name}! 🎉`);
            navigate('/profile');
        } catch (err) {
            setErrors({ server: err.message });
        } finally {
            setLoading(false);
        }
    };

    const field = (key, label, type = 'text', placeholder = '') => (
        <div>
            <label htmlFor={`auth-${key}`} className="label">{label}</label>
            <div className="relative">
                <input
                    id={`auth-${key}`}
                    type={key === 'password' ? (showPw ? 'text' : 'password') : type}
                    className={`input-field ${errors[key] ? 'border-red-500' : ''}`}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    autoComplete={key === 'password' ? (tab === 'login' ? 'current-password' : 'new-password') : key}
                    aria-invalid={!!errors[key]}
                    aria-describedby={errors[key] ? `err-${key}` : undefined}
                />
                {key === 'password' && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        onClick={() => setShowPw((v) => !v)}
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
            {errors[key] && (
                <p id={`err-${key}`} className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[key]}
                </p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold"><span className="text-white">Nutri</span><span className="text-green-400">Sense</span></span>
                    </div>
                </div>

                <div className="card">
                    {/* Tabs */}
                    <div className="flex bg-navy-900 rounded-xl p-1 mb-6">
                        {['login', 'register'].map((t) => (
                            <button
                                key={t}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-navy-700 text-white shadow' : 'text-gray-400 hover:text-white'
                                    }`}
                                onClick={() => setTab(t)}
                                id={`tab-${t}`}
                            >
                                {t === 'login' ? 'Sign in' : 'Sign up'}
                            </button>
                        ))}
                    </div>

                    {errors.server && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{errors.server}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {tab === 'register' && field('name', 'Full name', 'text', 'Priya Sharma')}
                        {field('email', 'Email address', 'email', 'you@example.com')}
                        {field('password', 'Password', 'password', tab === 'register' ? 'Min. 8 characters' : '••••••••')}

                        <button
                            type="submit"
                            className="btn-primary w-full text-center justify-center py-3 text-sm mt-2"
                            disabled={loading}
                            id={`btn-${tab}-submit`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                                </span>
                            ) : tab === 'login' ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    {/* Hint for demo */}
                    <p className="text-xs text-gray-600 text-center mt-4">
                        Demo password: <code className="text-gray-400">password123</code>
                    </p>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            className="text-green-400 hover:text-green-300 font-medium"
                            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                        >
                            {tab === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
            <div className="mt-8 w-full max-w-md">
                <Footer />
            </div>
        </div>
    );
}
