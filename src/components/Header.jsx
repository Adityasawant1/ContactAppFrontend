import React from "react";

const Header = ({ toggleModal, nbOfContacts = 0, onLogout }) => {
  return (
    <header className="header">
      <div className="container header__wrapper">
        <h3>Contact List ({nbOfContacts})</h3>

        <div className="header__actions">
          <button onClick={() => toggleModal(true)} className="btn">
            <i className="bi bi-plus-square"></i> Add New Contact
          </button>

          <button onClick={onLogout} className="btn btn-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
