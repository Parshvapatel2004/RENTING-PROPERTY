import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function MyPayments() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function Main() {
  const [payments, setPayments] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/view_payment_user"
      );
      setPayments(response.data.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = () => {
    // Create PDF in landscape mode for better width
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(18);
    doc.text("Payment Records", 14, 15);

    // Add current date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare data for the table
    const tableData = payments.map((payment, index) => [
      index + 1,
      payment._id,
      payment.booking_Id,
      payment.user_Id,
      payment.property_Id,
      `Rs.${payment.amount.toLocaleString()}`,
      new Date(payment.paymentDate).toLocaleDateString(),
      payment.paymentMethod,
      payment.transactionId,
      payment.status,
    ]);

    // Define column widths that fit all content
    const columnStyles = {
      0: { cellWidth: 10 }, // #
      1: { cellWidth: 30 }, // Payment ID
      2: { cellWidth: 25 }, // Booking ID
      3: { cellWidth: 20 }, // User ID
      4: { cellWidth: 25 }, // Property ID
      5: { cellWidth: 20 }, // Amount
      6: { cellWidth: 25 }, // Date
      7: { cellWidth: 20 }, // Method
      8: { cellWidth: 30 }, // Transaction ID
      9: { cellWidth: 20 }, // Status
    };

    // Add table with adjusted settings
    autoTable(doc, {
      head: [
        [
          "#",
          "Payment ID",
          "Booking ID",
          "User ID",
          "Property ID",
          "Amount",
          "Payment Date",
          "Method",
          "Transaction ID",
          "Status",
        ],
      ],
      body: tableData,
      startY: 30,
      margin: { left: 10, right: 10 }, // Add margins
      tableWidth: "auto",
      styles: {
        cellPadding: 3, // Slightly more padding
        fontSize: 9, // Slightly larger font
        valign: "middle",
        halign: "center",
        overflow: "linebreak", // Handle text overflow
      },
      headStyles: {
        fillColor: [34, 34, 34],
        textColor: 255,
        fontStyle: "bold",
        cellPadding: 4,
      },
      columnStyles: columnStyles,
      didDrawPage: function (data) {
        // Footer
        doc.setFontSize(10);
        doc.text(
          `Page ${data.pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Save the PDF
    doc.save(`payment_records_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  return (
    <div
      className="container mt-5"
      style={{ minHeight: "90vh", marginBottom: "70px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Payment Records</h2>
        <button
          onClick={downloadPDF}
          className="btn btn-primary"
          disabled={payments.length === 0}
        >
          <i className="fas fa-file-pdf mr-2"></i> Download PDF
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Property ID</th>
              <th>Amount (₹)</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
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
              payments.map((payment, index) => (
                <tr key={payment.payment_Id}>
                  <td>{index + 1}</td>
                  <td>{payment._id}</td>
                  <td>{payment.booking_Id}</td>
                  <td>{payment.user_Id}</td>
                  <td>{payment.property_Id}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.transactionId}</td>
                  <td>
                    <span
                      className={`badge ${
                        payment.status === "Success"
                          ? "badge-success"
                          : payment.status === "Failed"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {payment.status}
                    </span>
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

export default MyPayments;
