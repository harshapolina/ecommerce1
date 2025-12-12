import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from "../App";
import toast from "react-hot-toast";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! ✔");

      // save user info (optional, backend usually returns user object)
      setUser({
        name: name,
        email: email,
        token: data.token,
      });

      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Server error. Try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="logo-icon">
              <span>F</span>
            </div>
            <span className="logo-text">Furniture</span>
          </div>

          <h1>Join Us Today</h1>
          <p>Create an account and get 25% off your first order!</p>

          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"
            alt="Furniture"
            className="auth-image"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Fill in your details to get started</p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* NAME */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
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

              {/* CONFIRM PASSWORD */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="#">Terms & Conditions</a>
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="btn btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* SOCIAL LOGIN */}
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
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
