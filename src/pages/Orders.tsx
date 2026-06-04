import React, { useEffect, useState } from "react";
import { MoreVertical, Eye } from "lucide-react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("ALL");

  // 🎨 STATUS STYLES
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "PENDING":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "CANCELLED":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "PAID":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // 🔥 FETCH ORDERS (UPDATED)
  const fetchOrders = async (currentPage = 1) => {
    try {
      setLoading(true);

      const res = await API.get(
        `/admin/orders?page=${currentPage}&limit=10&status=${status}`
      );

      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.totalPages);

    } catch (error: any) {
      console.error(
        "Order fetch error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page, status]);

  if (loading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden">

      {/* HEADER + FILTER */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Orders List
        </h2>

        {/* 🔥 STATUS FILTER */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1); // reset page
          }}
          className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs uppercase border-b border-gray-300 dark:border-gray-700">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                >

                  {/* ORDER ID */}
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                    #ORD-{order.id}
                  </td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                    {order.user?.name || "Unknown"}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{order.total?.toLocaleString()}
                  </td>

                  
                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* 🔥 PAGINATION */}
      <div className="flex justify-center items-center gap-4 py-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-gray-800 dark:text-white font-semibold">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Orders;