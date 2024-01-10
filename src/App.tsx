import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import Login from "./_auth/forms/Login";
import Register from "./_auth/forms/Register";
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                {/* Public Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Private Routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>

            <Toaster />
        </main>
    );
};

export default App;
