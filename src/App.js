import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePageTwo from "./pages/HomePageTwo";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import AssignRolePage from "./pages/AssignRolePage";
import AvatarPage from "./pages/AvatarPage";
import BadgesPage from "./pages/BadgesPage";
import ButtonPage from "./pages/ButtonPage";
import CalendarMainPage from "./pages/CalendarMainPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ErrorPage from "./pages/ErrorPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/sign-in" replace />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/sign-in" replace />;
    }
  } catch (e) {
    localStorage.removeItem("token");
    return <Navigate to="/sign-in" replace />;
  }
  return children;
}

function App() {
    return (
        <BrowserRouter>
            <RouteScrollToTop />
            <Routes>
                <Route exact path="/sign-in" element={<SignInPage />} />
                <Route exact path="/sign-up" element={<SignUpPage />} />
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePageTwo />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/add-user"
                  element={
                    <PrivateRoute>
                      <AddUserPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/alert"
                  element={
                    <PrivateRoute>
                      <AlertPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/assign-role"
                  element={
                    <PrivateRoute>
                      <AssignRolePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/avatar"
                  element={
                    <PrivateRoute>
                      <AvatarPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/badges"
                  element={
                    <PrivateRoute>
                      <BadgesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/button"
                  element={
                    <PrivateRoute>
                      <ButtonPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/calendar-main"
                  element={
                    <PrivateRoute>
                      <CalendarMainPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <CalendarMainPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/my-profile"
                  element={
                    <PrivateRoute>
                      <ViewProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/application"
                  element={
                    <PrivateRoute>
                      <WizardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="*"
                  element={
                    <PrivateRoute>
                      <ErrorPage />
                    </PrivateRoute>
                  }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
