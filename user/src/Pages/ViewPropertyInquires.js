import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import axios from "axios";
import { useLocation } from "react-router-dom";

function ViewPropertyInquires() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function Main() {
  const [inquiries, setInquiries] = useState([]);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/get_property_inquiries",
        {
          propertyId: location.state._id,
        }
      );
      setInquiries(response.data.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
    //eslint-disable-next-line
  }, []);

  return (
    <div
      className="container mt-5"
      style={{ minHeight: "90vh", marginBottom: "70px" }}
    >
      <h2 className="text-center mb-4">Property Inquires</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Inquiry</th>
              <th>Inquiry Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No inquiries found.
                </td>
              </tr>
            ) : (
              inquiries.map((payment, index) => (
                <tr key={payment.payment_Id}>
                  <td>{index + 1}</td>
                  <td>{payment.name}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.email}</td>
                  <td>{payment.inquiry}</td>
                  <td>{new Date(payment.inquiryDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewPropertyInquires;
