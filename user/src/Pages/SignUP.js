import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUP = () => {
  return (
    <div>
      <Main />
    </div>
  );
};

function Main() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    l_Id: "",
    password: "",
    role: "user",
  });
  const [loading, setloading] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors

  const validateForm = () => {
    let newErrors = {};

    // First Name Validation (Only Alphabets)
    if (!/^[A-Za-z]+$/.test(data.firstName)) {
      newErrors.firstName = "First name should contain only letters";
    }

    // Last Name Validation (Only Alphabets)
    if (!/^[A-Za-z]+$/.test(data.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
    }

    // Email Validation (Basic Format Check)
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone Number Validation (Exactly 10 Digits)
    if (!/^\d{10}$/.test(data.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10 digits";
    }

    // Password Validation (Minimum 6 Characters)
    if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // License ID Validation (Only Required for Owners)
    if (data.role === "owner" && !data.l_Id) {
      newErrors.l_Id = "Identify Proof is required for owner";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setData({
      ...data,
      l_Id: e.target.files[0],
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phoneNo", data.phoneNo);
      formData.append("l_Id", data.l_Id);
      formData.append("password", data.password);
      formData.append("role", data.role);

      data.role === "user"
        ? await axios.post("http://localhost:8000/register_user", data)
        : await axios.post("http://localhost:8000/register_owner", formData);

      toast.success("Registration successful", {
        onClose: () => {
          navigate("/login");
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setloading(false);
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
                <h6>Register a new account</h6>
                <form
                  action={"http://localhost:8000/register_user"}
                  method="post"
                >
                  <div className="d-flex gap-2">
                    <div className="w-50">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        onChange={handleChange}
                        value={data.firstName}
                        required
                      />
                      {errors.firstName && (
                        <small className="text-danger">
                          {errors.firstName}
                        </small>
                      )}
                    </div>
                    <div className="w-50">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        onChange={handleChange}
                        value={data.lastName}
                        required
                      />
                      {errors.lastName && (
                        <small className="text-danger">{errors.lastName}</small>
                      )}
                    </div>
                  </div>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    placeholder="Email"
                    required
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                  <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Phone no"
                    onChange={handleChange}
                    value={data.phoneNo}
                    required
                  />
                  {errors.phoneNo && (
                    <small className="text-danger">{errors.phoneNo}</small>
                  )}

                  {data.role === "owner" && (
                    <>
                      <input
                        type="file"
                        name="l_Id"
                        onChange={handleFileChange}
                        required
                      />
                      {errors.l_Id && (
                        <small className="text-danger">{errors.l_Id}</small>
                      )}
                    </>
                  )}

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={data.password}
                    required
                  />
                  {errors.password && (
                    <small className="text-danger">
                      {errors.password}
                      <br />
                    </small>
                  )}

                  {/* Role Selection */}
                  {/* <div className="d-flex  justify-content-center align-items-center  gap-2"> */}
                  <label htmlFor="role" className=" fw-lighter mr-2 ml-2">
                    Role:
                  </label>
                  <select
                    name="role"
                    className="w-50"
                    value={data.role}
                    id="role"
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                  </select>
                  {/* </div> */}

                  <button type="submit" onClick={handleSignUp}>
                    {loading ? "Sending..." : "SignUP"}
                  </button>
                </form>
                <p className="text-center pt-2">
                  Already have an account?{" "}
                  <Link id="link" to="/login">
                    Login now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUP;
