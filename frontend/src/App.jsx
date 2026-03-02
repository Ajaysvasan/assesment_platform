import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Instructor specific routes
import { Dashboard } from "./pages/Dashboard";
import { CreateExam } from "./pages/CreateExam";
import { EvaluateExam } from "./pages/EvaluateExam";
import { ExamResults } from "./pages/ExamResults";
import { UploadAnswerKey } from "./pages/UploadAnswerKey";
import { Profile } from "./pages/Profile";
import { ReportBug } from "./pages/ReportBug";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute allowedRole="CONDUCTOR" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/evaluate/:examId" element={<EvaluateExam />} />
          <Route path="/results/:examId" element={<ExamResults />} />
          <Route
            path="/upload-answer-key/:examId"
            element={<UploadAnswerKey />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report-bug" element={<ReportBug />} />
        </Route>

        <Route
          path="/student-dashboard"
          element={
            <div className="p-10 text-white bg-slate-950 min-h-screen">
              Student Dashboard Placeholder
            </div>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <div className="p-10 text-white bg-slate-950 min-h-screen">
              Admin Dashboard Placeholder
            </div>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <div className="p-10 text-red-400 bg-slate-950 min-h-screen">
              Unauthorized access.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
