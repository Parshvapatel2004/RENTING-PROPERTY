import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageUsers = () => {
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
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch user data from the server:
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch_all_user");
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setUsers(revesedData);
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

  // Function to handle Delete action
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/delete_user/${userId}`);
        toast.success("User deleted");
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        toast.error("Failed to delete user. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  // Function to generate and download PDF
  const downloadPDF = () => {
    // Import jsPDF with autotable plugin
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("User Report", 14, 15);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Table columns
    const headers = [["#", "Name", "Email", "Contact", "Joined Date"]];

    // Table rows
    const data = users.map((user, index) => [
      index + 1,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.phoneNo || "N/A",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    ]);

    // Generate table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = users.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(users.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="right_col " role="main" style={{ minHeight: "110vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>
              Manage Users <small>Details</small>
            </h3>
          </div>
        </div>
        <div className="clearfix" />
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title d-flex justify-content-between align-items-center">
                <h2>Users List</h2>
                {users.length > 0 && (
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
                {users.length === 0 ? (
                  <p>No Users available.</p>
                ) : (
                  <>
                    <div>
                      <p>List of all registered users.</p>
                      <table className="table table-striped projects table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRecords.map((user, index) => (
                            <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>
                                {user.firstName} {user.lastName}
                              </td>
                              <td>{user.email}</td>
                              <td>{user.phoneNo}</td>
                              <td>
                                <button
                                  className="btn btn-xs btn-primary m-1"
                                  onClick={() => handleView(user)}
                                >
                                  <i className="fa fa-eye" /> View
                                </button>
                                <button
                                  className="btn btn-xs btn-danger m-1"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  <i className="fa fa-trash" /> Delete
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
                        {Math.min(indexOfLastRecord, users.length)} of{" "}
                        {users.length} entries
                      </span>
                      <ul className="pagination mb-0">
                        {[...Array(totalPages).keys()].map((page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              currentPage === page + 1 ? "active" : ""
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

      {/* View User Modal */}
      {selectedUser && (
        <div
          className="modal-overlay "
          style={{ marginBottom: "70px", minHeight: "50vh" }}
        >
          <div className="modal-content px-5 py-5">
            <h3 className="pb-2">User Details</h3>
            <p>
              <strong>ID:</strong> {selectedUser._id}
            </p>
            <p>
              <strong>Name:</strong> {selectedUser.firstName}{" "}
              {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Contact:</strong> {selectedUser.phoneNo}
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

export default ManageUsers;
