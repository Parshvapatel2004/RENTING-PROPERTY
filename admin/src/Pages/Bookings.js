import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageBookings = () => {
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
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Bookings Report", 14, 15);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Table columns
    const headers = [
      [
        "#",
        "Booking Date",
        "Start Date",
        "End Date",
        "Owner ID",
        "Property ID",
        "User",
        "Status",
      ],
    ];

    // Table rows
    const data = bookings.map((booking, index) => [
      index + 1,
      new Date(booking.bookingDate).toLocaleDateString(),
      new Date(booking.startDate).toLocaleDateString(),
      new Date(booking.endDate).toLocaleDateString(),
      booking.owner_Id || "N/A",
      booking.property_Id || "N/A",
      `${booking.user || "N/A"} (${booking.user_Id || "N/A"})`,
      booking.status || "N/A",
    ]);

    // Generate table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 8 }, // #
        1: { cellWidth: 20 }, // Booking Date
        2: { cellWidth: 20 }, // Start Date
        3: { cellWidth: 20 }, // End Date
        4: { cellWidth: 20 }, // Owner ID
        5: { cellWidth: 20 }, // Property ID
        6: { cellWidth: 30 }, // User
        7: { cellWidth: 20 }, // Status
      },
    });

    // Save the PDF
    doc.save(`bookings_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Fetch user data from the server:
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_booking"
      );
      const responseData = response.data.userDetails || [];
      const revesedData = responseData.reverse();
      setBookings(revesedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Function to handle View action
  const handleView = (user) => {
    setSelectedUser(user);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = bookings.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(bookings.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "110vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>
              Manage Bookings <small>Details</small>
            </h3>
          </div>
        </div>
        <div className="clearfix" />
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title d-flex justify-content-between align-items-center">
                <h2>Bookings List</h2>
                  {bookings.length > 0 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={downloadPDF}
                    >
                      <i className="fa fa-download mr-1"></i> Download PDF
                    </button>
                  )}
                {/* <div className="clearfix" /> */}
              </div>
              <div className="x_content">
                {bookings.length === 0 ? (
                  <p>No Bookings available.</p>
                ) : (
                  <>
                    <div>
                      <p>List of all Bookings.</p>
                      <table className="table table-striped projects">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Booking Date</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Owner_Id</th>
                            <th>Property_Id</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRecords.map((booking, index) => (
                            <tr key={booking._id}>
                              <td>{index + 1}</td>
                              <td>
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(
                                  booking.startDate
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                {new Date(booking.endDate).toLocaleDateString()}
                              </td>
                              <td>{booking.owner_Id}</td>
                              <td>{booking.property_Id}</td>
                              <td>
                                {booking.user}
                                <br />({booking.user_Id})
                              </td>
                              <td>
                                <span
                                  className={`p-1 badge ${booking.status === "pending"
                                    ? "bg-warning"
                                    : booking.status === "Success"
                                      ? "bg-success text-white"
                                      : booking.status === "Booked"
                                        ? "bg-success text-white"
                                        : "bg-danger text-white"
                                    }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleView(booking)}
                                >
                                  <i className="fa fa-eye" /> View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <span>
                        Showing {indexOfFirstRecord + 1} to{" "}
                        {Math.min(indexOfLastRecord, bookings.length)} of{" "}
                        {bookings.length} entries
                      </span>
                      <ul className="pagination mb-0">
                        {[...Array(totalPages).keys()].map((page) => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page + 1 ? "active" : ""
                              }`}
                            onClick={() => handlePageChange(page + 1)}
                          >
                            <button className="page-link">{page + 1}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View booking Modal */}
      {selectedUser && (
        <div className="modal-overlay" style={{ marginBottom: "70px", minHeight: '65vh' }}>
          <div className="modal-content px-5 py-3">
            <h3 className="pb-2">Booking Details</h3>
            <p>
              <strong>ID:</strong> {selectedUser._id}
            </p>
            <p>
              <strong>Booking Date: </strong>{" "}
              {new Date(selectedUser.bookingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Start Date: </strong>{" "}
              {new Date(selectedUser.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date: </strong>{" "}
              {new Date(selectedUser.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Owner_Id: </strong> {selectedUser.owner_Id}
            </p>
            <p>
              <strong>property_Id: </strong> {selectedUser.property_Id}
            </p>
            <p>
              <strong>user_Id: </strong> {selectedUser.user_Id}
            </p>
            <p>
              <strong>Status: </strong> {selectedUser.status}
            </p>

            <button
              className="btn btn-secondary"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
