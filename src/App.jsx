import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PremiumPage from "./pages/PremiumPage";
import MySkillsPage from "./pages/MySkillsPage";
import ContactPage from "./pages/ContactPage";
import ContactsPage from "./pages/ContactsPage";
import MessagesPage from "./pages/MessagesPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/skills" element={<MySkillsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/categories" element={<AdminCategoriesPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
