import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
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
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/get_user_booking"
      );
      setBookings(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  const handleCancelBooking = async (e, requestId) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/cancel_booking", { requestId });
      toast.success("Booking Cancelled Successfully!!", {
        onClose: () => fetchData(),
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const displayRazorpay = async (booking) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Please check network connection!");
      return;
    }

    try {
      // Step 1: Create an order on the backend
      const days = calculateDays(booking.startDate, booking.endDate);
      const months = Math.ceil(days / 30); // Round up to nearest full month
      const totalPrice = months * booking.propertyPrice;

      const orderResponse = await axios.post(
        "http://localhost:8000/generateOrderId",
        {
          totalPrice: totalPrice,
        }
      );

      if (!orderResponse.data || !orderResponse.data.order) {
        toast.error("Failed to get order details. Please try again.");
        return;
      }
      // Step 2: Extract order details
      const {
        amount: orderAmount,
        id: order_id,
        currency,
      } = orderResponse.data.order;

      const options = {
        key: "rzp_test_VQhEfe2NCXbbwI",
        amount: orderAmount.toString(),
        currency: currency,
        name: "Renting Properties",
        order_id: order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify the payment
            const verifyResponse = await axios.post(
              "http://localhost:8000/make_payment",
              {
                requestId: booking._id,
                property_Id: booking.property_Id,
                owner_Id: booking.owner_Id,
                startDate: booking.startDate,
                endDate: booking.endDate,
                amount: totalPrice,
                transactionId: order_id,
              }
            );

            toast.success(verifyResponse.data.message, {
              onClose: () => navigate("/"),
            });
          } catch (error) {
            toast.error(error.response.data.message);
            console.error("Payment verification failed:", error);
          }
        },
        prefill: {
          name: "Renting Properties",
          email: "rentingproperties@email.com",
          contact: "7096894573",
        },
        notes: {
          address: "Ahmedabad",
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ minHeight: "90vh", marginBottom: "70px" }}
    >
      <h2 className="text-center mb-4">My Bookings</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>Property</th>
              <th>Price</th>
              <th>Owner ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking._id}</td>
                  <td>{booking.propertyName}</td>
                  <td>₹{booking.propertyPrice}</td>
                  <td>{booking.owner_Id}</td>
                  <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === "Confirmed"
                          ? "badge-info"
                          : booking.status === "Paid"
                          ? "badge-success"
                          : booking.status === "Canceled"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === "Pending" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => handleCancelBooking(e, booking._id)}
                      >
                        Cancel
                      </button>
                    ) : booking.status === "Confirmed" ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => displayRazorpay(booking)}
                      >
                        Pay
                      </button>
                    ) : (
                      <span className="text-muted">Action Taken</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyBookings;
