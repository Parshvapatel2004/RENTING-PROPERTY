import React, { useState } from "react";
import Header from "../Common/Header";
import Banner from "../Common/Banner";
import Footer from "../Common/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FindProperty = () => {
  return (
    <div>
      <Header />
      <Banner title={"Find Your Dream Property"} pageName={"find_property"} />
      <Main />
      <Footer />
    </div>
  );
};

function Main() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    keywords: "",
    location: "", // Added location field
    maxSqft: "",
    propertyType: "",
    maxBudget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/search_property",
        data
      );
      console.log(response.data.data);
      if (response.data.data.length === 0) {
        toast.error("No properties found");
      }

      navigate("/properties", {
        state: {
          properties: response.data.data,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <section
        className="form-16"
        id="booking"
        style={{ padding: "0px 140px" }}
      >
        <div className="form-16-mian py-5">
          <div className="container py-md-3">
            <div className="forms-16-top">
              <div className="form-right-inf">
                <div className="form-inner-cont">
                  <h3>Find Your Perfect Property</h3>
                  <p className="text-black fw-light mb-4">
                    Search from a wide range of properties to rent in top
                    locations.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="row book-form">
                      <div className="form-input col-lg-6 col-md-6">
                        <input
                          type="text"
                          name="keywords"
                          value={data.keywords}
                          onChange={handleChange}
                          placeholder="Enter property name or description"
                        />
                      </div>
                      <div className="form-input col-lg-6 col-md-6">
                        <input
                          type="text"
                          name="location"
                          value={data.location}
                          onChange={handleChange}
                          placeholder="Enter location or address"
                        />
                      </div>
                      <div className="form-input col-md-4 mt-3">
                        <input
                          type="number"
                          name="maxSqft"
                          value={data.maxSqft}
                          onChange={handleChange}
                          placeholder="Maximum Area (sqft)"
                        />
                      </div>
                      <div className="form-input col-md-4 mt-3">
                        <select
                          className="selectpicker"
                          name="propertyType"
                          onChange={handleChange}
                          value={data.propertyType}
                        >
                          <option value="">Select Property Type</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial Property">
                            Commercial
                          </option>
                          {/* <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                          <option value="Plot">Plot</option> */}
                        </select>
                      </div>
                      <div className="form-input col-md-4 mt-3">
                        <input
                          type="number"
                          name="maxBudget"
                          value={data.maxBudget}
                          onChange={handleChange}
                          placeholder="Maximum Budget (₹)"
                        />
                      </div>
                      <div className="bottom-btn col-md-4 mt-3">
                        <button type="submit" className="btn">
                          Search Properties
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FindProperty;
