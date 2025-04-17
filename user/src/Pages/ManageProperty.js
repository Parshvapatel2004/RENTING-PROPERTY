import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ManageProperty = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/manage_property");
      setProperties(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  const handleDelete = async (property_Id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("http://localhost:8000/delete_property", {
          property_Id,
        });

        Swal.fire("Deleted!", "Property has been deleted.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Error!", error.response.data.message, "error");
      }
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Manage Listings</h1>
      <div className="row">
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={`http://localhost:8000/images/propertyImg/${property.images[0]}`}
                  className="card-img-top"
                  height={"350px"}
                  style={{ objectFit: "cover" }}
                  alt={property.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text">{property.description}</p>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Location:</strong> {property.location}
                    </li>
                    <li>
                      <strong>Rent:</strong> ₹{property.price}
                    </li>
                    <li>
                      <strong>Type:</strong> {property.propertyType}
                    </li>
                    <li>
                      <strong>Bedrooms:</strong> {property.bedrooms}
                    </li>
                    <li>
                      <strong>Bathrooms:</strong> {property.bathrooms}
                    </li>
                    <li>
                      <strong>Amenities:</strong>{" "}
                      {property.amenities.join(", ")}
                    </li>
                  </ul>
                  <Link
                    to={`/edit_property`}
                    state={property}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/view_property_inquiries`}
                    state={property}
                    className="btn btn-info btn-sm ms-2"
                  >
                    View Inquiries
                  </Link>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No properties available</p>
        )}
      </div>
    </div>
  );
}

export default ManageProperty;
