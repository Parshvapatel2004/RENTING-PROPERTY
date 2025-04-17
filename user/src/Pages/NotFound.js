import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <div className="w3l-error-main" style={{ minHeight: '100vh' }}>
        <div className="error p-5 vh-100">
          <div className="container">
            <div className="row main-cont-grid align-items-center">
              <div className="sub-wthreess col-md-6">
                <h3 className="text-err-wthree">Oops!</h3>
                <h4>404 - Page not found</h4>
                <p>
                  This page you are looking for might have been removed
                  <br /> had its name changed or temporarly unavailable.
                </p>
                <Link id="link" to="/" className="back-button">
                  Back to Home
                </Link>
              </div>
              <div className="right-cont col-md-6 mt-md-0 mt-5">
                <img
                  src="assets/images/error.png"
                  alt=""
                  className="img-fluid"
                  style={{ maxWidth: "350px", borderRadius: '50px' }}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
