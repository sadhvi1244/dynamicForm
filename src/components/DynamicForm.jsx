import React, { useState, useEffect } from "react";
import FieldRenderer from "./fieldRenderer";
import SubStringField from "./SubStringField";

const DynamicForm = ({ fields, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ensure subString fields are initialized
    const newData = { ...initialData };
    fields.forEach((f) => {
      if (f.type === "subString" && !newData[f.name]) {
        newData[f.name] = [];
      }
    });
    setFormData(newData);
  }, [initialData]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required) {
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }

      // Validate subString fields
      if (field.type === "subString" && Array.isArray(value)) {
        value.forEach((item, idx) => {
          field.fields.forEach((subField) => {
            if (
              subField.required &&
              (!item[subField.name] || item[subField.name] === "")
            ) {
              newErrors[
                `${field.name}.${idx}.${subField.name}`
              ] = `${subField.label} is required`;
            }
          });
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    if (field.type === "subString") {
      return (
        <SubStringField
          key={field.name}
          field={field}
          value={formData[field.name] || []}
          onChange={(value) => handleFieldChange(field.name, value)}
        />
      );
    }

    return (
      <FieldRenderer
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={(value) => handleFieldChange(field.name, value)}
        error={errors[field.name]}
      />
    );
  };

  return (
    <div className="space-y-4">
      {fields.map(renderField)}
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
