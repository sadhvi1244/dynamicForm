import React, { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import DynamicTable from "./DynamicTable";
import ConfirmModal from "./ConfirmModal";
import { api } from "../services/api";

const ModulePage = ({ moduleConfig }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { apiPath, fields, columns, label } = moduleConfig.frontend;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(apiPath);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      if (editItem) {
        await api.put(`${apiPath}/${editItem.id}`, formData);
      } else {
        await api.post(apiPath, formData);
      }
      await fetchData();
      setShowForm(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await api.delete(`${apiPath}/${deleteId}`);
      await fetchData();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditItem(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{label}</h1>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <DynamicTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

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
