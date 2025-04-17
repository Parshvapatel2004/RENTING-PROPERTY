import axios from "axios";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOTP() {
  const location = useLocation();
  const Email = location.state;
  const [Email_OTP, setEmail_OTP] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/verifyOtp", {
        email: Email,
        otp: Email_OTP,
      });
      toast.success("OTP Verified Successfully!!", {
        onClose: () => navigate("/resetPassword", { state: Email }),
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <section className="w3l-forms-23">
        <div id="forms23-block">
          <div className="wrapper">
            <div className="logo1">
              <Link id="link" className="brand-logo" to="/">
                <span>Renting </span>Properties
              </Link>
            </div>
            <div className="d-grid forms23-grids">
              <div className="form23">
                <h6>Forgot Password?</h6>
                <form onSubmit={handleSubmit}>
                  <label>
                    OTP Sent on your email.
                    <span className="text-danger">*</span>
                  </label>
                  <OTPInput
                    id="otp-input"
                    className="form-control"
                    value={Email_OTP}
                    inputType="text"
                    onChange={setEmail_OTP}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    inputStyle={{
                      borderRadius: "8px",
                      fontWeight: "400",
                      outline: "none",
                      width: "50px",
                      padding: "12px",
                      border: "1px solid black", // Updated to black border
                      lineHeight: "1",
                    }}
                    renderInput={(props) => <input {...props} />}
                  />

                  <button type="submit">Verify OTP</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default VerifyOTP;
