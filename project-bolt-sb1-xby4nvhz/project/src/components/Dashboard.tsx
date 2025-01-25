import React from 'react';
import { LineChart, BarChart, Search as SearchIcon, Bell as BellIcon } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Licitaciones Activas</h3>
            <LineChart className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">24</p>
          <p className="text-sm text-gray-500">+12% vs mes anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Propuestas Enviadas</h3>
            <BarChart className="h-6 w-6 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">18</p>
          <p className="text-sm text-gray-500">+8% vs mes anterior</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Tasa de Éxito</h3>
            <LineChart className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">65%</p>
          <p className="text-sm text-gray-500">+5% vs mes anterior</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar licitaciones..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Buscar
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
            Región Metropolitana
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
            Tecnología
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
            $10M+
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
            Esta semana
          </button>
        </div>
      </div>

      {/* Recent Tenders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Licitaciones Recientes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-600">ID: 2024-{item}</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    Servicios de Desarrollo de Software
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Región Metropolitana • Tecnología • $15M - $20M
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activa
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <BellIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Cierre: 15 Mar 2024</span>
                  <span className="text-sm text-gray-500">3 días restantes</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}