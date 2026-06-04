import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";
import API from "../services/api";

const Dashboard: React.FC = () => {
  const [summaryCards, setSummaryCards] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState({
    delivered: 0,
    shipped: 0,
    pending: 0,
    cancelled: 0,
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "SHIPPED":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "CANCELLED":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/products/all-product"),
          API.get("/admin/orders"),
        ]);

        const users =
          usersRes.data?.pagination?.total ||
          usersRes.data?.users?.length ||
          0;

        const products =
          productsRes.data?.pagination?.total ||
          productsRes.data?.products?.length ||
          0;

        const ordersData = ordersRes.data?.orders || ordersRes.data || [];

        const totalOrders = ordersData.length;

        const revenue = ordersData
          .filter((order: any) => order.status === "DELIVERED")
          .reduce(
            (acc: number, order: any) => acc + (order.total || 0),
            0
          );

        setOrders(
          ordersData.slice(0, 5).map((order: any) => ({
            id: `#ORD-${order.id}`,
            name: order.user?.name || "Unknown",
            status: order.status,
          }))
        );

        const statusCount = {
          DELIVERED: 0,
          SHIPPED: 0,
          PENDING: 0,
          CANCELLED: 0,
        };

        ordersData.forEach((order: any) => {
          if (statusCount[order.status as keyof typeof statusCount] !== undefined) {
            statusCount[order.status as keyof typeof statusCount]++;
          }
        });

        setChartData({
          delivered: statusCount.DELIVERED,
          shipped: statusCount.SHIPPED,
          pending: statusCount.PENDING,
          cancelled: statusCount.CANCELLED,
        });

        setSummaryCards([
          { title: "Total Users", value: users, icon: <Users size={28} /> },
          { title: "Total Products", value: products, icon: <Package size={28} /> },
          { title: "Total Orders", value: totalOrders, icon: <ShoppingCart size={28} /> },
          { title: "Total Revenue", value: `₹${revenue.toLocaleString()}`, icon: <IndianRupee size={28} /> },
        ]);
      } catch (error: any) {
        console.error("Dashboard error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  const total =
    chartData.delivered +
    chartData.shipped +
    chartData.pending +
    chartData.cancelled;

  const deliveredPercent = (chartData.delivered / total) * 100 || 0;
  const shippedPercent = (chartData.shipped / total) * 100 || 0;
  const pendingPercent = (chartData.pending / total) * 100 || 0;

  return (
    <div className="w-full h-full flex flex-col gap-6 text-gray-800 dark:text-gray-200">

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md flex items-center justify-between"
          >
            <div className="flex flex-col">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {card.title}
              </p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">

        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
            Recent Orders
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition"
                >
                  <td className="py-4 text-blue-600 dark:text-blue-400 font-medium">
                    {order.id}
                  </td>
                  <td className="py-4">{order.name}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
          <div
            className="w-40 h-40 rounded-full"
            style={{
              background: `conic-gradient(
                #22c55e 0% ${deliveredPercent}%,
                #3b82f6 ${deliveredPercent}% ${deliveredPercent + shippedPercent}%,
                #facc15 ${deliveredPercent + shippedPercent}% ${
                deliveredPercent + shippedPercent + pendingPercent
              }%,
                #a855f7 ${
                  deliveredPercent + shippedPercent + pendingPercent
                }% 100%
              )`,
            }}
          />
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm text-center">
            Order Status Distribution
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;