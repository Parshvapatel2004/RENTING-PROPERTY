import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Inquiries = () => {
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
  // Inquiries
  const [inquiries, setInquiries] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_inquiry"
      );
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setInquiries(revesedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Admin response & loading state update
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});

  // Handle response input change
  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  // Handle submitting a response
  const handleResponseSubmit = async (id) => {
    if (!responses[id]) {
      toast.warning("Please write a response before submitting.");
      return;
    }

    setLoading({ ...loading, [id]: true });

    try {
      const res = await axios.post("http://localhost:8000/respond_contactus", {
        contactId: id,
        responseMessage: responses[id],
      });

      if (res.status === 200) {
        setInquiries(
          inquiries.map((inquiry) =>
            inquiry._id === id
              ? { ...inquiry, response: responses[id], status: "Resolved" }
              : inquiry
          )
        );
        setResponses({ ...responses, [id]: "" });
        toast.success("Response sent successfully!");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to send response. Please try again.");
    }

    setLoading({ ...loading, [id]: false }); // Reset loading state
  };


  return (
    <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>Manage Contact Inquiries</h3>
          </div>
        </div>
        <div className="clearfix" />

        {/* Inquiries List */}
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title">
                <h2>User Inquiries</h2>
                <div className="clearfix" />
              </div>
              <div className="x_content">
                {inquiries.length === 0 ? (
                  <p>No inquiries available.</p>
                ) : (
                  inquiries.map((inquiry) => (
                    <div key={inquiry._id} className="well">
                      <h4>{inquiry.name}</h4>
                      <p>
                        <strong>Email:</strong> {inquiry.email}
                      </p>
                      <p>
                        <strong>Subject:</strong> {inquiry.subject}
                      </p>
                      <p>
                        <strong>Message:</strong> {inquiry.message}
                      </p>
                      <p>
                        <strong>Status: </strong>
                        <span
                          className={`badge ${inquiry.status === "Pending"
                              ? "bg-warning"
                              : inquiry.status === "Resolved"
                                ? "bg-success text-light"
                                : "bg-danger text-light"
                            }`}
                        >
                          {inquiry.status}
                        </span>
                      </p>

                      {/* Admin Response Section */}
                      {inquiry.response ? (
                        <p>
                          <strong>Admin Response:</strong> {inquiry.response}
                        </p>
                      ) : (
                        <div>
                          <textarea
                            className="form-control"
                            placeholder="Write a response..."
                            value={responses[inquiry._id] || ""}
                            onChange={(e) =>
                              handleResponseChange(inquiry._id, e.target.value)
                            }
                          />
                          <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={() => handleResponseSubmit(inquiry._id)}
                            disabled={loading[inquiry._id]}
                          >
                            {loading[inquiry._id]
                              ? "Sending..."
                              : "Submit Response"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inquiries;
