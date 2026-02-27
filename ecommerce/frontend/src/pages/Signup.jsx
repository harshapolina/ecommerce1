import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { AuthContext } from "../App";
import toast from "react-hot-toast";
import { validatePassword } from "../utils/passwordValidation";
import API_URL from "../config/api";
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
  const [passwordErrors, setPasswordErrors] = useState([]);

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

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Sending OTP...");

    try {
      const response = await fetch(`${API_URL}/api/users/send-otp`, {
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

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        toast.dismiss(loadingToast);
        toast.error(text || "Failed to send OTP");
        setLoading(false);
        return;
      }

      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Failed to send OTP";
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      if (data.success !== false) {
        toast.success("OTP sent to your email! Please check your inbox and spam folder.");
      } else {
        toast.error(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }
      
      setOtpSent(true);
      setStep(2);
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please check your connection and try again.");
      } else if (error instanceof SyntaxError) {
        toast.error("Server error. Please try again later.");
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
      const response = await fetch(`${API_URL}/api/users/verify-otp`, {
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
        isAdmin: data.isAdmin || false,
        token: data.token,
      });

      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      
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
      const response = await fetch(`${API_URL}/api/users/send-otp`, {
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

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        toast.dismiss(loadingToast);
        toast.error(text || "Failed to resend OTP");
        setLoading(false);
        return;
      }

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
      
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please check your connection and try again.");
      } else if (error instanceof SyntaxError) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Failed to resend OTP");
      }
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider, providerName) => {
    setLoading(true);
    const loadToast = toast.loading(`Signing up with ${providerName}...`);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(`${API_URL}/api/users/social-auth`, {
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
        throw new Error(data.message || "Social signup failed");
      }

      setUser({
        _id: data.userId,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        token: data.token,
      });

      toast.success(`Welcome, ${data.name}!`);
      navigate("/");
    } catch (error) {
      toast.dismiss(loadToast);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-up popup was closed");
      } else if (error.code?.startsWith("auth/")) {
        toast.error("Authentication failed. Please try again.");
      } else if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else {
        toast.error(error.message || "Social signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => handleSocialSignup(googleProvider, "Google");

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="logo-icon">
              <span>F</span>
            </div>
          </div>

          <h1>Join Us Today</h1>
          <p>Create an account and get 25% off your first order!</p>

          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"
            alt="Furniture"
            className="auth-image"
          />
        </div>

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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (e.target.value) {
                            const validation = validatePassword(e.target.value);
                            setPasswordErrors(validation.errors);
                          } else {
                            setPasswordErrors([]);
                          }
                        }}
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
                    {password && passwordErrors.length > 0 && (
                      <div style={{
                        marginTop: '8px',
                        padding: '12px',
                        background: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '6px', color: '#856404' }}>
                          Password must contain:
                        </div>
                        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
                          {passwordErrors.map((error, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {password && passwordErrors.length === 0 && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: '#d4edda',
                        border: '1px solid #28a745',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#155724'
                      }}>
                        ✓ Password meets all requirements
                      </div>
                    )}
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
              <button 
                className="social-btn"
                onClick={handleGoogleSignup}
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
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
