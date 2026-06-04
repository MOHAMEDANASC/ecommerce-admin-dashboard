import { useEffect, useState } from "react";
import API from "../services/api";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

const RevenueData = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        setStats(data.stats);
        setOrders(data.recentOrders);
      } catch (err: any) {
        console.error("❌ Dashboard Error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-xl text-gray-400 animate-pulse font-medium">
          Fetching Data...
        </h1>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-red-500 font-semibold">{error}</h1>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">

      {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Financial performance overview
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        label: "Gross Revenue",
        value: `₹${stats.totalRevenue.toLocaleString()}`,
        icon: <IndianRupee size={20} />,
      },
      {
        label: "Total Orders",
        value: stats.totalOrders,
        icon: <ShoppingCart size={20} />,
      },
      {
        label: "Active Users",
        value: stats.totalUsers,
        icon: <Users size={20} />,
      },
      {
        label: "Live Products",
        value: stats.totalProducts,
        icon: <Package size={20} />,
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md flex items-center justify-between"
      >
        
        {/* TEXT */}
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            {item.label}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {item.value}
          </h2>
        </div>

        {/* ICON */}
        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          {item.icon}
        </div>

      </div>
    ))}
  </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 border rounded-2xl shadow overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-lg font-bold dark:text-white">
            Recent Transactions
          </h2>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs uppercase border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Ref ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-6 py-4 text-blue-600 font-bold">
                  #TR-{order.id}
                </td>

                <td className="px-6 py-4">
                  {order.user?.name || "Unknown"}
                </td>

                <td className="px-6 py-4 font-bold">
                  ₹{order.total.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default RevenueData;