import { BrowserRouter, Route, Routes } from "react-router-dom";
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
function App() {
    return (
        <BrowserRouter>
            <RouteScrollToTop />
            <Routes>
                <Route exact path="/" element={<HomePageTwo />} />

                {/* SL */}
                <Route exact path="/add-user" element={<AddUserPage />} />
                <Route exact path="/alert" element={<AlertPage />} />
                <Route exact path="/assign-role" element={<AssignRolePage />} />
                <Route exact path="/avatar" element={<AvatarPage />} />
                <Route exact path="/badges" element={<BadgesPage />} />
                <Route exact path="/button" element={<ButtonPage />} />
                <Route
                    exact
                    path="/calendar-main"
                    element={<CalendarMainPage />}
                />
                <Route exact path="/calendar" element={<CalendarMainPage />} />
                <Route exact path="/my-profile" element={<ViewProfilePage />} />
                <Route exact path="/sign-in" element={<SignInPage />} />
                <Route exact path="/sign-up" element={<SignUpPage />} />

                <Route exact path="/application" element={<WizardPage />} />

                <Route exact path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
