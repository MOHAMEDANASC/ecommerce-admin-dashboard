import { useEffect, useState } from "react";
import API from "../services/api";
import { Mail, Calendar } from "lucide-react";

interface Admin {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminProfile = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
  });

  // 🔥 Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/admin/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(res.data);

        setAdmin(res.data.admin);

        setFormData({
          name: res.data.admin.name,
          email: res.data.admin.email,
          password: "",
        });

        setOriginalData({
          name: res.data.admin.name,
          email: res.data.admin.email,
        });

      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 Input change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Detect changes
  const isChanged =
    formData.name !== originalData.name ||
    formData.email !== originalData.email ||
    formData.password !== "";

  // 🔥 Save
  const handleSave = async () => {
    try {
      await API.put("/admin/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAdmin({
        ...admin!,
        name: formData.name,
        email: formData.email,
      });

      setOriginalData({
        name: formData.name,
        email: formData.email,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!admin) {
    return <div className="p-6 text-red-500">Failed to load profile</div>;
  }

  return (
    <div className="p-6 space-y-6 text-gray-800 dark:text-gray-200">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-md flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold">
          {admin?.name?.charAt(0) || "A"}
        </div>

        <div>
          <h2 className="text-xl font-bold">
            {admin?.name || "Admin"}
          </h2>

          <p className="text-gray-500 flex items-center gap-2 text-sm">
            <Mail size={14} /> {admin?.email || "No Email"}
          </p>

          <p className="text-gray-500 flex items-center gap-2 text-sm">
            <Calendar size={14} />{" "}
            {admin?.createdAt ? new Date(admin.createdAt).toDateString(): "No Date"}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROFILE INFO */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-md">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile Information</h2>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setFormData({
                      name: admin.name,
                      email: admin.email,
                      password: "",
                    });
                  }}
                  className="text-blue-600 text-sm font-medium"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={!isChanged}
                    className={`text-sm font-medium ${
                      isChanged
                        ? "text-green-600"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: originalData.name,
                        email: originalData.email,
                        password: "",
                      });
                    }}
                    className="text-red-500 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* FIELDS */}
          <div className="space-y-4 text-sm">

            {/* NAME */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Full Name</span>

              {isEditing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <span className="font-medium">{admin?.name || "Admin"}</span>
              )}
            </div>

            {/* EMAIL */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Email</span>

              {isEditing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <span className="font-medium">{admin?.email || "No Email"}</span>
              )}
            </div>

            {/* ROLE */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Role</span>
              <span className="font-medium">{admin.role}</span>
            </div>

            {/* DATE */}
            <div className="flex justify-between">
              <span className="text-gray-500">Joined Date</span>
              <span className="font-medium">
                {admin?.createdAt ? new Date(admin.createdAt).toDateString(): "No Date"}
              </span>
            </div>

          </div>
        </div>

        {/* SECURITY */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Security</h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-500">Password</span>

              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              ) : (
                <span className="text-blue-600 text-sm">Change</span>
              )}
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Two Factor Auth</span>
              <span className="text-green-600 text-xs font-semibold">
                Enabled
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Account Status</span>
              <span className="text-green-600 text-xs font-semibold">
                Active
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;