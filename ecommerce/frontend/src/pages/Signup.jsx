import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { AuthContext } from "../App";
import toast from "react-hot-toast";
import "./Auth.css";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [devOTP, setDevOTP] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

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
    const loadingToast = toast.loading("Sending OTP...");

    try {
      const response = await fetch("http://localhost:5000/api/users/send-otp", {
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
        toast.error(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      if (data.devMode && data.otp) {
        setDevOTP(data.otp);
        toast.success(`OTP generated! Check below or console.`, { duration: 8000 });
        console.log('OTP for', email, ':', data.otp);
      } else {
        toast.success("OTP sent to your email!");
        setDevOTP("");
      }
      
      setOtpSent(true);
      setStep(2);
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Send OTP error:", error);
      
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        toast.error(error.message || "Network error. Please check your connection and try again.");
      }
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      const response = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! ✔");

      setUser({
        _id: data.userId,
        name: data.name,
        email: data.email,
        token: data.token,
      });

      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Verify OTP error:", error);
      
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        toast.error(error.message || "Network error. Please check your connection and try again.");
      }
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Resending OTP...");

    try {
      const response = await fetch("http://localhost:5000/api/users/send-otp", {
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
        toast.error(data.message || "Failed to resend OTP");
        setLoading(false);
        return;
      }

      toast.success("OTP resent to your email!");
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to resend OTP");
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
            {step === 1 ? (
              <>
                <h2>Create Account</h2>
                <p className="auth-subtitle">Fill in your details to get started</p>

                <form onSubmit={handleSendOTP} className="auth-form">
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
                        required
                      />
                    </div>
                  </div>

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
                        required
                      />
                    </div>
                  </div>

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
                        required
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
                        required
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

                  <button
                    type="submit"
                    className="btn btn-primary auth-btn"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Verify OTP</h2>
                <p className="auth-subtitle">Enter the 6-digit OTP sent to {email}</p>

                {devOTP && (
                  <div style={{
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 8px 0', color: '#856404', fontSize: '14px' }}>
                      <strong>Development Mode:</strong> OTP not sent via email
                    </p>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1B6B3A',
                      letterSpacing: '8px',
                      fontFamily: 'monospace'
                    }}>
                      {devOTP}
                    </div>
                    <p style={{ margin: '8px 0 0 0', color: '#856404', fontSize: '12px' }}>
                      Use this OTP to verify
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="otp">OTP Code</label>
                    <div className="input-wrapper">
                      <FiShield className="input-icon" />
                      <input
                        type="text"
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input"
                        maxLength={6}
                        required
                        style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary auth-btn"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="btn btn-secondary"
                      disabled={loading}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setOtpSent(false);
                      }}
                      className="btn btn-secondary"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      ← Back to registration
                    </button>
                  </div>
                </form>
              </>
            )}

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
