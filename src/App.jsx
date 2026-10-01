import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Targets from './pages/Targets';
import Recommendations from './pages/Recommendations';
import MealPlan from './pages/MealPlan';
import Dashboard from './pages/Dashboard';

// Guard: redirect to /profile if not set up yet
function RequireProfile({ children }) {
  const { profile } = useApp();
  return profile ? children : <Navigate to="/profile" replace />;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
