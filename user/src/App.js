import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Services from "./Pages/Services";
import NotFound from "./Pages/NotFound";
// import Ecommerce from "./Pages/Ecommerce";
// import EcommerceSingle from "./Pages/EcommerceSingle";
import Faq from "./Pages/Faq";
import FindProperty from "./Pages/FindProperty";
import Login from "./Pages/Login";
import SignUP from "./Pages/SignUP";
import Properties from "./Pages/Properties";
import PropertiesSingle from "./Pages/PropertiesSingle";
import SearchResults from "./Pages/SearchResults";
import Profile from "./Pages/Profile";
import OwnerProfile from "./Pages/OwnerProfile";
import ManagePayments from "./Pages/ManagePayments";
import ManageRequest from "./Pages/ManageBookings";
import UploadProperty from "./Pages/UploadProperty";
import MyBookings from "./Pages/MyBookings";
import Booking from "./Pages/Booking";
import ManageProperty from "./Pages/ManageProperty";
import checkSession from "./auth/authService";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";
import MyPayments from "./Pages/MyPayments";
import EditProperty from "./Pages/EditProperty";
import ViewPropertyInquires from "./Pages/ViewPropertyInquires";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  axios.defaults.withCredentials = true;
  const role = localStorage.getItem("role");

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
      <ToastContainer stacked={true} autoClose={1000} />
      {loading ? (
        <h4 className="text-center">Loading...</h4>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignUP /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties_single" element={<PropertiesSingle />} />
            <Route path="/find_property" element={<FindProperty />} />
            <Route path="/search_results" element={<SearchResults />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/verifyOTP" element={<VerifyOTP />} />
            <Route path="/resetPassword" element={<ResetPassword />} />

            {/* user Routes*/}
            <Route
              path="/booking"
              element={
                isAuthenticated && role && role === "user" ? (
                  <Booking />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/my_bookings"
              element={
                isAuthenticated && role && role === "user" ? (
                  <MyBookings />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/my_payments"
              element={
                isAuthenticated && role && role === "user" ? (
                  <MyPayments />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated && role && role === "user" ? (
                  <Profile />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />

            {/* Owener Routes */}
            <Route
              path="/owner_profile"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <OwnerProfile />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/upload_property"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <UploadProperty />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/edit_property"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <EditProperty />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/manage_bookings"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <ManageRequest />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/view_payments"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <ManagePayments />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/view_property_inquiries"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <ViewPropertyInquires />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/view_property"
              element={
                isAuthenticated && role && role === "owner" ? (
                  <ManageProperty />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
