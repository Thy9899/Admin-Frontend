import React from "react";
import "./Header.css";

const Header = ({ className }) => {
  return (
    <div className={`header ${className || ""}`}>
      <span className="title">Vegetable Online</span>
      <img src="/logo.webp" alt="Logo" />
    </div>
  );
};

export default Header;
