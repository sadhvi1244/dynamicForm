import React from "react";

const DynamicTable = ({ columns, data, onEdit, onDelete }) => {
  const renderCell = (column, row) => {
    if (column.type === "subStringTable") {
      const items = row[column.key] || [];
      if (!items.length) return <span className="text-gray-400">—</span>;
      return (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {column.columns.map((col) => (
                <th key={col.key} className="px-2 py-1 text-left border-b">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                {column.columns.map((col) => (
                  <td key={col.key} className="px-2 py-1 border-b">
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const value = row[column.key];
    return column.render ? column.render(value) : value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-sm border-b">
                    {renderCell(col, row)}
                  </td>
                ))}
                <td className="px-4 py-2 text-sm border-b">
                  <button
                    onClick={() => onEdit(row)}
                    className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(row.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
