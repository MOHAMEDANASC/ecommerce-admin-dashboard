import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    // Main wrapper is now a column
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* Navbar - Sits at the very top, full width */}
      <Navbar />

      {/* Bottom Section - Contains Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - Sits underneath the Navbar on the left */}
        <Sidebar />

        {/* Content - Takes the remaining width on the right */}
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-black">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};


export default AdminLayout;