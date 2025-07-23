import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import StatusPage from "./pages/StatusPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path='/admin' element={<AdminDashboardPage />} />
        <Route path='/status' element={<StatusPage />} />
        <Route path='/questionnaire' element={<QuestionnairePage />} />
        <Route path='/upload' element={<DocumentUploadPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
