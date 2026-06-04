import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2, Edit3 } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await API.post("/admin/categories", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEdit = (category: any) => {
    setEditId(category.id);
    setEditName(category.name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim() || !editId) return;

    try {
      await API.put(`/admin/categories/${editId}`, {
        name: editName,
      });

      setShowEditModal(false);
      setEditId(null);
      setEditName("");

      fetchCategories();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Categories
      </h1>

      {/* ADD CATEGORY */}
      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full 
          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-lime-400"
        />

        <button
          onClick={handleCreate}
          className="bg-lime-500 hover:bg-lime-600 text-black px-5 py-2 rounded-lg font-semibold transition"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left">

          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-sm uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                >
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    CAT-{String(c.id).padStart(3, "0")}
                  </td>

                  <td className="py-3 px-4 text-gray-800 dark:text-white font-medium">
                    {c.name}
                  </td>

                  <td className="py-3 px-4 flex justify-center gap-4">

                    <button
                      onClick={() => openEdit(c)}
                      className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    >
                      <Edit3 size={16} className="text-blue-500" />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-6 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-[350px] space-y-4 shadow-xl">

            <h2 className="font-bold text-lg text-gray-800 dark:text-white">
              Edit Category
            </h2>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white transition"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;