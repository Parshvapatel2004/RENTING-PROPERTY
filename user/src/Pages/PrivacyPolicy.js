import React from "react";
import Header from "../Common/Header";
import Banner from "../Common/Banner";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />
      <Banner title={"Privacy Policy"} pageName={"privacy_policy"} />
      <Main />
      <Footer />
    </div>
  );
};

function Main() {
  return (
    <section className="container py-5" style={{ maxWidth: "950px" }}>
      <div className="container py-md-3">
        <h2 className="text-center fw-bold mb-5">Privacy Policy</h2>

        {/* Policy Cards */}
        {policyList.map((item, index) => (
          <PolicyCard
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}

        <div className="mt-5 text-center ">
          <h5 className="fw-bold mb-2">Contact Us</h5>
          <p className="mb-1 ml-4 pl-2">
            <strong>Email: </strong>
            <Link
              id="link"
              to="mailto:darshanrp20703@gmail.com"
              className="text-black"
            >
              rentingproperties@gmail.com
            </Link>
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            <Link
              id="link"
              to="tel:+919054800900"
              className="text-decoration-none text-primary fw-semibold mr-5"
            >
              +91 9054800900
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
// Data
const policyList = [
  {
    title: "1. Information We Collect",
    description:
      "We collect personal details such as name, email, phone number, and location when you use our platform. Additional data may be collected through cookies and device interactions.",
  },
  {
    title: "2. How We Use Your Information",
    description:
      "Your data helps us deliver and enhance our services, support communication, personalize your experience, and ensure security.",
  },
  {
    title: "3. Data Sharing and Disclosure",
    description:
      "We do not sell your personal data. Information is only shared with trusted third-party providers or legal entities when required.",
  },
  {
    title: "4. Cookies and Tracking",
    description:
      "Cookies help improve site performance and personalize your experience. You may disable them in browser settings, but it might affect some features.",
  },
  {
    title: "5. Your Rights",
    description:
      "You have full control over your data. You may request to view, modify, or delete your information at any time.",
  },
  {
    title: "6. Security Measures",
    description:
      "We use modern security practices to protect your data from unauthorized access, alteration, or loss.",
  },
  {
    title: "7. Policy Updates",
    description:
      "Our privacy practices may change over time. All updates will be reflected on this page with the revised date.",
  },
];
// Card-style Policy Component
const PolicyCard = ({ title, description }) => {
  return (
    <div className="mb-4 p-4 shadow-sm rounded-4 bg-light border border-1 border-muted">
      <details>
        <summary className="fw-bold mb-2">{title}</summary>
        <p className="mb-0 text-secondary">{description}</p>
      </details>
    </div>
  );
};

export default PrivacyPolicy;
