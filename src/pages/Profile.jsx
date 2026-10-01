import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, ChevronRight, X } from 'lucide-react';
import { calculateTargets } from '../api/mockApi';
import { useApp } from '../context/AppContext';
import { StepIndicator } from '../components/UI';
import Footer from '../components/Footer';

const DIET_OPTIONS = ['Any', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Diabetic-Friendly'];
const ALLERGY_OPTIONS = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'];
const ACTIVITY_LEVELS = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'light', label: 'Light', desc: '1–3 days/week' },
    { value: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
    { value: 'active', label: 'Active', desc: '6–7 days/week' },
    { value: 'very-active', label: 'Very Active', desc: 'Hard exercise daily' },
];
const HEALTH_GOALS = [
    { value: 'weight-loss', label: 'Weight Loss', emoji: '📉' },
    { value: 'maintenance', label: 'Maintenance', emoji: '⚖️' },
    { value: 'weight-gain', label: 'Weight Gain', emoji: '📈' },
    { value: 'muscle-gain', label: 'Muscle Gain', emoji: '💪' },
];

const RANDOM_PROFILE = {
    age: '27', gender: 'female', weight: '62', height: '165',
    activityLevel: 'moderate', healthGoal: 'weight-loss',
    dietPreference: 'Vegetarian', allergies: ['Nuts'], mealsPerDay: '4',
};

export default function Profile() {
    const { setProfile, setTargets, addToast } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        age: '', gender: '', weight: '', height: '',
        activityLevel: 'moderate', healthGoal: '',
        dietPreference: 'Any', allergies: [], mealsPerDay: '3',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const set = (key, val) => {
        setForm((f) => ({ ...f, [key]: val }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const toggleAllergy = (a) => {
        setForm((f) => ({
            ...f,
            allergies: f.allergies.includes(a) ? f.allergies.filter((x) => x !== a) : [...f.allergies, a],
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.age || parseInt(form.age) < 10 || parseInt(form.age) > 100) e.age = 'Enter a valid age (10–100).';
        if (!form.gender) e.gender = 'Select gender.';
        if (!form.weight || parseFloat(form.weight) < 20) e.weight = 'Enter valid weight.';
        if (!form.height || parseFloat(form.height) < 100) e.height = 'Enter valid height.';
        if (!form.healthGoal) e.healthGoal = 'Select a health goal.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        try {
            const result = await calculateTargets(form);
            setProfile(form);
            setTargets(result);
            addToast('Targets calculated! 🎯');
            navigate('/targets');
        } catch {
            addToast('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSurprise = () => {
        setForm(RANDOM_PROFILE);
        setErrors({});
        addToast('Profile filled with sample data! ✨', 'info');
    };

    const inputErr = (key) => errors[key] ? 'border-red-500' : '';

    return (
        <div className="min-h-screen flex flex-col py-12 px-4">
            <div className="max-w-2xl mx-auto w-full flex-1">
                <StepIndicator steps={['Profile', 'Targets', 'Recommendations', 'Meal Plan']} current={1} />

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="section-title">Your Profile & Goals</h1>
                        <p className="section-sub">Tell us about yourself so we can personalise your plan.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSurprise}
                        className="btn-outline flex items-center gap-2 text-sm"
                        id="btn-surprise"
                    >
                        <Shuffle className="w-4 h-4" /> Surprise me
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Basic info */}
                    <div className="card space-y-4">
                        <h2 className="font-semibold text-white">Basic Information</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="profile-age" className="label">Age</label>
                                <input id="profile-age" type="number" className={`input-field ${inputErr('age')}`}
                                    value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="e.g. 27" min="10" max="100" />
                                {errors.age && <p className="mt-1 text-xs text-red-400">{errors.age}</p>}
                            </div>
                            <div>
                                <label className="label">Gender</label>
                                <div className="flex gap-3 mt-1">
                                    {['male', 'female', 'other'].map((g) => (
                                        <button key={g} type="button"
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize border transition-all ${form.gender === g ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-navy-700 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                            onClick={() => set('gender', g)}
                                            id={`gender-${g}`}
                                        >{g}</button>
                                    ))}
                                </div>
                                {errors.gender && <p className="mt-1 text-xs text-red-400">{errors.gender}</p>}
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="profile-weight" className="label">Weight (kg)</label>
                                <input id="profile-weight" type="number" className={`input-field ${inputErr('weight')}`}
                                    value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="e.g. 70" />
                                {errors.weight && <p className="mt-1 text-xs text-red-400">{errors.weight}</p>}
                            </div>
                            <div>
                                <label htmlFor="profile-height" className="label">Height (cm)</label>
                                <input id="profile-height" type="number" className={`input-field ${inputErr('height')}`}
                                    value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="e.g. 165" />
                                {errors.height && <p className="mt-1 text-xs text-red-400">{errors.height}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="profile-meals" className="label">Meals per day</label>
                            <select id="profile-meals" className="input-field" value={form.mealsPerDay} onChange={(e) => set('mealsPerDay', e.target.value)}>
                                {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} meals</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Activity level */}
                    <div className="card">
                        <h2 className="font-semibold text-white mb-3">Activity Level</h2>
                        <div className="space-y-2">
                            {ACTIVITY_LEVELS.map((al) => (
                                <button key={al.value} type="button"
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${form.activityLevel === al.value ? 'bg-green-500/10 border-green-500/50 text-white' : 'bg-navy-700 border-white/5 text-gray-400 hover:border-white/20'
                                        }`}
                                    onClick={() => set('activityLevel', al.value)}
                                    id={`activity-${al.value}`}
                                >
                                    <span className="font-medium">{al.label}</span>
                                    <span className="text-xs opacity-70">{al.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Health goal */}
                    <div className="card">
                        <h2 className="font-semibold text-white mb-3">Health Goal</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {HEALTH_GOALS.map((g) => (
                                <button key={g.value} type="button"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${form.healthGoal === g.value ? 'bg-green-500/15 border-green-500/60 text-white' : 'bg-navy-700 border-white/5 text-gray-400 hover:border-white/20'
                                        }`}
                                    onClick={() => set('healthGoal', g.value)}
                                    id={`goal-${g.value}`}
                                >
                                    <span className="text-xl">{g.emoji}</span>
                                    <span className="font-medium text-sm">{g.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.healthGoal && <p className="mt-2 text-xs text-red-400">{errors.healthGoal}</p>}
                    </div>

                    {/* Diet & Allergies */}
                    <div className="card space-y-4">
                        <h2 className="font-semibold text-white">Dietary Preferences & Allergies</h2>
                        <div>
                            <label htmlFor="profile-diet" className="label">Dietary preference</label>
                            <select id="profile-diet" className="input-field" value={form.dietPreference} onChange={(e) => set('dietPreference', e.target.value)}>
                                {DIET_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <p className="label">Allergies (select all that apply)</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {ALLERGY_OPTIONS.map((a) => {
                                    const selected = form.allergies.includes(a);
                                    return (
                                        <button key={a} type="button"
                                            className={`chip cursor-pointer transition-all ${selected ? 'chip-active' : 'hover:border-white/20'}`}
                                            onClick={() => toggleAllergy(a)}
                                            aria-pressed={selected}
                                            id={`allergy-${a.toLowerCase()}`}
                                        >
                                            {selected && <X className="w-3 h-3" />} {a}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2" disabled={loading} id="btn-calculate">
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating…</>
                        ) : (
                            <><ChevronRight className="w-5 h-5" /> Calculate my targets</>
                        )}
                    </button>
                </form>
            </div>
            <div className="max-w-2xl mx-auto w-full mt-8"><Footer /></div>
        </div>
    );
}
