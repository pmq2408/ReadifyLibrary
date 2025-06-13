import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../../contexts/UserContext";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho toast
import "./Login.scss";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email: username,
          password: password,
        }
      );
      login(response.data.accessToken);
      toast(`Chào mừng bạn đến với fptu-library.xyz`);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Login error", error);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/google-login`,
        {
          token: response.credential,
        }
      );
      login(res.data.accessToken);
      toast(`Chào mừng bạn đến với fptu-library.xyz`);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Google login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Google login error", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-card">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng đến với Thư viện FPT</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>

          <div className="divider">
            <span>Hoặc</span>
          </div>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleLogin}
            />
          </div>

          <div className="login-footer">
            <p>Thư viện FPT University</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
