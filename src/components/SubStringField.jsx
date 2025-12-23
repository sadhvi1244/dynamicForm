import React, { useEffect } from "react";
import FieldRenderer from "./fieldRenderer.jsx";

const SubStringField = ({ field, value, onChange }) => {
  const items = value || [];

  // Initialize with one empty item if empty
  useEffect(() => {
    if (items.length === 0) {
      const newItem = field.fields.reduce((acc, f) => {
        acc[f.name] = "";
        return acc;
      }, {});
      onChange([newItem]);
    }
  }, []);

  const addItem = () => {
    const newItem = field.fields.reduce((acc, f) => {
      acc[f.name] = "";
      return acc;
    }, {});
    onChange([...items, newItem]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index, fieldName, fieldValue) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: fieldValue };
    onChange(newItems);
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Item {index + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
          {field.fields.map((subField) => (
            <FieldRenderer
              key={`${field.name}.${index}.${subField.name}`}
              field={subField}
              value={item[subField.name] || ""}
              onChange={(val) => updateItem(index, subField.name, val)}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
      >
        Add {field.label}
      </button>
    </div>
  );
};

export default SubStringField;
