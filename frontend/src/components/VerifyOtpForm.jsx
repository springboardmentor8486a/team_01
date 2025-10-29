import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail, setOtp } from "../store/authSlice";
import "./VerifyOtpForm.css";
import otpLogo from "../assets/otpmail.png";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtpForm() {
  const [otp, setOtpLocal] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtpLocal(newOtp);

      // auto-focus next box
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const email = location.state?.email;
    const otpValue = otp.join("");
    if (!email) {
      setError("Email is missing. Please retry the forgot password process.");
      return;
    }
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });
      if (response.data && response.data.success) {
        dispatch(setEmail(email));
        dispatch(setOtp(otpValue));
        alert("OTP verified successfully");
        // Navigate to reset password page or home page as needed
        navigate("/reset-password", { state: { email } });
      } else {
        setError(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
      console.error("Verify OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verifyotp-box">
      <div className="otp-icon">
        <img src={otpLogo} alt="Verify OTP Logo" className="otp-img" />
      </div>

      <h2>Verify your Email</h2>
      <p>Please enter the 6-digit code sent to your email address</p>

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>
        {error && <div className="otp-error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="resend-text">
        Didn’t receive the code? <a href="#">Resend</a>
      </div>
    </div>
  );
}

export default VerifyOtpForm;
