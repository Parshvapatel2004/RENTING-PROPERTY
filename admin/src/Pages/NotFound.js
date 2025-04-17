import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="container text-center p-4">
                <div className="row align-items-center">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <h1 className="display-1 fw-bold text-danger">404</h1>
                        <h3 className="fw-bold">Oops! Page Not Found</h3>
                        <p className="text-muted">
                            The page you’re looking for doesn’t exist. It may have been moved or deleted.
                        </p>
                        {/* <Link to="/login" className="border p-2 rounded  fw-bold">
                            Back to Login
                        </Link> */}
                        <Link
                            type="submit"
                            className="btn btn-default btn-danger submit border rounded-pill fw-bold"
                            style={{ fontSize: "18px", padding: "10px 20px" }} to={"/login"}
                        >
                            Log in
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <img
                            // src="images/error.png"
                            src="images/error2.png"
                            alt="404 Error"
                            className="img-fluid"
                            style={{ maxWidth: "350px",borderRadius:'50px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
