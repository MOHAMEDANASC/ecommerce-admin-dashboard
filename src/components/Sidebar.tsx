import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Tag
} from "lucide-react";

const Sidebar = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-gray-900 dark:bg-gray-700 text-white font-bold border-l-4 border-lime-400 shadow-lg"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
    }`;

  return (
    <div className="w-64 h-full bg-sky-100 dark:bg-gray-800 text-black dark:text-white p-4 overflow-y-auto shrink-0 border-r border-gray-200 dark:border-gray-700 transition-colors">
      
      <div className="mb-8 px-2">
        <h2 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
          Admin Panel
        </h2>
      </div>

      <ul className="space-y-2">
        <li>
          <NavLink to="/Dashboard" className={getNavLinkClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={getNavLinkClass}>
            <Users size={20} /> Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={getNavLinkClass}>
            <Package size={20} /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className={getNavLinkClass}>
            <ShoppingCart size={20} /> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/revenuedata" className={getNavLinkClass}>
            <IndianRupee size={20} /> Revenue
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" className={getNavLinkClass}>
            <Tag size={20} /> Categories
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 