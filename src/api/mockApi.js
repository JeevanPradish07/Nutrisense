/**
 * mockApi.js – NutriSense mock data layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Every exported function mirrors the shape it will have when wired to a real
 * REST API. To connect the backend simply replace the setTimeout stubs with
 * fetch() / axios() calls to the annotated endpoints.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────

const MOCK_USER = {
    id: 'usr_001',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: null,
};

/** POST /register */
export async function registerUser({ name, email, password }) {
    await delay(800);
    if (email === 'taken@example.com') throw new Error('Email already registered.');
    return { user: { ...MOCK_USER, name, email }, token: 'mock_token_abc123' };
}

/** POST /login */
export async function loginUser({ email, password }) {
    await delay(800);
    if (password !== 'password123') throw new Error('Invalid email or password.');
    return { user: MOCK_USER, token: 'mock_token_abc123' };
}

// ─────────────────────────────────────────────────────────────
// HEALTH / PROFILE
// ─────────────────────────────────────────────────────────────

/** POST /health – compute BMR/TDEE from profile */
export async function calculateTargets(profile) {
    await delay(700);
    // Mifflin-St Jeor (mock calculation)
    const activityMap = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        'very-active': 1.9,
    };
    const w = parseFloat(profile.weight) || 70;
    const h = parseFloat(profile.height) || 165;
    const a = parseInt(profile.age) || 25;
    const isMale = profile.gender === 'male';
    const bmr = isMale
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
    const factor = activityMap[profile.activityLevel] || 1.55;
    const tdee = Math.round(bmr * factor);

    const goalAdjust = {
        'weight-loss': -500,
        maintenance: 0,
        'weight-gain': 300,
        'muscle-gain': 200,
    };
    const calorieTarget = tdee + (goalAdjust[profile.healthGoal] || 0);
    const protein = Math.round((calorieTarget * 0.25) / 4);
    const carbs = Math.round((calorieTarget * 0.45) / 4);
    const fat = Math.round((calorieTarget * 0.30) / 9);

    return {
        bmr: Math.round(bmr),
        tdee,
        calorieTarget,
        macros: { protein, carbs, fat },
    };
}

// ─────────────────────────────────────────────────────────────
// AI RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────

export const MOCK_RECOMMENDATIONS = [
    {
        id: 'rec_001',
        rank: 1,
        name: 'Vegetable Oats Upma',
        mealType: 'Breakfast',
        dietTags: ['Vegetarian', 'High-Fiber'],
        calories: 320,
        protein: 10,
        carbs: 45,
        fat: 8,
        fiber: 6,
        matchScore: 92,
        image: null,
        explanation:
            'Oats provide slow-release carbohydrates ideal for sustained energy. The mixed vegetables add fiber and micronutrients that align with your vegetarian goal. Calorie count fits well under your 400-kcal breakfast cap.',
    },
    {
        id: 'rec_002',
        rank: 2,
        name: 'Paneer Bhurji with Multigrain Roti',
        mealType: 'Lunch',
        dietTags: ['Vegetarian', 'High-Protein'],
        calories: 480,
        protein: 24,
        carbs: 52,
        fat: 16,
        fiber: 4,
        matchScore: 88,
        image: null,
        explanation:
            'Paneer is an excellent vegetarian protein source. Multigrain roti reduces glycemic index. Together they provide a balanced P/C/F ratio close to your personalized macro targets.',
    },
    {
        id: 'rec_003',
        rank: 3,
        name: 'Moong Dal Chilla',
        mealType: 'Breakfast',
        dietTags: ['Vegan', 'Gluten-Free', 'High-Protein'],
        calories: 280,
        protein: 18,
        carbs: 36,
        fat: 5,
        fiber: 7,
        matchScore: 85,
        image: null,
        explanation:
            'Moong dal is rich in plant protein and dietary fiber. This gluten-free option perfectly matches your nut-free dietary restriction and delivers protein well above average for breakfast items.',
    },
    {
        id: 'rec_004',
        rank: 4,
        name: 'Greek-style Curd Bowl',
        mealType: 'Snack',
        dietTags: ['Vegetarian', 'Low-Fat'],
        calories: 190,
        protein: 14,
        carbs: 22,
        fat: 4,
        fiber: 2,
        matchScore: 81,
        image: null,
        explanation:
            'High-protein curd helps with satiety between meals. Garnished with seasonal fruits for natural sugars. Minimal fat makes it ideal as a mid-morning snack within calorie budget.',
    },
    {
        id: 'rec_005',
        rank: 5,
        name: 'Sprouts Masala Salad',
        mealType: 'Snack',
        dietTags: ['Vegan', 'Gluten-Free', 'Nut-Free'],
        calories: 160,
        protein: 9,
        carbs: 24,
        fat: 3,
        fiber: 8,
        matchScore: 78,
        image: null,
        explanation:
            'Sprouted legumes substantially boost protein and fiber bioavailability. This zero-nut, zero-dairy option meets your allergy constraints with high micronutrient density.',
    },
];

/** POST /recommend */
export async function getRecommendations({ query, profile }) {
    await delay(1200);
    // Parse the query for chips display
    const parsed = {
        calorieLimit: query.includes('400') ? '< 400 kcal' : query.includes('500') ? '< 500 kcal' : null,
        diet: query.toLowerCase().includes('vegetarian') ? 'Vegetarian' : query.toLowerCase().includes('vegan') ? 'Vegan' : null,
        allergy: query.toLowerCase().includes('no nuts') ? 'Nut-free' : null,
        mealType: query.toLowerCase().includes('breakfast') ? 'Breakfast' : query.toLowerCase().includes('lunch') ? 'Lunch' : null,
    };
    return { recommendations: MOCK_RECOMMENDATIONS, parsed };
}

