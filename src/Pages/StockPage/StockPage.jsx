import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StockPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8000/api/students"; // change to your API

const Stock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🔹 Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // show 5 per page

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    discount: "",
    subtotal: 0,
    total: 0,
    image: null,
  });

  // 🔹 Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      toast.error("Error fetching products");
    }
  };

  // 🔹 Popup controls
  const togglePopup = () => setIsOpen(!isOpen);

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto calculate subtotal & total
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.price) || 0;
      const discount = parseFloat(updated.discount) || 0;

      const subtotal = price - (price * discount) / 100;
      const total = qty * subtotal;

      updated.subtotal = subtotal.toFixed(2);
      updated.total = total.toFixed(2);

      return updated;
    });
  };

  // 🔹 Handle image input
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // 🔹 Save (POST or PUT)
  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.price ||
      !formData.discount
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("subtotal", formData.subtotal);
      formDataToSend.append("total", formData.total);

      // Only append image if it's a File (new upload)
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      if (editId) {
        await axios.post(`${API_URL}/${editId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          params: { _method: "PUT" }, // for Laravel method spoofing
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(API_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }

      fetchProducts();
      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
        discount: "",
        subtotal: 0,
        total: 0,
        image: null,
      });
      setEditId(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("Error saving product");
    }
  };

  // 🔹 Edit product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      discount: product.discount,
      subtotal: product.subtotal,
      total: product.total,
      image: product.image, // keep old image reference
    });
    setEditId(product.id);
    setIsOpen(true);
  };

  // 🔹 Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
      toast.info("Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  // 🔹 Filter & Paginate
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2>Stock Management</h2>
      <div className="content-container">
        {/* Search & Add New Button */}
        <div className="popup-container">
          <div className="search-box d-inline-block me-3">
            <i class="bx bx-search-alt icon"></i>
            <input
              type="search"
              id="Search"
              placeholder="Search..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page when searching
              }}
            />
            {/* <input type="date" id="date" className="form-control" /> */}
          </div>
          <button
            className="open-btn btn btn-success"
            onClick={() => {
              setEditId(null);
              setFormData({
                name: "",
                category: "",
                quantity: "",
                price: "",
                discount: "",
                subtotal: 0,
                total: 0,
                image: null,
              });
              setIsOpen(true);
            }}
          >
            Add New
          </button>

          {/* Popup Form */}
          {isOpen && (
            <div className="popup-overlay" onClick={togglePopup}>
              <div className="popup-box" onClick={(e) => e.stopPropagation()}>
                <h4 className="title">{editId ? "Edit Product" : "Add New"}</h4>

                {/* Name */}
                <div className="mb-3 text-start">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Category */}
                <div className="mb-3 text-start">
                  <label htmlFor="category" className="form-label">
                    Category:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                {/* Quantity */}
                <div className="mb-3 text-start">
                  <label htmlFor="quantity" className="form-label">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>

                {/* Price */}
                <div className="mb-3 text-start">
                  <label htmlFor="price" className="form-label">
                    Price:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                {/* Discount */}
                <div className="mb-3 text-start">
                  <label htmlFor="discount" className="form-label">
                    Discount (%):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>

                {/* Image */}
                <div className="mb-3 text-start">
                  <label htmlFor="formFile" className="form-label">
                    Choose File:
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    name="image"
                    onChange={handleImageChange}
                  />
                  {formData.image && (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? `http://localhost:8000/storage/${formData.image}`
                          : URL.createObjectURL(formData.image)
                      }
                      alt="preview"
                      width="100"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Show Subtotal & Total */}
                <div className="mb-3 text-start">
                  <label className="form-label">Subtotal:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${formData.subtotal}`}
                    readOnly
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label">Total:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`$${formData.total}`}
                    readOnly
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    className="close-btn btn btn-danger"
                    onClick={togglePopup}
                  >
                    X
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    {editId ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Subtotal</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product.id}>
                <td>{startIndex + index + 1}</td>
                <td>
                  {product.image ? (
                    <img
                      src={`http://localhost:8000/storage/${product.image}`}
                      alt={product.name}
                      width="35"
                      height="35"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>${product.price}</td>
                <td>{product.discount} %</td>
                <td>${product.subtotal}</td>
                <td>${product.total}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="10">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-container mt-3">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => goToPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>

        {/* Toast notifications container */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
};

export default Stock;
