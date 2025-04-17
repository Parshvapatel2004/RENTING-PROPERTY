import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
import Slider from "../Common/Slider";
import Footer from "../Common/Footer";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
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
  return (
    <>
      <Header />
    </>
  );
}

function Header() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/getDashboardCounts"
      );
      const responseData = response.data.data;
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
        <div className="container mt-4">
          <div className="row">
            {/* Total Users */}
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card text-white bg-primary shadow-sm">
                <div className="card-body text-center">
                  <Link to="/manage_users" style={{ color: "inherit" }}>
                    <i className="fa fa-user fa-2x"></i></Link>
                  <h5 className="card-title mt-2">Total Users</h5>
                  <h2 className="fw-bold">{data.totalUsers}</h2>
                </div>
              </div>
            </div>

            {/* Total Owners */}
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card text-white bg-info shadow-sm">
                <div className="card-body text-center">
                  <Link to="/manage_owners" style={{ color: "inherit" }}>
                    <i className="fa fa-users fa-2x"></i>
                  </Link>
                  <h5 className="card-title mt-2">Total Owners</h5>
                  <h2 className="fw-bold">{data.totalOwners}</h2>
                </div>
              </div>
            </div>

            {/* Total Properties */}
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card text-white bg-success shadow-sm">
                <div className="card-body text-center">
                  <Link to="/manage_properties" style={{ color: "inherit" }}>
                    <i className="fa fa-home fa-2x"></i></Link>
                  <h5 className="card-title mt-2">Total Properties</h5>
                  <h2 className="fw-bold">{data.totalProperties}</h2>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card text-white bg-warning shadow-sm">
                <div className="card-body text-center">
                  <Link to="/manage_bookings" style={{ color: "inherit" }}>
                    <i className="fa fa-book fa-2x"></i></Link>
                  <h5 className="card-title mt-2">Total Bookings</h5>
                  <h2 className="fw-bold">{data.totalBookings}</h2>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="card text-white bg-danger shadow-sm">
                <div className="card-body text-center">
                <Link to="/manage_payments" style={{ color: "inherit" }}>
                  <i className="fa fa-money fa-2x"></i></Link>
                  <h5 className="card-title mt-2">Total Revenue</h5>
                  <h2 className="fw-bold">
                    ₹ {data.totalRevenue.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
