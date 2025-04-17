import React, { useState, useEffect } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManageProperties = () => {
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
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataItems, setDataItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Properties Report", 14, 15);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Table columns
    const headers = [
      ["#", "Property", "Type", "Location", "Price", "Status", "Owner"],
    ];

    // Table rows
    const data = dataItems.map((property, index) => [
      index + 1,
      property.title || "N/A",
      property.propertyType || "N/A",
      property.location || "N/A",
      property.price || "N/A",
      property.status ? property.status.toUpperCase() : "N/A",
      property.ownerName || "N/A",
    ]);

    // Generate table using autoTable directly
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
      columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 30 }, // Property
        2: { cellWidth: 20 }, // Type
        3: { cellWidth: 30 }, // Location
        4: { cellWidth: 20 }, // Price
        5: { cellWidth: 20 }, // Status
        6: { cellWidth: 30 }, // Owner
      },
    });

    // Save the PDF
    doc.save(`properties_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Fetch Properties:
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admin_fetch_all_property"
      );
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setDataItems(revesedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Handle Delete Property action:
  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(
          `http://localhost:8000/delete_property/${propertyId}`
        );
        toast.success("Property deleted successfully");
        setDataItems(
          dataItems.filter((property) => property._id !== propertyId)
        );
      } catch (error) {
        toast.error("Failed to delete property. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  // Open View Modal
  const handleView = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedProperty(null);
  };

  // Allow closing modals with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter data based on search input:
  const filteredData = dataItems.filter(
    (item) =>
      (item.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.address ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.zipCode ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.propertyType ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.status ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.ownerName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic:
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Handle page change:
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "110vh" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="x_panel">
            <div className="x_title d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Properties List</h2>
                {dataItems.length > 0 && (
                  <button
                    className="btn btn-success btn-sm ml-3 mt-2"
                    onClick={downloadPDF}
                    style={{ height: "32px" }}
                  >
                    <i className="fa fa-download mr-1"></i>Download PDF
                  </button>
                )}
              </div>
              {/* Right-aligned search bar */}
              <div className="d-flex justify-content-end">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search properties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "250px" }}
                />
              </div>
            </div>
            <div className="x_content">
              {currentRecords.length === 0 ? (
                <p className="text-center">No properties available.</p>
              ) : (
                <div>
                  <p>List of all available properties.</p>
                  <table className="table table-striped projects table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((property, index) => (
                        <tr key={property.id}>
                          <td>{index + 1}</td>
                          <td>{property.title}</td>
                          <td>{property.propertyType}</td>
                          <td>{property.location}</td>
                          <td>₹{property.price}</td>
                          <td>
                            <span
                              className={`badge ${
                                property.status === "Pending" ||
                                property.status === "deleted"
                                  ? "bg-danger text-white"
                                  : "bg-success text-white"
                              }`}
                            >
                              {property.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-xs btn-primary m-1"
                              onClick={() => handleView(property)}
                            >
                              <i className="fa fa-eye" /> View
                            </button>
                            <button
                              className="btn btn-xs btn-danger m-1"
                              onClick={() => handleDelete(property._id)}
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
                      {Math.min(indexOfLastRecord, filteredData.length)} of{" "}
                      {filteredData.length} entries
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Property Modal */}
      {modalOpen && selectedProperty && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Property Details</h5>
                <button type="button" className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {selectedProperty.title}
                </p>
                <p>
                  <strong>Type:</strong> {selectedProperty.propertyType}
                </p>
                <p>
                  <strong>Location:</strong> {selectedProperty.location}
                </p>
                <p>
                  <strong>Price:</strong> ₹{selectedProperty.price}
                </p>
                <p>
                  <strong>Size:</strong> {selectedProperty.size}
                </p>
                <p>
                  <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
                </p>
                <p>
                  <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
                </p>
                <p>
                  <strong>Status:</strong> {selectedProperty.status}
                </p>
                <p>
                  <strong>Owner:</strong> {selectedProperty.ownerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProperties;
