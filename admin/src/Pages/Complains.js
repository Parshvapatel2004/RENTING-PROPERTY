import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Complaints = () => {
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
  // Complaints
  const [complaints, setComplaints] = useState([]);
  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_complaint"
      );
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setComplaints(revesedData);
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
  const handleResponseSubmit = async (complaintId) => {
    const responseMessage = responses[complaintId] || "";

    if (!responseMessage.trim()) {
      toast.warning("Response message cannot be empty.");
      return;
    }
    setLoading({ ...loading, [complaintId]: true });

    try {
      const res = await axios.post("http://localhost:8000/respond_complaint", {
        complaintId,
        responseMessage,
      });
      if (res.status === 200) {
        setComplaints(complaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaints, responseMessage: responseMessage, status: 'Resolved' } : complaint
        ))

      }
      setResponses({ ...responses, [complaintId]: "" });
      toast.success("Response sent successfully!");

      // Refresh complaints after response submission
      getData();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response.");
    }

    setLoading({ ...loading, [complaintId]: false });
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>Manage Complaints</h3>
          </div>
        </div>
        <div className="clearfix" />

        {/* Complaints List */}
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title">
                <h2>User Complaints</h2>
                <div className="clearfix" />
              </div>
              <div className="x_content">
                {complaints.length === 0 ? (
                  <p>No complaints available.</p>
                ) : (
                  complaints.map((complaint) => (
                    <div key={complaint.id} className="well">
                      <h4>{complaint.name}</h4>
                      <p>
                        <strong>Email:</strong> {complaint.email}
                      </p>
                      <p>
                        <strong>Complaint:</strong> {complaint.complaint}
                      </p>
                      <p>
                        <strong>Status: </strong>
                        <span
                          className={`badge ${complaint.status === "Pending"
                            ? "bg-warning"
                            : complaint.status === "Resolved"
                              ? "bg-success text-light"
                              : "bg-danger text-light"
                            }`}
                        >
                          {complaint.status}
                        </span>
                      </p>

                      {/* Admin Response Section */}
                      {complaint.response ? (
                        <p>
                          <strong>Admin Response:</strong> {complaint.response}
                        </p>
                      ) : (
                        <div>
                          <textarea
                            className="form-control"
                            placeholder="Write a response..."
                            value={responses[complaint._id] || ""}
                            onChange={(e) =>
                              handleResponseChange(
                                complaint._id,
                                e.target.value
                              )
                            }
                          />
                          <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={() => handleResponseSubmit(complaint._id)}

                            disabled={loading[complaint._id]}
                          >
                            {
                              loading[complaint._id] ? "Sending..." : " Submit Response"
                            }
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

export default Complaints;
