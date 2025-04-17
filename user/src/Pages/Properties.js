import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Banner from "../Common/Banner";
import Footer from "../Common/Footer";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Properties = () => {
  return (
    <div>
      <Header />
      <Banner title={"Our Properties"} pageName={"properties"} />
      <Main />
      <Footer />
    </div>
  );
};

const Main = () => {
  const location = useLocation();
  const [propertiesData, setPropertiesData] = useState([]);

  const fetchAllProperties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/fetch_all_property"
      );
      const responseData = response.data.data || [];
      const revesedData = responseData.reverse();
      setPropertiesData(revesedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });

    // Check if we have search results in location state
    if (location.state?.properties) {
      setPropertiesData(location.state.properties);
    } else {
      // If no search results, fetch all properties
      fetchAllProperties();
    }
  }, [location.state]);

  return (
    <section
      className="grids-3 m-auto"
      id="properties"
      style={{ width: "100%" }}
    >
      <div id="grids3-block" className="py-5">
        <div className="container py-md-3">
          <div className="row">
            {propertiesData.length > 0 ? (
              propertiesData.map((property, index) => (
                <div className="grids3-info col-lg-4 col-md-6 mt-5" key={index}>
                  <Link id="link" to="/properties_single" state={property}>
                    <img
                      src={`http://localhost:8000/images/propertyImg/${property?.images[0]}`}
                      className="img-fluid"
                      style={{
                        height: "250px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt={property?.title}
                    />
                  </Link>
                  <p>Rent</p>
                  <div className="info-bg">
                    <h5>
                      <Link id="link" to="/properties_single" state={property}>
                        {property?.title}, {property?.location}
                      </Link>
                    </h5>
                    <ul>
                      <li>
                        <span className="fa fa-bed"></span> {property?.bedrooms}{" "}
                        bedrooms
                      </li>
                      <li>
                        <span className="fa fa-bath"></span>{" "}
                        {property?.bathrooms} bathrooms
                      </li>
                      <li>
                        <span className="fa fa-share-square-o"></span>{" "}
                        {property?.size} sq ft
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4>No properties found</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Properties;
export { Main };
