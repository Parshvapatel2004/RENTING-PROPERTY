import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  return (
    <>
      <Main />
    </>
  );
};

function Main() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/admin_login",
        data
      );

      toast.success("Login Successfully!!", {
        onClose: () => window.location.reload(),
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-white overflow_hidden" style={{ minHeight: "100vh" }}>
      <div className="login_wrapper">
        <div className="animate form login_form">
          <section className="login_content">
            <form onSubmit={handleLogin}>
              <h1 style={{ fontSize: "30px", letterSpacing: "1px" }}>
                Login Admin
              </h1>
              <div>
                <input
                  type="email"
                  className="form-control "
                  placeholder="Email"
                  onChange={handleChange}
                  name="email"
                  value={data.email}
                  required
                  style={{ fontSize: "18px", padding: "12px" }}
                />
              </div>
              <div>
                <input
                  type="password"
                  className="form-control"
                  onChange={handleChange}
                  name="password"
                  value={data.password}
                  placeholder="Password"
                  required
                  style={{ fontSize: "18px", padding: "12px" }} // Increased font & padding
                />
              </div>
              <div className="form-group d-flex  justify-content-center align-items-center">
                <button
                  type="submit"
                  className="btn btn-default submit"
                  style={{ fontSize: "18px", padding: "10px 20px" }}
                >
                  Log in
                </button>
                {/* <a
                  className="reset_pass"
                  href="/#"
                  style={{ fontSize: "16px" }}
                >
                  Lost your password?
                </a> */}
              </div>
              <div className="clearfix" />
              <div className="separator">
                <div>
                  <p style={{ fontSize: "12px" }}>
                    ©2025 All Rights Reserved. Renting Properties. Privacy and
                    Terms
                  </p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
