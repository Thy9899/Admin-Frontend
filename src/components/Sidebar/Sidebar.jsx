import React from "react";
import "./Sidebar.css";

const Sidebar = ({ menu, setMenu, collapsed, setCollapsed }) => {
  const menuItems = [
    { name: "Dashboard", icon: "bx bx-home" },
    { name: "Customers", icon: "bx bx-user" },
    { name: "Payment", icon: "bx bx-wallet" },
    { name: "Stock", icon: "bx bx-store" },
    { name: "Order", icon: "bx bx-heart" },
    { name: "Report", icon: "bx bx-bar-chart" },
  ];

  return (
    <nav className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <header>
        <div className="image-logo">
          <span className="logo">
            <img src="/logo.webp" alt="Logo" />
            {!collapsed && <p className="header-text text">Web Application</p>}
          </span>
          <i
            className="bx bx-chevron-left toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          ></i>
        </div>
      </header>

      <hr />

      <ul className="menu-links">
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMenu(item.name);
              }}
              className={menu === item.name ? "active" : ""}
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.name}</span>}
            </a>
          </li>
        ))}
      </ul>

      <div className="bottom-content">
        <a href="#">
          <i className="bx bx-log-out"></i>
          {!collapsed && <span className="text">Logout</span>}
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
