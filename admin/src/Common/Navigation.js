import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import checkSession from "../auth/authService";

const Navigation = () => {
  useEffect(() => {
    const menuToggle = document.getElementById("menu_toggle");

    const handleToggleClick = () => {
      const body = document.body;
      const sidebarMenu = document.getElementById("sidebar-menu");

      const isNavMd = body.classList.contains("nav-md");

      if (isNavMd) {
        // Hide submenus and switch to active-sm
        sidebarMenu.querySelectorAll("li.active ul").forEach((ul) => {
          ul.style.display = "none";
        });
        sidebarMenu.querySelectorAll("li.active").forEach((li) => {
          li.classList.add("active-sm");
          li.classList.remove("active");
        });
      } else {
        // Show submenus and switch back to active
        sidebarMenu.querySelectorAll("li.active-sm ul").forEach((ul) => {
          ul.style.display = "block";
        });
        sidebarMenu.querySelectorAll("li.active-sm").forEach((li) => {
          li.classList.add("active");
          li.classList.remove("active-sm");
        });
      }

      // Toggle nav-md/nav-sm
      body.classList.toggle("nav-md");
      body.classList.toggle("nav-sm");

      // Redraw DataTables if any
      // const tables = document.querySelectorAll(".dataTable");
      // tables.forEach((table) => {
      //   const dataTable = $(table).DataTable(); // Assuming DataTables is used via jQuery
      //   dataTable.draw();
      // });
    };

    menuToggle.addEventListener("click", handleToggleClick);

    return () => {
      menuToggle.removeEventListener("click", handleToggleClick);
    };
  }, []);

  return (
    <>
      <Main />
    </>
  );
};

function Main() {
  const [userData, setUserData] = useState({});

  const fetchData = async () => {
    const sessionData = await checkSession();

    if (sessionData.isAuth) {
      setUserData({
        firstName: sessionData.sessionData.first_name,
        lastName: sessionData.sessionData.last_name,
        email: sessionData.sessionData.email,
        profilePic: sessionData.sessionData.profilePic,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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
    <div className="top_nav open">
      <div className="nav_menu">
        <div className="nav toggle">
          <Link id="menu_toggle" to="#">
            <i className="fa fa-bars"></i>
          </Link>
        </div>
        <nav className="nav navbar-nav">
          <ul className="navbar-right">
            <li
              className="nav-item dropdown open"
              style={{ paddingLeft: "15px" }}
            >
              <Link
                className="user-profile dropdown-toggle"
                to="#"
                aria-haspopup="true"
                id="navbarDropdown"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={`http://localhost:8000/images/profilePic/${userData.profilePic}`}
                  alt="no-image"
                  style={{objectFit: "cover",objectPosition: "center"}}
                />
                Admin
              </Link>
              <div
                className="dropdown-menu dropdown-usermenu pull-right"
                aria-labelledby="navbarDropdown"
              >
                <Link className="dropdown-item" to={"/profile"}>
                  Profile
                </Link>
                <Link className="dropdown-item" onClick={handleLogout}>
                  <i className="fa fa-sign-out pull-right"></i> Log Out
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navigation;
