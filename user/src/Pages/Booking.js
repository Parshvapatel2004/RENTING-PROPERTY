import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Booking = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const navigate = useNavigate();
  const location = useLocation();

  const propertyData = location.state;

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    property_Id: propertyData._id,
    owner_Id: propertyData.owner_Id,
  });

  const [error, setError] = useState("");

  // Fetch Properties & Owners from API (Simulated)
  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
  }, []);

  // Handles form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Booking Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input fields
    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.property_Id ||
      !formData.owner_Id
    ) {
      setError("Please fill all required fields.");
      return;
    }

    // Ensure startDate is before endDate
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End Date must be after Start Date.");
      return;
    }

    setError(""); // Clear previous errors
    try {
      await axios.post("http://localhost:8000/send_request", formData);
      toast.success("Booking Confirmed!", {
        onClose: () => navigate("/my_bookings"),
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center">
        <h1>Book a Property</h1>
        <p>Book your ideal property today.</p>
      </div>

      {/* Booking Form */}
      <div className="booking-form mt-5 p-4 border rounded shadow">
        <h2>Booking Details</h2>
        {error && <p className="text-danger">{error}</p>}
        <h4>{propertyData.title}</h4>
        <form onSubmit={handleSubmit}>
          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={formData.endDate}
              min={
                (formData.startDate &&
                  new Date(formData.startDate).toISOString().split("T")[0]) ||
                new Date().toISOString().split("T")[0]
              }
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success btn-lg w-100">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
