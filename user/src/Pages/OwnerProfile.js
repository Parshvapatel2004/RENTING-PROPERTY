import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import checkSession from "../auth/authService";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
  // State to manage editing mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // State to manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // State to manage temporary selected file for profile picture
  const [selectedFile, setSelectedFile] = useState(null);

  // State to store user data
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
  });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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

  // Handle Profile Picture Change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePic: file });
      setSelectedFile(imageUrl);
    }
  };

  // Handle Profile Change
  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  // Handle Profile Save
  const handleProfileSave = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("password", user.password);
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

      setIsEditingProfile(false);
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
          firstName: session.sessionData.firstName,
          lastName: session.sessionData.lastName,
          email: session.sessionData.email,
          password: session.sessionData.password,
          phoneNo: session.sessionData.phoneNo,
          bio: session.sessionData.bio || "N/A",
          profilePic:
            session.sessionData.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditingProfile]);

  // Handle Logout
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
    <div
      className="container-fluid bg-light vh-100 d-flex justify-content-center align-items-center"
      style={{ marginTop: "50px", marginBottom: "200px" }}
    >
      <div className="card shadow-lg p-4 text-center w-75">
        {/* Profile  Image Section */}
        <div className="position-relative d-inline-block">
          <Link to={`http://localhost:8000/images/profilePic/${user.profilePic}`}>

            <img
              src={
                selectedFile ||
                `http://localhost:8000/images/profilePic/${user.profilePic}` ||
                "/assets/images/nodp.webp"
              }
              alt="Profile"
              className="rounded-circle mb-3"
              width="120"
              height="120"
              style={{ objectFit: "cover", border: "4px solid black" }}
            />
          </Link>
          {isEditingProfile && (
            <label
              className="position-absolute translate-middle-x  p-1 m-1 rounded-circle"
              style={{ cursor: "pointer", bottom: "5%", right: "42%" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
              />
              <i className="fa fa-edit" />
            </label>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSave}>
            <div className="row">
              {/* First Name Input */}
              <div className="col-6 mb-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={user.firstName}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
                {errors.firstName && (
                  <small className="text-danger mr-5">
                    {errors.firstName}
                  </small>
                )}
              </div>
              {/* Last Name Input */}
              <div className="col-6 mb-2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={user.lastName}
                  onChange={handleProfileChange}
                  className="form-control"
                  required
                />
                {errors.lastName && (
                  <small className="text-danger mr-5">
                    {errors.lastName}
                  </small>
                )}
              </div>

              {/* Email Input */}
              <div className="col-6 mb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="form-control "
                  required
                />
                {errors.email && (
                  <small className="text-danger mr-5">
                    {errors.email}
                  </small>
                )}
              </div>
               {/* Phone Number Input */}
              <div className="col-6 mb-2">
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Enter your phone number"
                  value={user.phoneNo}
                  onChange={handleProfileChange}
                  className="form-control"
                  required
                />
                  {errors.phoneNo && (
                <small className="text-danger mr-5 mt-2">{errors.phoneNo}</small>
              )}
              </div>
              {/* Password Input */}
              <div className="col-6 mb-2" style={{ width: "100%" }}>
                <div className="input-group gap-2" ><input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={user.password}
                  placeholder="Enter your password"
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
                  <div className="w-20">
                    <span
                      className="input-group-text bg-light"
                      style={{ cursor: "pointer" }}
                      onClick={togglePasswordVisibility}
                    >
                      <i
                        className={`p-1  fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                          }`}
                      ></i>
                    </span>
                  </div>
                  {errors.password && (
                    <small className="text-danger mt-2 mx-2">{errors.password}</small>
                  )}
                </div>
              </div>

              {/* Bio Input */}
              <div className="col-12 mb-2">
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Enter your bio"
                />
                {errors.bio && (
                  <small className="text-danger my-2 mx-2">{errors.bio}</small>
                )}
              </div>
            </div>
            {/* <h4 className="mt-4">Identity Verification</h4>
            <div className="form-group">
              <label>Identity Type:</label>
              <select
                name="identityType"
                value={user.identityType}
                onChange={handleProfileChange}
                className="form-control"
                required
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label>Identity ID Number:</label>
              <input
                type="text"
                name="identityId"
                value={user.identityId}
                placeholder="Enter ID number"
                onChange={handleProfileChange}
                className="form-control"
                required
              />
            </div> */}
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditingProfile(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h3 className="card-title">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-muted">
              {user.email} | {user.phoneNo}
            </p>
            <p className="card-text">{user.bio}</p>
            {/* {user.identityType && user.identityId && ( */}
            {/* <div className="mb-2 d-flex justify-content-center align-content-center gap-3">
              <p>
                <strong>Identity Type:</strong>{" "}
                {!user.identityType ? "No data" : user.identityType}
              </p>
              <p>
                <strong>Identity ID:</strong>{" "}
                {!user.identityId ? "No data" : user.identityId}
              </p>
            </div> */}
            {/* )} */}
            <div className="d-flex justify-content-center gap-2 align-items-center">
              <button
                className="btn btn-primary mb-4"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger mb-4 ms-2"
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
