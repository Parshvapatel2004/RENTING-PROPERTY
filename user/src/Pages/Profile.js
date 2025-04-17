import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import checkSession from "../auth/authService";

const Profile = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [isEditing, setIsEditing] = useState(false);  // State to manage editing mode

  const [passwordVisible, setPasswordVisible] = useState(false);// State to manage password visibility
  const [selectedFile, setSelectedFile] = useState(null);// State to store Selected File Temporary

// State to store user data
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
});

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Validation
  const [errors, setErrors] = useState({}); // Store validation errors

  const validateForm = () => {
    let newErrors = {};

    // First Name Validation (Only Alphabets)
    if (!/^[A-Za-z]+$/.test(user.firstName)) {
      newErrors.firstName = "First name should contain only letters";
    }

    // Last Name Validation (Only Alphabets)
    if (!/^[A-Za-z]+$/.test(user.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
    }

    // Email Validation (Basic Format Check)
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone Number Validation (Exactly 10 Digits)
    if (!/^\d{10}$/.test(user.phoneNo)) {
      newErrors.phoneNo = "Phone number must be 10 digits";
    }

    // Password Validation (Minimum 6 Characters)
    if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Bio Validation (Optional)
    if (user.bio.length < 20) {
      newErrors.bio = "Bio must be at least 20 characters"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePic: file });
      setSelectedFile(imageUrl);
    }
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }


    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("phoneNo", user.phoneNo);
      formData.append("bio", user.bio);
      formData.append("profilePic", user.profilePic);

      user.profilePic !== "/assets/images/nodp.webp"
        ? await axios.post("http://localhost:8000/update_profile", formData)
        : await axios.post("http://localhost:8000/update_profile", {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          bio: user.bio,
        });

      setIsEditing(false);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await checkSession();

      if (session.isAuth) {
        setUser({
          firstName: session.sessionData?.firstName,
          lastName: session.sessionData?.lastName,
          email: session.sessionData?.email,
          password: session.sessionData?.password,
          phoneNo: session.sessionData?.phoneNo,
          bio: session.sessionData?.bio || "N/A",
          profilePic:
            session.sessionData?.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditing]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout");
      toast.success("Logged out successfully!", {
        onClose: () => window.location.reload(),
      });
    } catch (error) {
      toast.error("Logout failed!", { position: "top-right" });
      console.error(error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-5 text-center w-50"
        style={{ borderRadius: "15px" }}
      >
        {/* Profile Image Section */}
        <div className="position-relative d-flex justify-content-center">
          <Link
            to={`http://localhost:8000/images/profilePic/${user.profilePic}`}
          >
            <img
              src={
                selectedFile ||
                `http://localhost:8000/images/profilePic/${user.profilePic}` ||
                "/assets/images/nodp.webp"
              }
              alt="Profile"
              className="rounded-circle shadow-sm align-content-center"
              width="140"
              height="140"
              style={{ objectFit: "cover", border: "4px solid #007bff" }}
            />
          </Link>
          {isEditing && (
            <label
              className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-lg"
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleProfilePicChange}
              />
              <i className="fa fa-camera text-primary"></i>
            </label>
          )}
        </div>

        {isEditing ? (
          // Editable form
          <div className="mt-3">

            {/* firstName & lastName */}
            <div className="d-flex justify-content-center align-content-center gap-2 mb-3">
              <div className="w-50">
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  className="form-control mb-1"
                  placeholder="Enter name"
                  required
                />
                {errors.firstName && (
                  <small className="text-danger mr-5">
                    {errors.firstName}
                  </small>
                )}
              </div>
              <div className="w-50">
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="form-control mb-1"
                  required
                />
                {
                  errors.lastName && (
                    <small className="text-danger mr-5">{errors.lastName}</small>
                  )
                }
              </div>
            </div>
            {/* Email Input */}
            <div className="mb-3 input-group">
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="form-control "
                placeholder="Enter email"
                required
              />
              {errors.email && (
                <small className="text-danger mt-2 mx-2">{errors.email}</small>
              )}
            </div>

            {/* Password Input */}
            <div className="input-group mb-3">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter password"
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                    }`}
                ></i>
              </span>
              {errors.password && (
                <small className="text-danger mt-2 mx-2">{errors.password}</small>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-3 input-group">
              <input
                input type="tel"
                placeholder="Enter your phone number"
                pattern="^[0-9]+$"
                name="phoneNo"
                value={user.phoneNo}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.phoneNo && (
                <small className="text-danger mx-2 mt-2">{errors.phoneNo}</small>
              )}
            </div>

            {/* Bio Input */}
            <div className="input-group mb-3">
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Enter bio"
                rows="3"
              ></textarea>

              {errors.bio && (
                <small className="text-danger mt-2 mx-2">{errors.bio}</small>
              )}
            </div>

            <button
              className="btn btn-success me-2 shadow-sm w-40"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-secondary shadow-sm w-40"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          // Display profile details
          <>
            <h2 className="card-title mt-3">
              {user.firstName} {user.lastName}
            </h2>
            <p className="card-text text-muted">{user.email}</p>
            <p className="card-text">{user.bio}</p>
            <div className="d-flex justify-content-center text-center align-items-center">
              <button
                className="btn btn-primary me-3 shadow-sm w-40"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger shadow-sm w-40"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
