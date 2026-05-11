import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  maxHeight?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export const ResponsiveTable = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  maxHeight = "h-96",
  emptyMessage = "No hay datos disponibles",
  loading = false
}: ResponsiveTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-slate-500">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Vista Desktop - Tabla tradicional */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className={`overflow-y-auto ${maxHeight}`}>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                    } ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <ChevronDownIcon 
                          className={`w-4 h-4 transition-transform ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc' 
                              ? 'rotate-180' 
                              : ''
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(item)}
                    className={`${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''
                    } transition-colors`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                      >
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {sortedData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
            <p className="text-slate-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className={`space-y-3 overflow-y-auto ${maxHeight}`}>
            {sortedData.map((item, index) => (
              <MobileCard
                key={index}
                item={item}
                columns={columns.filter(col => !col.hideOnMobile)}
                onClick={() => onRowClick?.(item)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const MobileCard = <T extends Record<string, any>>({
  item,
  columns,
  onClick
}: {
  item: T;
  columns: Column<T>[];
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 ${
      onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
    }`}
  >
    <div className="space-y-2">
      {columns.map((column, index) => {
        const value = column.render ? column.render(item[column.key], item) : item[column.key];
        
        return (
          <div key={String(column.key)} className={index === 0 ? "border-b border-slate-100 pb-2" : ""}>
            {index === 0 ? (
              // Primera fila como título principal
              <div className="font-semibold text-slate-900 text-base">
                {value}
              </div>
            ) : (
              // Resto de filas como datos secundarios
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">
                  {column.label}:
                </span>
                <span className="text-sm text-slate-900 font-medium text-right">
                  {value}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);