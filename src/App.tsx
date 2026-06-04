import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import RevenueData from "./pages/RevenueData";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute"
import Categories from "./pages/Categories";
import AdminProfile from "./pages/AdminProfile";
import SearchPage from "./pages/SearchPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="revenuedata" element={<RevenueData />} />
          <Route path="categories" element={<Categories />} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;