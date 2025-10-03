// import React, { useEffect, useState } from "react";
// import { http, mockApi, useMock } from "../../api/client.js";

// export default function Dashboard() {
//   const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

//   useEffect(() => {
//     const load = async () => {
//       if (useMock) {
//         const products = await mockApi.products.list();
//         const orders = await mockApi.orders.list();
//         const revenue = orders.reduce((a, b) => a + (b.amount || 0), 0);
//         setStats({ products: products.length, orders: orders.length, revenue });
//       } else {
//         const [{ data: p }, { data: o }] = await Promise.all([
//           http.get("/products/count"),
//           http.get("/orders/stats"),
//         ]);
//         setStats({
//           products: p.count ?? p,
//           orders: o.count ?? o.orders,
//           revenue: o.revenue ?? 0,
//         });
//       }
//     };
//     load().catch(console.error);
//   }, []);

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <div className="kpi">
//         <div className="tile">
//           <div>Total Products</div>
//           <h3>{stats.products}</h3>
//         </div>
//         <div className="tile">
//           <div>Total Orders</div>
//           <h3>{stats.orders}</h3>
//         </div>
//         <div className="tile">
//           <div>Revenue</div>
//           <h3>${(stats.revenue / 100).toFixed(2)}</h3>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
    </div>
  );
};

export default Dashboard;
