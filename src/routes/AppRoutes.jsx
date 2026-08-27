import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Register from "../pages/Register";
import DesignPreview from "../pages/_DesignPreview";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import CareerBank from "../pages/CareerBank";
import CareerDetail from "../pages/CareerDetail";
import AdminCareers from "../pages/admin/AdminCareers";
import Quiz from "../pages/Quiz";
import QuizResults from "../pages/QuizResults";
import AdminQuiz from "../pages/admin/AdminQuiz";
import MultimediaCenter from "../pages/MultimediaCenter";
import MediaDetail from "../pages/MediaDetail";
import SuccessStories from "../pages/SuccessStories";
import SubmitStory from "../pages/SubmitStory";
import ResourceLibrary from "../pages/ResourceLibrary";
import AdminMedia from "../pages/admin/AdminMedia";
import AdminStories from "../pages/admin/AdminStories";
import AdminResources from "../pages/admin/AdminResources";
import Bookmarks from "../pages/Bookmarks";
import Feedback from "../pages/Feedback";
import Notifications from "../pages/Notifications";
import AdminFeedback from "../pages/admin/AdminFeedback";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ─── PUBLIC ROUTES (VISITORS ALLOWED PER SRS) ────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/design-preview" element={<DesignPreview />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Public Discovery Scope (Careers, Quiz, Media, Stories, Resources) */}
      <Route path="/careers" element={<CareerBank />} />
      <Route path="/careers/:id" element={<CareerDetail />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/results/:attemptId" element={<QuizResults />} />
      <Route path="/media" element={<MultimediaCenter />} />
      <Route path="/media/:id" element={<MediaDetail />} />
      <Route path="/stories" element={<SuccessStories />} />
      <Route path="/resources" element={<ResourceLibrary />} />

      {/* ─── LOGIN-REQUIRED ROUTES (AUTHENTICATED ONLY) ───────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stories/submit"
        element={
          <ProtectedRoute>
            <SubmitStory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Admin-only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/careers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminCareers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quiz"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminMedia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminStories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminResources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminFeedback />
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes will mount here as modules complete */}
    </Routes>
  );
}
