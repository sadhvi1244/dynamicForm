import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import DynamicTable from "./DynamicTable";
import ConfirmModal from "./ConfirmModel";
import { api } from "../services/api";

const ModulePage = ({ moduleConfig }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { apiPath, fields, columns, label } = moduleConfig.frontend;

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(apiPath);
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiPath]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (moduleConfig.route === "/orders") {
        if (!formData.items || formData.items.length === 0) {
          throw new Error("Order must contain at least one item");
        }
      }

      if (editItem) {
        await api.put(`${apiPath}/${editItem._id}`, formData);
      } else {
        await api.post(apiPath, formData);
      }

      await fetchData();
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    const newItem = { ...item };
    fields.forEach((f) => {
      if (f.type === "subString" && !Array.isArray(newItem[f.name])) {
        newItem[f.name] = [];
      }
    });
    setEditItem(newItem);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`${apiPath}/${deleteId}`);
      await fetchData();
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditItem(null);
    setShowForm(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900">{label}</h1>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-300 transform hover:-translate-y-1"
          >
            + Add New
          </button>
        )}
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center py-12 text-gray-500 font-medium animate-pulse">
          Loading...
        </div>
      )}

      {/* Form Section */}
      {showForm ? (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editItem ? "Edit" : "Create New"} {label}
          </h2>
          <DynamicForm
            fields={fields}
            onSubmit={handleSubmit}
            initialData={editItem || {}}
            onCancel={() => {
              setShowForm(false);
              setEditItem(null);
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <DynamicTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ModulePage;
