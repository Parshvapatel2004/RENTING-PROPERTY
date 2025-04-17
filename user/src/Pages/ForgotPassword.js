import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/sendOtp", { email });
      toast.success("Email Sent Successfully!!", {
        onClose: () => navigate("/verifyOTP", { state: email }),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong!");
    }
    setLoading(false);
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
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required="required"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />

                  <button type="submit"
                  >
                    {
                      loading ? "Sending..." : " Send OTP"
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;
