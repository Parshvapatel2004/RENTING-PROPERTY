import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
import Slider from "../Common/Slider";
import Footer from "../Common/Footer";
import checkSession from "../auth/authService";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  return (
    <>
      <Slider />
      <Navigation />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
  });

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await checkSession();

      if (session.isAuth) {
        setProfile({
          firstName: session.sessionData.first_name,
          lastName: session.sessionData.last_name,
          email: session.sessionData.email,
          profilePic:
            session.sessionData.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditing]);

  // Temporary state for selected Profile picture file
  const [selectedFile, setSelectedFile] = useState(null);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setProfile({ ...profile });
  };

  // Handle image change:
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profilePic: file });
      setSelectedFile(imageUrl);
    };
  }

  // Handle form submission for saving profile:
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("profilePic", profile.profilePic);
      await axios.post("http://localhost:8000/updateProfileAdmin", formData)
      setIsEditing(false);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture.");
    }
  }


  return (
    <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>Admin Profile</h3>
          </div>
        </div>
      </div>
      <div className="clearfix" />
      <div className="row">
        <div className="col-md-12 col-sm-12 ">
          <div className="x_panel">
            <div className="x_content">
              <div className="profile_left">
                <div className="col-md-3 col-sm-3  text-center">
                  <div className="profile_img">
                    <img
                      className="img-responsive avatar-view rounded-circle"
                      src={
                        selectedFile ||
                        `http://localhost:8000/images/profilePic/${profile.profilePic}` ||
                        "/assets/images/nodp.webp"
                      }
                      alt="profile pic"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  {isEditing && (
                    <label
                      className="position-absolute translate-middle-x  p-1 m-1 rounded-circle"
                      style={{ cursor: "pointer", bottom: "35%", right: "25%" }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control mt-2 d-none"
                      />
                      <i className="fa fa-edit" />
                    </label>
                  )}
                  {isEditing ? (
                    <form>
                      <div className="d-flex justify-content-center align-content-center mt-5">
                        <button type="submit" className="btn btn-success mr-5 " onClick={handleSaveProfile}>
                          <i className="fa fa-save m-right-xs mr-2" />
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary "
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3>{profile.firstName}</h3>
                      <p>
                      <i className="fa fa-envelope" />{" "}
                      {profile.email}</p>
                      {/* <ul className="list-unstyled user_data">
                        <li>
                          <i className="fa fa-info user-profile-icon" />{" "}
                          {profile.bio}
                        </li>
                      </ul> */}
                      <button
                        className="btn btn-success"
                        onClick={handleEditToggle}
                      >
                        <i className="fa fa-edit m-right-xs" /> Edit Profile
                      </button>
                    </>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
