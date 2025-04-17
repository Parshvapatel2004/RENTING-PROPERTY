import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Banner from "../Common/Banner";
import Footer from "../Common/Footer";
import { Link, Links, useLocation } from "react-router-dom";
import checkSession from "../auth/authService";
import axios from "axios";
import { toast } from "react-toastify";

const PropertiesSingle = () => {
  return (
    <div>
      <Header />
      <Banner title={"Property Details"} pageName={"properties_single"} />
      <Main />
      <Footer />
    </div>
  );
};

const Main = () => {
  const [rentForm, setRentForm] = useState(false);
  const [isLoggein, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const propertyDetailss = location.state;

  const authenticateUser = async () => {
    try {
      const checkAuth = await checkSession();
      if (checkAuth.isAuth) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    if (propertyDetailss === null) {
      window.location.href = "/properties";
    }
    authenticateUser();
    // eslint-disable-next-line
  }, [location]);

  // Function to handle the rent form toggle
  const toggleRentForm = () => {
    setRentForm((prev) => !prev);
  };
  return (
    <section
      className="w3l-content-with-photo-11 m-auto"
      style={{ width: "80%" }}
    >
      <div className="contentwithphoto-11 py-5">
        <div className="container py-md-3">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="galleryContainer">
                <div className=" " id={"property-grid"}>
                  {propertyDetailss?.images.map((img, index) => (
                    <div key={index} id={"property-card"} className="large-image p-2">
                      <Link
                        to={`http://localhost:8000/images/propertyImg/${img}`}
                        target="_top"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:8000/images/propertyImg/${img}`}
                          className="img-fluid rounded shadow"
                          style={{
                            width: "100%",
                            maxHeight: "500px",
                            objectFit: "cover",
                          }}
                          alt={`Property ${index + 1}`}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <h4 className="text-center mt-5">{propertyDetailss?.title}</h4>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-6">
              <h3>Description</h3>
              <p>{propertyDetailss?.description}</p>
              <h3>Address</h3>
              <p>
                {propertyDetailss?.address}, {propertyDetailss?.location},{" "}
                {propertyDetailss?.zipCode}
              </p>
            </div>
            <div className="col-md-6">
              <h4>Core Details</h4>
              <ul>
                <li>
                  <span className="title-text">Location:</span>
                  <span className="feature-count">
                    {propertyDetailss?.location}
                  </span>
                </li>
                <li>
                  <span className="title-text">Price:</span>
                  <span className="feature-count">
                    ₹{propertyDetailss?.price}
                  </span>
                </li>
                <li>
                  <span className="title-text">Bathrooms:</span>
                  <span className="feature-count">
                    {propertyDetailss?.bathrooms}
                  </span>
                </li>
                <li>
                  <span className="title-text">Bedrooms:</span>
                  <span className="feature-count">
                    {propertyDetailss?.bedrooms}
                  </span>
                </li>
                <li>
                  <span className="title-text">Property Type:</span>
                  <span className="feature-count">
                    {propertyDetailss?.propertyType}
                  </span>
                </li>
                <li>
                  <span className="title-text">Size:</span>
                  <span className="feature-count">
                    {propertyDetailss?.size} Sqft
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <h4>More Features</h4>
              <ul className="list-inline">
                {propertyDetailss?.amenities.map((feature, index) => (
                  <li
                    key={index}
                    className="list-inline-item m-2 p-2 border rounded shadow-sm bg-light"
                  >
                    <span className="fa fa-check"></span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-12 d-flex justify-content-center gap-3">
              {isLoggein ? (
                <Link
                  to={"/booking"}
                  state={propertyDetailss}
                  className="btn btn-primary btn-lg"
                >
                  Book Now
                </Link>
              ) : (
                <Link to={"/login"} className="btn btn-primary btn-lg">
                  Login to Book
                </Link>
              )}
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => {
                  document
                    .querySelector(".rent-form")
                    .scrollTo(0, 0, { behavior: "smooth" });
                  // setRentForm(true);
                  toggleRentForm();
                }}
              >
                Make Inquiry
              </button>
            </div>
          </div>

          {/* Rent This Property Form */}
          <div className="rent-form">
            {rentForm ? (
              <RentForm
                id={propertyDetailss._id}
                owner_Id={propertyDetailss.owner_Id}
                setRentForm={setRentForm}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

const RentForm = (props) => {
  console.log(props);

  const [formData, setFormData] = useState({
    propertyId: props.id,
    owner_Id: props.owner_Id,
    name: "",
    email: "",
    phone: "",
    inquiry: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add_product_inquiry", formData);
      toast.success("Inquiry Added Successfully!!", {
        autoClose: 1000,
        onClose: () => {
          setFormData({ name: "", email: "", phone: "", inquiry: "" });
          props.setRentForm(false);
        },
      })
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="rent-form mt-5 p-4 shadow-sm bg-light">
      <h3>Rent This Property</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Inquiry Details</label>
          <textarea
            className="form-control"
            name="inquiry"
            value={formData.inquiry}
            rows="4"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default PropertiesSingle;
