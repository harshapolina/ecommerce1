import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
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

      // Save user data in context
      setUser({
        _id: data.userId,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        token: data.token,
      });

      toast.success("Welcome back!");
      navigate("/");
      setLoading(false);

    } catch (error) {
      toast.dismiss(loadToast);
      toast.error("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        
        {/* LEFT SECTION */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="logo-icon">
              <span>F</span>
            </div>
            <span className="logo-text">Furniture</span>
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
              <button className="social-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Google
              </button>

              <button className="social-btn">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
                Facebook
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
