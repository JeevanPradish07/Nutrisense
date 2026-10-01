import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [targets, setTargets] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((msg, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const logout = () => {
        setUser(null);
        setProfile(null);
        setTargets(null);
        setRecommendations([]);
        setMealPlan(null);
    };

    return (
        <AppContext.Provider
            value={{
                user, setUser,
                profile, setProfile,
                targets, setTargets,
                recommendations, setRecommendations,
                mealPlan, setMealPlan,
                toasts, addToast, removeToast,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
