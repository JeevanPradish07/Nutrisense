import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, ChevronDown, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);

    const navLinks = user
        ? [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'My Plan', path: '/meal-plan' },
            { label: 'AI Picks', path: '/recommendations' },
        ]
        : [];

    const handleLogout = () => {
        logout();
        navigate('/');
        setAvatarOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Leaf className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">
                            <span className="text-white">Nutri</span>
                            <span className="text-green-400">Sense</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((l) => (
                            <Link
                                key={l.path}
                                to={l.path}
                                className={`text-sm font-medium transition-colors ${isActive(l.path) ? 'text-green-400' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setAvatarOpen((v) => !v)}
                                    className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 px-3 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                    aria-label="User menu"
                                >
                                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                        {user.name?.[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                    <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {avatarOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-navy-700 border border-white/10 rounded-xl shadow-xl py-1 animate-fade-in z-50">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setAvatarOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-navy-600 hover:text-red-300 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/auth" className="btn-outline text-sm py-2 px-4">Login</Link>
                                <Link to="/auth?tab=register" className="btn-primary text-sm py-2 px-4">Sign up</Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        {navLinks.map((l) => (
                            <Link
                                key={l.path}
                                to={l.path}
                                onClick={() => setMenuOpen(false)}
                                className={`block py-2.5 text-sm font-medium transition-colors ${isActive(l.path) ? 'text-green-400' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
