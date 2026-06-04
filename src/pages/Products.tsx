import React, { useEffect, useState } from "react";
import { Trash2, Edit3, Box, Star } from "lucide-react";
import API from "../services/api";
import { useSearchParams } from "react-router-dom";

const Products = () => {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [params] = useSearchParams();
  const searchQuery = params.get("search") || "";

  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    price: "",
    comparePrice: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    status: "DRAFT",
    isFeatured: false,
  });

  const [sizes, setSizes] = useState([
    {
      size: "",
      stock: "",
    },
  ]);

  const [features, setFeatures] = useState([
    {
      title: "",
      description: "",
    },
  ]);

  const [images, setImages] = useState<File[]>([]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [actionText, setActionText] = useState("");

  const [sort, setSort] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);

  const fetchProducts = async (currentPage = 1) => {
    try {

      setLoading(true);

      const res = await API.get(
        `/admin/products/all-product?page=${currentPage}&limit=10&sort=${sort}&search=${searchQuery}&status=${statusFilter}`
      );

      setProducts(res.data.products);

      setTotalPages(res.data.pagination.totalPages);

    } catch (error: any) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    fetchCategories();
  }, [page, sort, searchQuery, statusFilter]);

  const fetchCategories = async () => {
    try {

      const res = await API.get("/admin/categories");

      setCategories(res.data.categories);

    } catch (error) {

      console.error("Category fetch error", error);
    }
  };

  const handleCreateProduct = async () => {

    

    try {

      if (
        !formData.name ||
        !formData.slug ||
        !formData.price 
      ) {
        alert("Please fill required fields");
        return;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: formData.comparePrice
          ? Number(formData.comparePrice)
          : null,
        categoryId: Number(formData.categoryId),
        sizes: JSON.stringify(
          sizes.filter((s) => s.size)
        ),
        features: JSON.stringify(
          features.filter((f) => f.title)
        ),
      };

      const data = new FormData();

      Object.entries(payload).forEach(
        ([key, value]) => {
          data.append(key, String(value));
        }
      );

      images.forEach((file) =>
        data.append("images", file)
      );

      await API.post(
        "/admin/products",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setShowModal(false);

      setFormData({
        name: "",
        slug: "",
        brand: "",
        price: "",
        comparePrice: "",
        shortDescription: "",
        description: "",
        categoryId: "",
        status: "DRAFT",
        isFeatured: false,
      });

      setSizes([
        {
          size: "",
          stock: "",
        },
      ]);

      setFeatures([
        {
          title: "",
          description: "",
        },
      ]);

      setImages([]);

      fetchProducts(page);

    } catch (error: any) {

      console.error(
        "Create error:",
        error.response?.data
      );
    }
  };

  

  const handleUpdateProduct = async () => {

  if (!editId) return;
  try {
    setActionLoading(true);
    setActionText("Updating product...");
    const data = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice
        ? Number(formData.comparePrice)
        : null,
      categoryId: Number(formData.categoryId),
      sizes: sizes.filter(
        (s) => s.size
      ),
      features: features.filter(
        (f) => f.title
      ),
    };
    await API.patch(
      `/admin/products/${editId}`,
      data
    );
    await fetchProducts(page);
    setShowEditModal(false);
    setEditId(null);
  } catch (error: any) {
    console.error(
      "Update error:",
      error.response?.data
    );
  } finally {
    setActionLoading(false);
  }
};

  const handleDeleteProduct = async () => {

    if (!deleteId) return;

    try {

      setActionLoading(true);

      setActionText(
        "Deleting product..."
      );

      await API.delete(
        `/admin/products/${deleteId}`
      );

      await fetchProducts(page);

      setShowDeleteModal(false);

      setDeleteId(null);

    } catch (error: any) {

      console.error(
        "Delete error:",
        error.response?.data
      );

    } finally {

      setActionLoading(false);
    }
  };

  const handleEditClick = (
    product: any
  ) => {

    setEditId(product.id);

    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      brand: product.brand || "",
      price: product.price?.toString() || "",
      comparePrice:
        product.comparePrice?.toString() || "",
      shortDescription:
        product.shortDescription || "",
      description:
        product.description || "",
      categoryId:
        product.categoryId?.toString() || "",
      isFeatured:
        product.isFeatured || false,
      status: product.status || "DRAFT",
    });

    setSizes(
      product.sizes?.length > 0
        ? product.sizes.map((s: any) => ({
            size: s.size,
            stock: s.stock.toString(),
          }))
        : [
            {
              size: "",
              stock: "",
            },
          ]
    );

    setFeatures(
      product.features?.length > 0
        ? product.features.map((f: any) => ({
            title: f.title,
            description: f.description || "",
          }))
        : [
            {
              title: "",
              description: "",
            },
          ]
    );

    setShowEditModal(true);
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full">

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Products
        </h1>

        <div className="flex items-center gap-3">

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          >

            <option value="">
              Sort
            </option>

            <option value="price_asc">
              Price: Low → High
            </option>

            <option value="price_desc">
              Price: High → Low
            </option>

          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-lime-500 hover:bg-lime-600 text-black px-4 py-2 rounded-lg font-semibold"
          >
            + Add Product
          </button>

        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="bg-gray-100 dark:bg-gray-900 text-xs uppercase border-b">

                <th className="px-6 py-4">
                  Product
                </th>

                <th className="px-6 py-4">
                  Price
                </th>

                <th className="px-6 py-4">
                  Brand
                </th>

                <th className="px-6 py-4">
                  Stock
                </th>

                <th className="px-6 py-4">
                  Category
                </th>

                <th className="px-6 py-4">
                  Featured
                </th>

                <th className="px-6 py-4 text-center">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {products.map((p: any) => (

                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >

                  <td className="px-6 py-4 flex items-center gap-3">

                    <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">

                      <Box size={22} />

                    </div>

                    <div>

                      <p className="font-bold">
                        {p.name}
                      </p>

                      <p className="text-sm">
                        {p.slug}
                      </p>

                    </div>

                  </td>

                  <td className="px-6 py-4">
                    ₹{p.price}
                  </td>

                  <td className="px-6 py-4">
                    {p.brand || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {p.sizes?.reduce(
                      (total: number, s: any) =>
                        total + s.stock,
                      0
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {p.category?.name}
                  </td>

                  <td className="px-6 py-4">

                    {p.isFeatured ? (
                      <Star
                        size={18}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ) : (
                      "-"
                    )}

                  </td>

                  <td className="px-6 py-4 flex justify-center gap-3">

                    <Edit3
                      size={18}
                      className="text-blue-500 cursor-pointer"
                      onClick={() =>
                        handleEditClick(p)
                      }
                    />

                    <button
                      onClick={() => {
                        setDeleteId(p.id);
                        setShowDeleteModal(true);
                      }}
                    >

                      <Trash2
                        size={18}
                        className="text-red-500 cursor-pointer"
                      />

                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Add Product
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Compare Price"
                  value={formData.comparePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comparePrice: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                {/* <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                /> */}
              </div>

              <textarea
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              />

              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              >

                <option value="">
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="mt-6">
              <h3 className="font-bold mb-3">
                Sizes
              </h3>
              {sizes.map((sizeItem, index) => (
                <div
                  key={index}
                  className="flex gap-3 mb-3"
                >
                  <input
                    type="text"
                    placeholder="Size (Example: UK 8)"
                    value={sizeItem.size}
                    onChange={(e) => {
                      const updatedSizes = [...sizes];
                      updatedSizes[index].size =
                        e.target.value;
                      setSizes(updatedSizes);
                    }}
                    className="border p-3 rounded-lg w-full"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={sizeItem.stock}
                    onChange={(e) => {
                      const updatedSizes = [...sizes];
                      updatedSizes[index].stock =
                        e.target.value;
                      setSizes(updatedSizes);
                    }}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setSizes([
                    ...sizes,
                    {
                      size: "",
                      stock: "",
                    },
                  ])
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                + Add Size
              </button>
            </div>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>


          <div className="mt-6">
            <h3 className="font-bold mb-3">
              Features
            </h3>
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-3 mb-3"
              >
                <input
                  type="text"
                  placeholder="Feature Title"
                  value={feature.title}
                  onChange={(e) => {
                    const updatedFeatures = [...features];
                    updatedFeatures[index].title =
                      e.target.value;
                    setFeatures(updatedFeatures);
                  }}
                  className="border p-3 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Feature Description"
                  value={feature.description}
                  onChange={(e) => {
                    const updatedFeatures = [...features];
                    updatedFeatures[index].description =
                      e.target.value;
                    setFeatures(updatedFeatures);
                  }}
                  className="border p-3 rounded-lg"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFeatures([
                  ...features,
                  {
                    title: "",
                    description: "",
                  },
                ])
              }
              className="bg-purple-500 text-white px-4 py-2 rounded-lg"
            >
              + Add Feature
            </button>
          </div>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setImages(
                    Array.from(e.target.files || [])
                  )
                }
                className="mt-4"
              />

              <div className="flex items-center gap-2 mt-4">

                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFeatured: e.target.checked,
                    })
                  }
                />

                <label>
                  Featured Product
                </label>

              </div>

              <button
                onClick={handleCreateProduct}
                className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-3 rounded-xl mt-6 font-bold"
              >
                Create Product
              </button>

            </div>

          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">

            <div className="bg-white dark:bg-gray-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                  Edit Product
                </h2>

                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                {/* <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                /> */}

                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Compare Price"
                  value={formData.comparePrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comparePrice: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                />

              </div>

              <textarea
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              />

              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                  })
                }
                className="border p-3 rounded-lg w-full mt-4"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}

              </select>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="border p-3 rounded-lg"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* SIZES */}
              <div className="mt-6">

                <h3 className="font-bold mb-3">
                  Sizes
                </h3>

                {sizes.map((sizeItem, index) => (

                  <div
                    key={index}
                    className="flex gap-3 mb-3"
                  >

                    <input
                      type="text"
                      placeholder="Size"
                      value={sizeItem.size}
                      onChange={(e) => {

                        const updatedSizes = [...sizes];

                        updatedSizes[index].size =
                          e.target.value;

                        setSizes(updatedSizes);
                      }}
                      className="border p-3 rounded-lg w-full"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={sizeItem.stock}
                      onChange={(e) => {

                        const updatedSizes = [...sizes];

                        updatedSizes[index].stock =
                          e.target.value;

                        setSizes(updatedSizes);
                      }}
                      className="border p-3 rounded-lg w-full"
                    />

                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setSizes([
                      ...sizes,
                      {
                        size: "",
                        stock: "",
                      },
                    ])
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  + Add Size
                </button>

              </div>

              {/* FEATURES */}
              <div className="mt-6">

                <h3 className="font-bold mb-3">
                  Features
                </h3>

                {features.map((feature, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-2 gap-3 mb-3"
                  >

                    <input
                      type="text"
                      placeholder="Feature Title"
                      value={feature.title}
                      onChange={(e) => {

                        const updatedFeatures = [...features];

                        updatedFeatures[index].title =
                          e.target.value;

                        setFeatures(updatedFeatures);
                      }}
                      className="border p-3 rounded-lg"
                    />

                    <input
                      type="text"
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={(e) => {

                        const updatedFeatures = [...features];

                        updatedFeatures[index].description =
                          e.target.value;

                        setFeatures(updatedFeatures);
                      }}
                      className="border p-3 rounded-lg"
                    />

                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setFeatures([
                      ...features,
                      {
                        title: "",
                        description: "",
                      },
                    ])
                  }
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  + Add Feature
                </button>

              </div>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setImages(
                    Array.from(e.target.files || [])
                  )
                }
                className="mt-4"
              />

              <div className="flex items-center gap-2 mt-4">

                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFeatured: e.target.checked,
                    })
                  }
                />

                <label>
                  Featured Product
                </label>

              </div>

              <button
                onClick={handleUpdateProduct}
                disabled={actionLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl mt-6 font-bold"
              >
                {actionLoading
                  ? actionText
                  : "Update Product"}
              </button>

            </div>

          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-500">
                Delete Product
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="px-5 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  {actionLoading
                    ? actionText
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Products;