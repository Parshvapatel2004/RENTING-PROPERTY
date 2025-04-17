import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ManagePayments = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [payments, setPayments] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/view_payment");
      setPayments(response.data.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);

    setTimeout(() => {
      // Create PDF in landscape mode with wider dimensions
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add title
      doc.setFontSize(18);
      doc.text("Payment Records - Management Report", 14, 15);

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
        `₹${payment.amount.toLocaleString()}`,
        new Date(payment.paymentDate).toLocaleDateString(),
        payment.paymentMethod,
        payment.transactionId,
        payment.status,
      ]);

      // Calculate column widths based on content
      const columnWidths = [10, 25, 25, 20, 25, 20, 25, 25, 30, 20];
      const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

      // Add table with dynamic column widths
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
        margin: { left: 10 },
        tableWidth: totalWidth,
        styles: {
          cellPadding: 2,
          fontSize: 8,
          valign: "middle",
          halign: "center",
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [34, 34, 34],
          textColor: 255,
          fontStyle: "bold",
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: columnWidths[0] },
          1: { cellWidth: columnWidths[1] },
          2: { cellWidth: columnWidths[2] },
          3: { cellWidth: columnWidths[3] },
          4: { cellWidth: columnWidths[4] },
          5: { cellWidth: columnWidths[5] },
          6: { cellWidth: columnWidths[6] },
          7: { cellWidth: columnWidths[7] },
          8: { cellWidth: columnWidths[8] },
          9: { cellWidth: columnWidths[9] },
        },
        didDrawPage: function (data) {
          doc.setFontSize(10);
          doc.text(
            `Page ${data.pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      doc.save(
        `management_payment_records_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
      setIsGeneratingPDF(false);
    }, 0);
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
        {payments.length > 0 && (
          <button
            onClick={downloadPDF}
            className="btn btn-primary"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-file-pdf mr-2"></i> Download PDF Report
              </>
            )}
          </button>
        )}
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

export default ManagePayments;
