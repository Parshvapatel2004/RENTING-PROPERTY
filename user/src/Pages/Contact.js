import React, { useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  return (
    <div>
      <Header />
      <ContactCompo />
      <Footer />
    </div>
  );
};
function ContactCompo() {
  return (
    <div>
      <section className="w3l-contacts-9-main" id="contact">
        <Map />
        <div className="contacts-9 py-5">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
function Map() {
  return (
    <div className="map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235026.89444410583!2d72.23154477939568!3d23.012930000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84d575eef3dd%3A0xa40a9723abd1c46d!2sS.g.highway%20%7C%20Commercial%20Estate%20Agent%20In%20Ahmedabad%20by%20Monarch%20Associates!5e0!3m2!1sen!2sin!4v1742290217106!5m2!1sen!2sin"
        width={100}
        height="300"
        style={{ border: "0" }}
        allowfullscreen=""
        loading="lazy"
        title="map"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!data.name.trim()) newErrors.name = "Name is required.";
    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(data.email))
      newErrors.email = "Invalid email format.";

    if (!data.phone.trim()) newErrors.phone = "Phone is required.";
    else if (!phoneRegex.test(data.phone))
      newErrors.phone = "Phone must be 10 digits.";

    if (!data.subject.trim()) newErrors.subject = "Subject is required.";
    if (!data.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:8000/contactUs", data);
      toast.success("Message Sent Successfully!!", {
        onClose: () =>
          setData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          }),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="container py-md-3">
      <h4>Contact Us</h4>
      <div className="top-map row">
        <div className="map-content-9 col-md-8">
          <form onSubmit={handleLogin}>
            <div className="twice-two">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="form-control"
                  value={data.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  value={data.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
            </div>
            <div className="twice-two">
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  className="form-control"
                  value={data.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="form-control"
                  value={data.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <small className="text-danger">{errors.subject}</small>
                )}
              </div>
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Message"
                value={data.message}
                onChange={handleChange}
                className="form-control"
              />
              {errors.message && (
                <small className="text-danger">{errors.message}</small>
              )}
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="cont-details col-md-4 pl-md-5 mt-md-0 mt-5">
          <div className="cont-top">
            <div className="cont-left">
              <span className="fa fa-home"></span>
            </div>
            <div className="cont-right">
              <h6>Address</h6>
              <p>
                Estate Business, #123, S.G. Highway, Ahmedabad, Gujarat, India.
              </p>
            </div>
          </div>
          <div className="cont-top mt-4 mb-4">
            <div className="cont-left">
              <span className="fa fa-phone"></span>
            </div>
            <div className="cont-right">
              <h6>Phone Us</h6>
              <p>
                <Link id="link" to="tel:+91 9054800900">
                  +91 9054800900
                </Link>
              </p>
            </div>
          </div>
          <div className="cont-top">
            <div className="cont-left">
              <span className="fa fa-envelope-o"></span>
            </div>
            <div className="cont-right">
              <h6>Email Us</h6>
              <p>
                <Link
                  id="link"
                  to="mailto:contact@realestate.in"
                  className="mail"
                >
                  rentingproperties@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
