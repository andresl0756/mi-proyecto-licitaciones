import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTenders } from '../../hooks/useTenders';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Tender } from '../../types';

const ITEMS_PER_PAGE = 10;

interface TenderFilters {
  status?: string;
  category?: string;
  location?: string;
  minAmount?: number;
  maxAmount?: number;
}

export function TenderList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TenderFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: tenders, isLoading, error } = useTenders(filters);

  const filteredTenders = tenders?.filter(tender => 
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const totalPages = Math.ceil((filteredTenders?.length ?? 0) / ITEMS_PER_PAGE);
  const paginatedTenders = filteredTenders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error al cargar las licitaciones: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar licitaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Estado</option>
            <option value="published">Publicada</option>
            <option value="closed">Cerrada</option>
            <option value="awarded">Adjudicada</option>
          </select>
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tenders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Cierre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : paginatedTenders.map((tender) => (
              <TenderRow key={tender.id} tender={tender} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(page * ITEMS_PER_PAGE, filteredTenders.length)}
              </span>{' '}
              de <span className="font-medium">{filteredTenders.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function TenderRow({ tender }: { tender: Tender }) {
  const statusColors = {
    published: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    awarded: 'bg-blue-100 text-blue-800',
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {tender.code}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{tender.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(tender.closingAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[tender.status]}`}>
          {tender.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: tender.currency
        }).format(tender.estimatedAmount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => {/* Handle view details */}}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Ver Detalles
        </button>
        {tender.status === 'published' && (
          <button
            onClick={() => {/* Handle create proposal */}}
            className="text-green-600 hover:text-green-900"
          >
            Crear Propuesta
          </button>
        )}
      </td>
    </tr>
  );
}