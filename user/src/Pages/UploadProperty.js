import React, { useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UploadProperty = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    zipCode: "",
    propertyType: "",
    category: "For Rent",
    size: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    images: [],
    propertyIdentityType: "",
    propertyProof: "",
    amenities: [],
    identityType: "",
    identityId: "",
  });

  const amenitiesList = [
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Parking",
    "Balcony",
    "Security",
    "Garden",
    "Power Backup",
  ];

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Text field validations
    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
      isValid = false;
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "City is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = "ZIP code must be 6 digits";
      isValid = false;
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Property type is required";
      isValid = false;
    }

    if (!formData.size) {
      newErrors.size = "Size is required";
      isValid = false;
    } else if (isNaN(formData.size)) {
      newErrors.size = "Size must be a number";
      isValid = false;
    } else if (formData.size <= 0) {
      newErrors.size = "Size must be greater than 0";
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(formData.price)) {
      newErrors.price = "Price must be a number";
      isValid = false;
    } else if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = "Bedrooms count is required";
      isValid = false;
    } else if (isNaN(formData.bedrooms) || formData.bedrooms < 0) {
      newErrors.bedrooms = "Bedrooms must be a positive number";
      isValid = false;
    } else if (isNaN(formData.bedrooms) || formData.bedrooms > 5) {
      newErrors.bedrooms = "Bedrooms must be less than or equal to 5";
      isValid = false;
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = "Bathrooms count is required";
      isValid = false;
    } else if (isNaN(formData.bathrooms) || formData.bathrooms < 0) {
      newErrors.bathrooms = "Bathrooms must be a positive number";
      isValid = false;
    } else if (isNaN(formData.bathrooms) || formData.bathrooms > 5) {
      newErrors.bathrooms = "Bathrooms must be less than or equal to 5";
      isValid = false;
    }

    // File validations
    if (formData.images.length === 0) {
      newErrors.images = "At least one property image is required";
      isValid = false;
    } else if (formData.images.length > 5) {
      newErrors.images = "Maximum 5 images allowed";
      isValid = false;
    } else {
      // Check each image file type and size
      formData.images.forEach((file, index) => {
        if (!file.type.match("image.*")) {
          newErrors.images = "Only image files are allowed";
          isValid = false;
        } else if (file.size > 5 * 1024 * 1024) {
          // 5MB
          newErrors.images = `Image ${index + 1} is too large (max 5MB)`;
          isValid = false;
        }
      });
    }

    if (!formData.propertyIdentityType) {
      newErrors.propertyIdentityType = "Property identity type is required";
      isValid = false;
    }

    if (!formData.propertyProof) {
      newErrors.propertyProof = "Property proof document is required";
      isValid = false;
    } else {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(formData.propertyProof.type)) {
        newErrors.propertyProof =
          "Only PDF, JPG, PNG, or DOCX files are allowed";
        isValid = false;
      } else if (formData.propertyProof.size > maxSize) {
        newErrors.propertyProof = "File is too large (max 10MB)";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
    if (errors.images) {
      setErrors({ ...errors, images: null });
    }
  };

  const handlePropertyProofChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, propertyProof: file });
    if (errors.propertyProof) {
      setErrors({ ...errors, propertyProof: null });
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenities: checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();

    // Append all text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("location", formData.location);
    submitData.append("address", formData.address);
    submitData.append("zipCode", formData.zipCode);
    submitData.append("propertyType", formData.propertyType);
    submitData.append("category", formData.category);
    submitData.append("size", formData.size);
    submitData.append("price", formData.price);
    submitData.append("bedrooms", formData.bedrooms);
    submitData.append("bathrooms", formData.bathrooms);
    submitData.append("propertyIdentityType", formData.propertyIdentityType);
    submitData.append("identityType", formData.identityType);
    // submitData.append("identityId", formData.identityId);

    // Append amenities array as JSON string
    submitData.append("amenities", JSON.stringify(formData.amenities));

    // Append multiple image files
    formData.images.forEach((file) => {
      submitData.append("images", file);
    });

    // Append single property proof image
    if (formData.propertyProof) {
      submitData.append("propertyProof", formData.propertyProof);
    }
    if (formData.identityId) {
      submitData.append("identityId", formData.identityId);
    }

    try {
      await axios.post("http://localhost:8000/upload_property", submitData);
      toast.success("Property Added Successfully", {
        onClose: () => navigate("/view_property"),
      });
    } catch (error) {
      let errorMessage = "Error uploading property";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      console.error("Error uploading property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Upload Property</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow bg-white"
      >
        <div className="row">
          {/* Property Details */}
          <div className="col-md-6">
            <div className="form-group">
              <label>Property Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Enter property title"
                value={formData.title}
                onChange={handleChange}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Enter property details"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>City:</label>
              <input
                type="text"
                name="location"
                placeholder="Enter city"
                value={formData.location}
                onChange={handleChange}
                className={`form-control ${
                  errors.location ? "is-invalid" : ""
                }`}
              />
              {errors.location && (
                <div className="invalid-feedback">{errors.location}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>ZIP Code:</label>
              <input
                type="text"
                name="zipCode"
                placeholder="Enter ZIP Code"
                value={formData.zipCode}
                onChange={handleChange}
                className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
              />
              {errors.zipCode && (
                <div className="invalid-feedback">{errors.zipCode}</div>
              )}
            </div>
          </div>

          {/* Property Specifications */}
          <div className="col-md-6">
            <div className="form-group">
              <label>Property Type:</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className={`form-control ${
                  errors.propertyType ? "is-invalid" : ""
                }`}
              >
                <option value="">Select Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial Property">Commercial Property</option>
              </select>
              {errors.propertyType && (
                <div className="invalid-feedback">{errors.propertyType}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Category:</label>
              <p name="category" value="For Rent" className="form-control">
                For Rent
              </p>
            </div>

            <div className="form-group mt-3">
              <label>Size (sq ft):</label>
              <input
                type="number"
                name="size"
                placeholder="Enter size in sqft"
                value={formData.size}
                onChange={handleChange}
                className={`form-control ${errors.size ? "is-invalid" : ""}`}
                min="1"
              />
              {errors.size && (
                <div className="invalid-feedback">{errors.size}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Price (₹):</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                min="1"
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Bedrooms:</label>
              <input
                type="number"
                name="bedrooms"
                placeholder="Enter number of bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className={`form-control ${
                  errors.bedrooms ? "is-invalid" : ""
                }`}
                min="0"
              />
              {errors.bedrooms && (
                <div className="invalid-feedback">{errors.bedrooms}</div>
              )}
            </div>

            <div className="form-group mt-3">
              <label>Bathrooms:</label>
              <input
                type="number"
                name="bathrooms"
                placeholder="Enter number of bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className={`form-control ${
                  errors.bathrooms ? "is-invalid" : ""
                }`}
                min="0"
              />
              {errors.bathrooms && (
                <div className="invalid-feedback">{errors.bathrooms}</div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Images */}
        <div className="form-group mt-3">
          <label>Upload Property Images:</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className={`form-control ${errors.images ? "is-invalid" : ""}`}
          />
          {errors.images && (
            <div className="invalid-feedback">{errors.images}</div>
          )}
          <small className="text-muted">Maximum 5 images</small>
        </div>

        {/* Property Identity Type */}
        <div className="form-group mt-3">
          <label>Property Identity Type:</label>
          <select
            name="propertyIdentityType"
            value={formData.propertyIdentityType}
            onChange={handleChange}
            className={`form-control ${
              errors.propertyIdentityType ? "is-invalid" : ""
            }`}
          >
            <option value="">Select Property Proof Type</option>
            <option value="Sale Deed">Sale Deed</option>
            <option value="Property Tax Receipt">Property Tax Receipt</option>
            <option value="Agreement Copy">Agreement Copy</option>
            <option value="Ownership Certificate">Ownership Certificate</option>
            <option value="Other">Other</option>
          </select>
          {errors.propertyIdentityType && (
            <div className="invalid-feedback">
              {errors.propertyIdentityType}
            </div>
          )}
        </div>

        {/* Upload Property Proof */}
        <div className="form-group mt-3">
          <label>Upload Property Proof (Legal Documents):</label>
          <input
            type="file"
            name="propertyProof"
            accept=".pdf,.jpg,.png,.docx"
            onChange={handlePropertyProofChange}
            className={`form-control ${
              errors.propertyProof ? "is-invalid" : ""
            }`}
          />
          {errors.propertyProof && (
            <div className="invalid-feedback">{errors.propertyProof}</div>
          )}
          <small className="text-muted">
            Accepted files: PDF, JPG, PNG, DOCX (max 10MB)
          </small>
        </div>

        {/* Amenities */}
        <label>Amenities:</label>
        <div className="mb-3">
          {amenitiesList.map((amenity, index) => (
            <div key={index} className="form-check">
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleAmenitiesChange}
                className="form-check-input"
              />
              <label className="form-check-label">{amenity}</label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-block mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </>
          ) : (
            "Submit Property"
          )}
        </button>
      </form>
    </div>
  );
}

export default UploadProperty;
