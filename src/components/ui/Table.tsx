import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

const Table = <T extends { id: string | number }>(
  { columns, data, onRowClick }: TableProps<T>
): React.ReactElement => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                scope="col"
                className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr 
                key={item.id} 
                className={`transition-colors duration-200 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => {
                  if (col.accessor === 'actions') {
                    return (
                      <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex space-x-2">
                        <button className="border border-[#FFBC42] text-[#FFBC42] hover:bg-[#FFBC42] hover:text-white px-3 py-1 rounded">
                          Previsualizar
                        </button>
                        <button className="border border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white px-3 py-1 rounded">
                          Editar
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {col.render ? col.render(item) : String(item[col.accessor])}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;