import React, { useEffect, useState } from "react";
import Slider from "../Common/Slider";
import Navigation from "../Common/Navigation";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const Feedback = () => {
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
  // Feedback list
  const [feedbacks, setFeedbacks] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_feedback"
      );
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setFeedbacks(revesedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Admin response state
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});

  // Handle response input change
  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  // Handle submitting a response
  const handleResponseSubmit = async (id) => {
    const responseMessage = responses[id];

    if (!responseMessage) {
      toast.warning("Response cannot be empty!");
      return;
    }
    setLoading({ ...loading, [id]: true });
    try {
     const res= await axios.post("http://localhost:8000/respond_feedback", {
        feedbackId: id,
        responseMessage,
      });

      if(res.status==200)
      {
        setFeedbacks(
          feedbacks.map((feedback) =>
            feedback._id === id
              ? { ...feedback, response: responseMessage, status: "Resolved" }
              : feedback
          )
        );
      }

      setResponses({ ...responses, [id]: "" });
      toast.success("Response sent successfully!");
      getData();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to send response. Please try again.");
    }
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
      <div className=" mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>User Feedback</h3>
          </div>
        </div>
        <div className="clearfix" />

        {/* Feedback List */}
        <div className="row">
          <div className="col-md-12">
            <div className="x_panel">
              <div className="x_title">
                <h2>Feedback from Users</h2>
                <div className="clearfix" />
              </div>
              <div className="x_content">
                {feedbacks.length === 0 ? (
                  <p>No feedback available.</p>
                ) : (
                  feedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="well d-flex align-items-center"
                    >
                      {/* Feedback Details */}
                      <div className="flex-grow-1">
                        <h4>
                          {feedback.name}
                        </h4>
                        <p>
                          <strong>Email:</strong> {feedback.email}
                        </p>
                        <p>
                          <strong>Message:</strong> {feedback.feedback}
                        </p>
                        <p>
                          <strong>Rating:</strong>{" "}
                          {"⭐".repeat(feedback.rating)}{" "}
                        </p>

                        {/* Admin Response Section */}
                        {feedback.response ? (
                          <p>
                            <strong>Admin Response:</strong> {feedback.response}
                          </p>
                        ) : (
                          <div>
                            <textarea
                              className="form-control"
                              placeholder="Write a response..."
                              value={responses[feedback._id] || ""}
                              onChange={(e) =>
                                handleResponseChange(
                                  feedback._id,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="btn btn-primary btn-sm mt-2"
                              onClick={() => handleResponseSubmit(feedback._id)}
                             disabled={loading[feedback._id]}
                            >
                                {
                              loading[feedback._id] ? "Sending..." : " Submit Response"
                            }
                            </button>
                          </div>
                        )}
                      </div>
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

export default Feedback;
