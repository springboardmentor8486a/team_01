import React, { useState, useRef } from "react";
import axios from "axios";
import "./VerifyOtpForm.css";
import otpLogo from "../assets/otpmail.png";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const inputsRef = useRef([]); // To manage focus on inputs

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus the next input box if a digit is entered
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace to move to the previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^[0-9]+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      inputsRef.current[pasteData.length - 1]?.focus();
    }
  };
  
  const handleResendOtp = async () => {
    const email = location.state?.email;
    if (!email) {
      setError("Email is missing. Cannot resend OTP.");
      return;
    }
    try {
      // This is where you would call your API to resend the OTP
      // await axios.post("http://localhost:3000/api/auth/resend-otp", { email });
      alert(`A new OTP has been sent to ${email}`);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
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
    try {
      const response = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });
      if (response.data && response.data.success) {
        alert("OTP verified successfully");
        navigate("/reset-password", { state: { email } });
      } else {
        setError(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
      console.error("Verify OTP error:", error);
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
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el} // Add ref to each input
              id={`otp-input-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        {error && <div className="otp-error">{error}</div>}
        <button type="submit">Verify</button>
      </form>

      <div className="resend-text">
        Didn’t receive the code?{" "}
        {/* --- THIS IS THE CORRECTED PART --- */}
        <button type="button" className="resend-button" onClick={handleResendOtp}>
          Resend
        </button>
      </div>
    </div>
  );
}

export default VerifyOtpForm;