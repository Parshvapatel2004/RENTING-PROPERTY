import React from "react";
import Header from "../Common/Header";
import Banner from "../Common/Banner";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div>
      <Header />
      <Banner title={"Terms & Conditions"} pageName={"terms_conditions"} />
      <Main />
      <Footer />
    </div>
  );
};

function Main() {
  return (
    <section className="container py-5" style={{ maxWidth: "950px" }}>
      <div className="container py-md-3">
        <h2 className="text-center fw-bold mb-5">Terms & Conditions</h2>

        {/* Terms Cards */}
        {termsList.map((item, index) => (
          <TermsCard
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}

        <div className="mt-5 text-center">
          <h5 className="fw-bold mb-2">Contact Us</h5>
          <p className="mb-1 ml-4 pl-2">
            <strong>Email:</strong>{" "}
            <Link
              id="link"
              to="mailto:rentingproperties@gmail.com"
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

// Terms Card Component
const TermsCard = ({ title, description }) => {
  return (
    <div className="mb-4 p-4 shadow-sm rounded-4 bg-light border border-1 border-muted">
      <details>
        <summary className="fw-bold mb-2">{title}</summary>
        <p className="mb-0 text-secondary">{description}</p>
      </details>
    </div>
  );
};

// Data
const termsList = [
  {
    title: "1. Acceptance of Terms",
    description:
      "By accessing or using our platform, you agree to be bound by these terms. If you do not agree, please do not use the service.",
  },
  {
    title: "2. User Responsibilities",
    description:
      "Users must provide accurate information, comply with applicable laws, and respect other users. Misuse of the platform may result in account suspension.",
  },
  {
    title: "3. Property Listings",
    description:
      "All property listings must be genuine and updated. False or misleading information can lead to account termination.",
  },
  {
    title: "4. Payment Terms",
    description:
      "Any payments made through the platform must follow the stated terms. Refunds are only issued under specific conditions.",
  },
  {
    title: "5. Intellectual Property",
    description:
      "All content, trademarks, and materials on this platform are owned or licensed. You may not use them without prior written permission.",
  },
  {
    title: "6. Limitation of Liability",
    description:
      "We are not responsible for any damages resulting from your use of the platform. Services are provided 'as-is' without warranties.",
  },
  {
    title: "7. Termination",
    description:
      "We reserve the right to suspend or terminate access to the platform for any violation of these terms.",
  },
  {
    title: "8. Changes to Terms",
    description:
      "We may update these terms at any time. Continued use of the platform after changes indicates your acceptance of the revised terms.",
  },
];

export default TermsAndConditions;
