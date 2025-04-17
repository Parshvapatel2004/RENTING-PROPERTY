import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageOwners = () => {
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
  // Owner Data
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/fetch_all_owner");
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setOwners(revesedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Function to handle View action
  const handleView = (owner) => {
    setSelectedOwner(owner);
  };

  // Function to handle Delete action
  const handleDelete = async (ownerId) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      try {
        await axios.delete(`http://localhost:8000/delete_owner/${ownerId}`);
        toast.success("Owner deleted");
        setOwners(owners.filter((owner) => owner._id !== ownerId));
      } catch (error) {
        toast.error("Failed to delete owner. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  // Function to download owners data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Owners Report", 14, 15);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Table columns
    const headers = [["#", "Owner Name", "Email", "Contact", "Joined Date"]];

    // Table rows
    const data = owners.map((owner, index) => [
      index + 1,
      `${owner.firstName} ${owner.lastName}`,
      owner.email,
      owner.phoneNo || "N/A",
      owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : "N/A",
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
        fillColor: [41, 128, 185], // Blue color
        textColor: 255, // White text
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save(`owners_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = owners.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(owners.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "113vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>
              Manage Owners <small>Details</small>
            </h3>
          </div>
        </div>
        <div className="clearfix" />
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title d-flex justify-content-between align-items-center">
                <h2>Owners List</h2>
                {owners.length > 0 && (
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
                {owners.length === 0 ? (
                  <p>No owners available.</p>
                ) : (
                  <>
                    <p>List of all property owners.</p>
                    <table className="table table-striped projects table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Owner</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((owner, index) => (
                          <tr key={owner._id}>
                            <td>{index + 1}</td>
                            <td>
                              {owner.firstName} {owner.lastName}
                            </td>
                            <td>{owner.email}</td>
                            <td>{owner.phoneNo}</td>
                            <td>
                              <button
                                className="btn btn-xs btn-primary m-1"
                                onClick={() => handleView(owner)}
                              >
                                <i className="fa fa-eye" /> View
                              </button>
                              <button
                                className="btn btn-xs btn-danger m-1"
                                onClick={() => handleDelete(owner._id)}
                              >
                                <i className="fa fa-trash" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <span>
                        Showing {indexOfFirstRecord + 1} to{" "}
                        {Math.min(indexOfLastRecord, owners.length)} of{" "}
                        {owners.length} entries
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

      {/* View Owner Modal */}
      {selectedOwner && (
        <div
          className="modal-overlay"
          style={{ marginBottom: "70px", minHeight: "50vh" }}
        >
          <div className="modal-content px-5 py-3">
            <h3 className="pb-2">Owner Details</h3>
            <p>
              <strong>ID:</strong> {selectedOwner._id}
            </p>
            <p>
              <strong>Name:</strong> {selectedOwner.firstName}{" "}
              {selectedOwner.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedOwner.email}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOwner.phoneNo}
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedOwner(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageOwners;
