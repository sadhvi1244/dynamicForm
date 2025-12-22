import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const FieldRenderer = ({ field, value, onChange, error }) => {
  const [apiOptions, setApiOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(value || "");

  useEffect(() => {
    if (field.apiOptions) {
      api.get(field.apiOptions).then((res) => {
        setApiOptions(res.data);
      });
    }
  }, [field.apiOptions]);

  useEffect(() => {
    if (field.type === "imageLink") {
      setImagePreview(value || "");
    }
  }, [value, field.type]);

  const handleChange = (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    onChange(val);
    if (field.type === "imageLink") {
      setImagePreview(val);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <input
            type={field.type}
            value={value || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      case "dropdown":
        const options = field.apiOptions ? apiOptions : field.options || [];
        return (
          <select
            value={value || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {options.map((opt, idx) => (
              <option
                key={idx}
                value={field.optionValue ? opt[field.optionValue] : opt.value}
              >
                {field.optionLabel ? opt[field.optionLabel] : opt.label}
              </option>
            ))}
          </select>
        );

      case "tags":
        return (
          <input
            type="text"
            value={Array.isArray(value) ? value.join(", ") : ""}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="Comma-separated tags"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "rating":
        return (
          <div className="flex gap-1">
            {[...Array(field.max || 5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i + 1)}
                className={`text-2xl ${
                  i < (value || 0) ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        );

      case "imageLink":
        return (
          <div>
            <input
              type="text"
              value={value || ""}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        );

      case "geolocation":
        const loc = value || { lat: "", lng: "" };
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={loc.lat || ""}
              onChange={(e) => onChange({ ...loc, lat: e.target.value })}
              placeholder="Latitude"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="any"
              value={loc.lng || ""}
              onChange={(e) => onChange({ ...loc, lng: e.target.value })}
              placeholder="Longitude"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      default:
        return (
          <div className="text-red-500">Unknown field type: {field.type}</div>
        );
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FieldRenderer;
