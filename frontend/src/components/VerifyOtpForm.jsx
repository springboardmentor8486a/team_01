import React, { useState } from "react";
import "./VerifyOtpForm.css";
import otpLogo from "../assets/otpmail.png";

function VerifyOtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto-focus next box
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Entered OTP: " + otp.join(""));
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
        <button type="submit">Verify</button>
      </form>

      <div className="resend-text">
        Didn’t receive the code? <a href="#">Resend</a>
      </div>
    </div>
  );
}

export default VerifyOtpForm;
