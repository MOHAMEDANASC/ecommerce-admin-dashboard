import { useState, useEffect } from "react";
import { Search, Moon, Sun, BellRing, User, LogOut, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // ✅ make sure this path is correct

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // 🔥 UPDATED SEARCH LOGIC (IMPORTANT)
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await API.get(`/admin/search?q=${search}`);

      const { users, products } = res.data;

      // 🎯 SMART NAVIGATION
      if (users.length > 0 && products.length === 0) {
        navigate(`/users?search=${search}`);
      } 
      else if (products.length > 0 && users.length === 0) {
        navigate(`/products?search=${search}`);
      } 
      else {
        navigate(`/search?q=${search}`);
      }

    } catch (error) {
      console.error("Search error:", error);
      navigate(`/search?q=${search}`); // fallback
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setIsProfileOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-[80px] shrink-0 z-10 bg-sky-100 dark:bg-gray-900 text-black dark:text-white flex items-center shadow-md px-6">

      <div className="text-2xl font-bold text-lime-500">
        VibeStore
      </div>

      <div className="flex items-center gap-4 ml-auto">

        {/* THEME */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDark ? <Sun /> : <Moon />}
        </button>

        {/* SEARCH */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search users or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded-full pl-11 pr-5"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* NOTIFICATION */}
        <button className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative">
          <BellRing />
          <div className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            1
          </div>
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileOpen(!isProfileOpen);
            }}
            className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <User />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">

              <button
                onClick={() => {
                  navigate("/adminprofile");
                  setIsProfileOpen(false);
                }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <CircleUserRound size={18} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                  window.location.reload();
                }}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;