import React, { useState, useEffect } from "react";

const JsonEditorModal = ({ isOpen, onClose, currentConfig, onUpdate }) => {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(currentConfig, null, 2));
      setError("");
    }
  }, [isOpen, currentConfig]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onUpdate(parsed);
      onClose();
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Schema Configuration</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto mb-4">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-full min-h-[400px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> You can modify fields, add new modules,
            change field types, update options, or restructure the entire
            schema. Changes take effect immediately!
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonEditorModal;
