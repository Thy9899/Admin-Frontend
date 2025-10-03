import React, { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Dashboard from "../Pages/DashboardPage/Dashboard";
import CustomersPage from "../Pages/CustomersPage/CustomersPage";
import PaymentPage from "../Pages/PaymentPage/PaymentPage";
import StockPage from "../Pages/StockPage/StockPage";
import OrderPage from "../Pages/OrderPage/OrderPage";
import "./Home.css";

const Home = () => {
  const [menu, setMenu] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (menu) {
      case "Dashboard":
        return <Dashboard />;
      case "Customers":
        return <CustomersPage />;
      case "Payment":
        return <PaymentPage />;
      case "Stock":
        return <StockPage />;
      case "Order":
        return <OrderPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <Sidebar
        menu={menu}
        setMenu={setMenu}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <Header className={sidebarCollapsed ? "sidebar-collapsed" : ""} />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default Home;
