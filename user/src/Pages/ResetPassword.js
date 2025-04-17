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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/changePassword", data);
      toast.success("Password Reset Successfully!!", {
        onClose: () => navigate("/login"),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong!");
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