// ─────────────────────────────────────────────────────────────
// MEAL PLAN
// ─────────────────────────────────────────────────────────────

export const MOCK_MEAL_PLAN_DAYS = Array.from({ length: 7 }, (_, dayIdx) => ({
    day: dayIdx + 1,
    label: `Day ${dayIdx + 1}`,
    meals: [
        {
            id: `d${dayIdx}_m1`,
            slot: 'Breakfast',
            time: '8:00 AM',
            food: 'Vegetable Oats Upma',
            calories: 320,
            protein: 10,
            carbs: 45,
            fat: 8,
            fiber: 6,
            rating: null,
            thumbs: null,
        },
        {
            id: `d${dayIdx}_m2`,
            slot: 'Mid-Day Snack',
            time: '11:00 AM',
            food: 'Greek-style Curd Bowl',
            calories: 190,
            protein: 14,
            carbs: 22,
            fat: 4,
            fiber: 2,
            rating: null,
            thumbs: null,
        },
        {
            id: `d${dayIdx}_m3`,
            slot: 'Lunch',
            time: '1:30 PM',
            food: 'Paneer Bhurji with Multigrain Roti',
            calories: 480,
            protein: 24,
            carbs: 52,
            fat: 16,
            fiber: 4,
            rating: null,
            thumbs: null,
        },
        {
            id: `d${dayIdx}_m4`,
            slot: 'Dinner',
            time: '7:30 PM',
            food: 'Moong Dal Chilla',
            calories: 280,
            protein: 18,
            carbs: 36,
            fat: 5,
            fiber: 7,
            rating: null,
            thumbs: null,
        },
    ],
}));

export const SWAP_ALTERNATIVES = {
    Breakfast: [
        { food: 'Poha with Peanuts', calories: 310, protein: 8, carbs: 48, fat: 9 },
        { food: 'Idli with Sambar', calories: 295, protein: 9, carbs: 52, fat: 4 },
        { food: 'Besan Cheela', calories: 330, protein: 15, carbs: 38, fat: 10 },
    ],
    'Mid-Day Snack': [
        { food: 'Sprouts Masala Salad', calories: 160, protein: 9, carbs: 24, fat: 3 },
        { food: 'Roasted Chana', calories: 210, protein: 12, carbs: 30, fat: 4 },
        { food: 'Fruit Bowl with Seeds', calories: 175, protein: 4, carbs: 35, fat: 5 },
    ],
    Lunch: [
        { food: 'Rajma Chawal', calories: 490, protein: 20, carbs: 70, fat: 8 },
        { food: 'Quinoa Pulao', calories: 460, protein: 18, carbs: 62, fat: 10 },
        { food: 'Chole with Wheat Paratha', calories: 510, protein: 22, carbs: 68, fat: 12 },
    ],
    Dinner: [
        { food: 'Palak Paneer with Brown Rice', calories: 370, protein: 20, carbs: 42, fat: 12 },
        { food: 'Dal Tadka with Roti', calories: 360, protein: 16, carbs: 55, fat: 7 },
        { food: 'Mixed Veg Stir-fry with Tofu', calories: 310, protein: 18, carbs: 34, fat: 9 },
    ],
};

/** POST /meal-plan */
export async function getMealPlan({ profile, recommendations }) {
    await delay(1000);
    return { days: MOCK_MEAL_PLAN_DAYS };
}

/** PUT /meal-plan/swap */
export async function swapMeal({ mealId, slot }) {
    await delay(600);
    const alts = SWAP_ALTERNATIVES[slot] || [];
    return { alternatives: alts };
}

// ─────────────────────────────────────────────────────────────
// FEEDBACK
// ─────────────────────────────────────────────────────────────

/** POST /feedback */
export async function submitFeedback({ mealId, rating, thumbs }) {
    await delay(400);
    return { success: true, message: "Thanks! We'll use this to improve your recommendations." };
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

export const MOCK_DASHBOARD = {
    stats: {
        plansGenerated: 12,
        avgMatchScore: 87,
        avgDailyKcal: 1640,
    },
    tasteProfile: [
        { category: 'High-protein', weight: 2.0, direction: 'positive' },
        { category: 'Vegetarian', weight: 1.5, direction: 'positive' },
        { category: 'Low-carb', weight: 1.0, direction: 'positive' },
        { category: 'Spicy', weight: 0.5, direction: 'positive' },
        { category: 'Fried', weight: -0.5, direction: 'negative' },
        { category: 'Sugary', weight: -0.8, direction: 'negative' },
    ],
    beforeLearning: [
        { name: 'Aloo Paratha', match: 62 },
        { name: 'Bread Omelette', match: 58 },
        { name: 'Plain Dosa', match: 55 },
    ],
    afterLearning: [
        { name: 'Paneer Bhurji with Multigrain Roti', match: 92 },
        { name: 'Moong Dal Chilla', match: 88 },
        { name: 'Greek-style Curd Bowl', match: 84 },
    ],
    weeklyCalories: [
        { day: 'Mon', target: 1600, actual: 1580 },
        { day: 'Tue', target: 1600, actual: 1640 },
        { day: 'Wed', target: 1600, actual: 1560 },
        { day: 'Thu', target: 1600, actual: 1700 },
        { day: 'Fri', target: 1600, actual: 1620 },
        { day: 'Sat', target: 1600, actual: 1590 },
        { day: 'Sun', target: 1600, actual: 1550 },
    ],
};

/** GET /dashboard */
export async function getDashboard({ userId }) {
    await delay(800);
    return MOCK_DASHBOARD;
}
