import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState({
    email: location.state,
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors

  const validateForm = () => {
    let newErrors = {};

    // Password Validation (Minimum 8 Characters + Strong Pattern)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (data.newPassword.length < 8) {
      newErrors.newPassword = "New Password must be at least 8 characters";
    } else if (!strongPasswordRegex.test(data.newPassword)) {
      newErrors.newPassword =
        "New Password must include uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/changePassword", data);
      toast.success("Password Reset Successfully!!", {
        onClose: () => navigate("/login"),
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
                <h6>Change Password</h6>
                <form onSubmit={handleSubmit}>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Password"
                    value={data.newPassword}
                    onChange={(e) =>
                      setData({ ...data, newPassword: e.target.value })
                    }
                    required
                  />
                  {errors.newPassword && (
                    <small className="text-danger">
                      {errors.newPassword}
                      <br />
                    </small>
                  )}
                  <input
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) =>
                      setData({ ...data, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <button type="submit">Change Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;
