import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="footer text-center py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-md-start">
              <h5 className="mb-0">🏠 Renting Properties Admin Panel</h5>
              <p className="small mb-0">
                Efficiently manage properties & transactions
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="small mb-0">
                ©2025 Renting Properties. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
