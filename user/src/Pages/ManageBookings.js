import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import axios from "axios";
import Swal from "sweetalert2";

const ManageRequest = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/get_property_request"
      );
      setRequests(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to change the status to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:8000/update_request", {
            requestId: id,
            status: newStatus,
          });

          Swal.fire(
            "Updated!",
            "Status has been updated successfully.",
            "success"
          );

          fetchData(); // Refresh the data after updating
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error!",
            "Something went wrong. Try again later.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div
      className="container mt-5"
      style={{ minHeight: "90vh", marginBottom: "70px" }}
    >
      <h2 className="text-center mb-4">Manage Property Bookings</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>User Phone</th>
              <th>Property</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.userName}</td>
                  <td>{request.userPhoneNo}</td>
                  <td>{request.propertyTitle}</td>
                  <td>{new Date(request.startDate).toLocaleDateString()}</td>
                  <td>{new Date(request.endDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "Approved" ||
                        request.status === "Paid"
                          ? "badge-success"
                          : request.status === "Rejected" ||
                            request.status === "Canceled"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleStatusChange(request._id, "Confirmed")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleStatusChange(request._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== "Pending" && (
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

export default ManageRequest;
