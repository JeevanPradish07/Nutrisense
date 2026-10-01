# NutriSense – AI-Powered Food Recommendation System for Personalized Meal Planning

> **Academic Project** — For educational purposes only. Not a substitute for professional medical or nutritional advice.

---

## 📌 Overview

NutriSense is a fully-responsive, dark-themed **React + Tailwind CSS** frontend for an AI-powered food recommendation and personalized meal planning system. It uses realistic mock data structured to be swapped with real REST API calls.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 4 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Context API |

---

## 📁 Project Structure

```
src/
├── api/
│   └── mockApi.js          # All mock data & simulated fetch functions
│                           # Replace each function with a real REST call
├── components/
│   ├── Navbar.jsx          # Sticky top navigation
│   ├── Footer.jsx          # Disclaimer footer (every page)
│   ├── Modal.jsx           # Reusable accessible modal
│   ├── ToastContainer.jsx  # Global toast notifications
│   └── UI.jsx              # Shared atoms (badges, bars, skeletons, etc.)
├── context/
│   └── AppContext.jsx      # Global state (user, profile, targets, plan)
└── pages/
    ├── Landing.jsx         # Hero + features + CTA
    ├── Auth.jsx            # Sign in / Sign up tabs
    ├── Profile.jsx         # Step 1: Profile & Goals form
    ├── Targets.jsx         # Step 2: BMR/TDEE + macro donut chart
    ├── Recommendations.jsx # Step 3: AI search + ranked food cards
    ├── MealPlan.jsx        # Step 4: 7-day timeline + feedback + charts
    └── Dashboard.jsx       # Stats, taste profile, learning comparison
```

---

## 📡 REST API Endpoints (to connect)

All mock functions in `src/api/mockApi.js` are annotated with the endpoint they will call:

| Mock Function | Endpoint | Method |
|---|---|---|
| `registerUser` | `/register` | POST |
| `loginUser` | `/login` | POST |
| `calculateTargets` | `/health` | POST |
| `getRecommendations` | `/recommend` | POST |
| `getMealPlan` | `/meal-plan` | POST |
| `swapMeal` | `/meal-plan/swap` | PUT |
| `submitFeedback` | `/feedback` | POST |
| `getDashboard` | `/dashboard` | GET |

---

## 🎨 Design System

- **Background**: Deep navy (`#0A0F1E` / `#0D1526`)
- **Primary accent**: Green (`#22C55E`)
- **Secondary accent**: Orange (`#F97316`)
- **Typography**: Inter / Poppins (Google Fonts)
- **Macro colors**: Protein = Blue · Carbs = Amber · Fat = Pink · Fiber = Green

---

## 🖥️ Pages

1. **Landing** — Hero, floating AI preview card, 4 feature cards
2. **Auth** — Sign in / Sign up with inline validation
3. **Profile** — Step 1: age, gender, weight, height, activity, goal, diet, allergies
4. **Targets** — Step 2: BMR, TDEE, calorie target, macro donut chart
5. **Recommendations** — Step 3: Natural-language search, parsed chips, ranked food cards with AI match %, "Why this?" modal
6. **Meal Plan** — Step 4: 7-day tabs, meal timeline, swap modal, star/thumbs feedback, nutrition table, bar chart, AI insight panel
7. **Dashboard** — Stats, learned taste profile, before/after learning comparison, weekly calorie line chart

---

## 🏃 Running Locally

```bash
cd nutrisense
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:** any name + email, password: `password123`

---

## ⚕️ Disclaimer

This project is for **academic and educational purposes only**. It is not a substitute for professional medical or nutritional advice.
