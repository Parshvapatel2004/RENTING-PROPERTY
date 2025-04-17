import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Payments = () => {
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
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // PDF Download Function
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Payments Report", 14, 15);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Table columns
    const headers = [
      [
        "#",
        "Transaction ID",
        "User",
        "Property",
        "Owner",
        "Amount",
        "Method",
        "Date&Time",
        "Status",
      ],
    ];

    // Table rows
    const data = payments.map((payment, index) => [
      index + 1,
      payment.transactionId || "N/A",
      `${payment.userName || "N/A"} (${payment.user_Id || "N/A"})`,
      `${payment.propertyName || "N/A"} (${payment.property_Id || "N/A"})`,
      `${payment.ownerName || "N/A"} (${payment.owner_Id || "N/A"})`,
      `Rs.${payment.amount || "0"}`,
      payment.paymentMethod || "N/A",
      payment.paymentDate
        ? new Date(payment.paymentDate).toLocaleString()
        : "N/A",
      payment.status || "N/A",
    ]);

    // Generate table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25,
      styles: {
        fontSize: 7, // Smaller font size to fit all columns
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue color
        textColor: 255, // White text
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 8 }, // #
        1: { cellWidth: 25 }, // Transaction ID
        2: { cellWidth: 25 }, // User
        3: { cellWidth: 25 }, // Property
        4: { cellWidth: 25 }, // Owner
        5: { cellWidth: 15 }, // Amount
        6: { cellWidth: 15 }, // Method
        7: { cellWidth: 25 }, // Date&Time
        8: { cellWidth: 15 }, // Status
      },
      margin: { left: 5 }, // Smaller left margin
    });

    // Save the PDF
    doc.save(`payments_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_payment"
      );
      const responseData = response.data.payments || [];
      const revesedData = responseData.reverse();
      setPayments(revesedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = payments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(payments.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="right_col" role="main" style={{ minHeight: "117vh" }}>
        <div className="mb-5">
          <div className="page-title">
            <div className="title_left">
              <h3>Manage Payments</h3>
            </div>
          </div>
          <div className="clearfix" />

          {/* Payments Table */}
          <div className="row">
            <div className="col-md-12">
              <div className="x_panel">
                <div className="x_title d-flex justify-content-between align-items-center">
                  <h2>Payments List</h2>
                  {payments.length > 0 && (
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
                  <table className="table table-striped projects table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Transaction ID</th>
                        <th>User</th>
                        <th>Property</th>
                        <th>Owner</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Date&Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center">
                            No payments found.
                          </td>
                        </tr>
                      ) : (
                        currentRecords.map((payment, index) => (
                          <tr key={payment.id}>
                            <td>{index + 1}</td>
                            <td>{payment.transactionId}</td>
                            <td>
                              {payment.userName}<br />({payment.user_Id})
                            </td>
                            <td>
                              {payment.propertyName}<br />({payment.property_Id})
                            </td>
                            <td>
                              {payment.ownerName}<br />({payment.owner_Id})
                            </td>
                            <td>₹{payment.amount}</td>
                            <td>{payment.paymentMethod}</td>
                            <td>
                              {new Date(payment.paymentDate).toLocaleString()}
                            </td>
                            <td>
                              <span
                                className={`p-1 badge ${payment.status === "pending"
                                    ? "bg-warning"
                                    : payment.status === "Success"
                                      ? "bg-success text-white"
                                      : "bg-danger text-white"
                                  }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between align-items-center p-5">
                    <span>
                      Showing {indexOfFirstRecord + 1} to{" "}
                      {Math.min(indexOfLastRecord, payments.length)} of{" "}
                      {payments.length} entries
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Payment Modal */}
        {selectedPayment && (
          <div
            className="modal-overlay"
            style={{ marginBottom: "70px", minHeight: "55vh" }}
          >
            <div className="modal-content px-5 py-3">
              <h3 className="pb-2">Payment Details</h3>
              <p>
                <strong>Transaction ID:</strong> {selectedPayment.transactionId}
              </p>
              <p>
                <strong>User:</strong> {selectedPayment.userName} (
                {selectedPayment.user_Id})
              </p>
              <p>
                <strong>Property:</strong> {selectedPayment.propertyName} (
                {selectedPayment.property_Id})
              </p>
              <p>
                <strong>Owner:</strong> {selectedPayment.ownerName} (
                {selectedPayment.owner_Id})
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedPayment.amount}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
              </p>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;
