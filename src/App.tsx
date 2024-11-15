import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthContextProvider } from "./lib/context/auth-context";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage";
import PrivateOutlet from "./pages/PrivateOutlet";
import QuizPage from "./pages/Quiz";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import QuizIndex from "./pages/QuizIndex";
import UserDashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import Leaderboard from "./pages/Leaderboard";
import IssuesPage from "./pages/Issues";

function App() {
    return (
        <>
            <AuthContextProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user/*" element={<PrivateOutlet />}>
                        <Route path="dashboard" element={<UserDashboard />} />
                        <Route path="quiz" element={<QuizIndex />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="issues" element={<IssuesPage />} />
                        <Route path="quiz/:id" element={<QuizPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthContextProvider>
        </>
    );
}

export default App;
