import React, { useEffect, useState } from "react";
import { Edit3, Trash2, Mail, Phone } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const searchQuery = params.get("search") || "";

  // 🔥 DELETE STATE
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔥 EDIT STATE
  const [editUser, setEditUser] = useState({
    id: null as number | null,
    name: "",
    email: "",
    phone: "",
    isBlocked: false
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get(`/admin/users?search=${searchQuery}`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];

      setUsers(data);
    } catch (error: any) {
      console.error("Users fetch error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  // ✅ DELETE USER
  const handleDeleteUser = async () => {
    if (!deleteId) return;

    try {
      await API.delete(`/admin/users/${deleteId}`);

      setShowDeleteModal(false);
      setDeleteId(null);

      fetchUsers();
    } catch (error: any) {
      console.error("Delete error:", error.response?.data);
    }
  };

  // ✅ OPEN EDIT
  const openEdit = (user: any) => {
    setEditUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      isBlocked: user.isBlocked ?? false,
    });

    setShowEditModal(true);
  };

  // ✅ UPDATE USER
  const handleUpdateUser = async () => {
    if (!editUser.id) return;

    try {
      await API.put(`/admin/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        isBlocked: editUser.isBlocked,
      });

      setShowEditModal(false);

      // reset state
      setEditUser({
        id: null,
        name: "",
        email: "",
        phone: "",
        isBlocked: false
      });

      fetchUsers();
    } catch (error: any) {
      console.error("Update error:", error.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300">
        Loading users...
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          User Management
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs uppercase">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                {/* USER */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      USR-{user.id}
                    </p>
                  </div>
                </td>

                {/* CONTACT */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail size={14} /> {user.email}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Phone size={14} /> {user.phone || "No phone"}
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isBlocked
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">

                    {/* EDIT */}
                    <button
                      onClick={() => openEdit(user)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        setDeleteId(user.id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🔥 EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl w-[360px] space-y-3 shadow-lg">

            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Edit User
            </h2>

            <input
              placeholder="Name"
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />

            <input
              placeholder="Email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />

            <input
              placeholder="Phone"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />

            <select
              value={editUser.isBlocked ? "blocked" : "active"}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  isBlocked: e.target.value === "blocked",
                })
              }
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUser}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl w-[350px] space-y-4 shadow-lg">

            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Delete User?
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-300">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteUser}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Users;