import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import ManageProperites from "./Pages/ManageProperites";
import ManageUsers from "./Pages/ManageUsers";
import ManageOwners from "./Pages/ManageOwners";
import Feedback from "./Pages/Feedback";
import Complains from "./Pages/Complains";
import Payments from "./Pages/Payments";
import Inquiries from "./Pages/Inquiries";
import { useEffect, useState } from "react";
import checkSession from "./auth/authService";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import ManageBookings from "./Pages/Bookings";
import NotFound from "./Pages/NotFound";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  axios.defaults.withCredentials = true;

  //for checking session
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const checkAuth = await checkSession();

        if (checkAuth.isAuth) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false after authentication check
      }
    };
    if (!isAuthenticated) {
      authenticateUser(); // Check session only if user is not authenticated
    } else {
      setLoading(false); // Set loading to false immediately if user is authenticated
    }
  }, [isAuthenticated]);

  return (
    <>
      <ToastContainer autoClose={1000} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_payments"
            element={isAuthenticated ? <Payments /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_feedbacks"
            element={isAuthenticated ? <Feedback /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_inquiries"
            element={isAuthenticated ? <Inquiries /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_complains"
            element={isAuthenticated ? <Complains /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_users"
            element={isAuthenticated ? <ManageUsers /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_owners"
            element={isAuthenticated ? <ManageOwners /> : <Navigate to="/" />}
          />
          <Route
            path="/manage_properties"
            element={
              isAuthenticated ? <ManageProperites /> : <Navigate to="/" />
            }
          />
          <Route
            path="/manage_bookings"
            element={
              isAuthenticated ? <ManageBookings /> : <Navigate to="/" />
            }
          />
          <Route path="/*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
