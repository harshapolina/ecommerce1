import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { AuthContext } from "../App";
import toast from "react-hot-toast";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Signing you in...");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadToast);

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      setUser({
        _id: data.userId,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        token: data.token,
      });

      toast.success("Welcome back!");
      navigate("/");
      setLoading(false);

    } catch (error) {
      toast.dismiss(loadToast);
      
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        toast.error(error.message || "Network error. Please check your connection and try again.");
      }
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider, providerName) => {
    setLoading(true);
    const loadToast = toast.loading(`Signing in with ${providerName}...`);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch("http://localhost:5000/api/users/social-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          provider: providerName.toLowerCase(),
          providerId: user.uid,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadToast);

      if (!response.ok) {
        throw new Error(data.message || "Social login failed");
      }

      setUser({
        _id: data.userId,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        token: data.token,
      });

      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
    } catch (error) {
      toast.dismiss(loadToast);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in popup was closed");
      } else if (error.code?.startsWith("auth/")) {
        toast.error("Authentication failed. Please try again.");
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        toast.error(error.message || "Social login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(googleProvider, "Google");

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        
        {/* LEFT SECTION */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="logo-icon">
              <span>F</span>
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue shopping and track your orders.</p>

          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
            alt="Furniture"
            className="auth-image"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit} className="auth-form">
              
              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    className="input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button 
                className="social-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#000" fillRule="evenodd">
                    <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
                    <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.21 1.18-.84 2.08-1.84 2.68l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.38z" fill="#4285F4"/>
                    <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"/>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.96 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"/>
                  </g>
                </svg>
                Google
              </button>
            </div>

            <p className="auth-footer">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
