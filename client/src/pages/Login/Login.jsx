import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Aucontext/Aucontext";
import "./Login.css";

const fakeUsers = [
    { email: "user@example.com", password: "user", role: "user" },
    { email: "admin@example.com", password: "admin", role: "admin" },
    { email: "library@example.com", password: "library", role: "library" }
];

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        const foundUser = fakeUsers.find(user => user.email === email && user.password === password);
        if (foundUser) {
            login(foundUser.role);
        } else {
            setError("Tài khoản hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-section">
                {error && <p className="text-red-500">{error}</p>}
                <div className="text-start">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email"
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <br />
                <div className="text-start">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <button className="btn btn-primary mt-2 w-full" onClick={handleLogin}>
                    Đăng nhập
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
