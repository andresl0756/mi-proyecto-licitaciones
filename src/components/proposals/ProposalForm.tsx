import React from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { useCreateProposal } from '../../hooks/useProposals';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Proposal } from '../../types';

type ProposalFormData = Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'reviewedAt' | 'reviewedBy'>;

interface ProposalFormProps {
  tenderId: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProposalForm({ tenderId, userId, onSuccess, onCancel }: ProposalFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProposalFormData>();
  const createProposal = useCreateProposal();
  const documents = watch('documents') || [];

  const onSubmit = async (data: ProposalFormData) => {
    try {
      await createProposal.mutateAsync({
        ...data,
        tenderId,
        userId,
        status: 'draft',
      });
      toast.success('Propuesta creada exitosamente');
      onSuccess?.();
    } catch (error) {
      toast.error('Error al crear la propuesta');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Propuesta</h3>
        
        {/* Technical Details */}
        <div className="space-y-4 mb-6">
          <h4 className="text-md font-medium text-gray-700">Detalles Técnicos</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              {...register('technicalDetails.description', { required: 'Este campo es requerido' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.technicalDetails?.description && (
              <p className="mt-1 text-sm text-red-600">{errors.technicalDetails.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Metodología
            </label>
            <textarea
              {...register('technicalDetails.methodology', { required: 'Este campo es requerido' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.technicalDetails?.methodology && (
              <p className="mt-1 text-sm text-red-600">{errors.technicalDetails.methodology.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cronograma
            </label>
            <textarea
              {...register('technicalDetails.timeline', { required: 'Este campo es requerido' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.technicalDetails?.timeline && (
              <p className="mt-1 text-sm text-red-600">{errors.technicalDetails.timeline.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipo de Trabajo
            </label>
            <textarea
              {...register('technicalDetails.team', { required: 'Este campo es requerido' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.technicalDetails?.team && (
              <p className="mt-1 text-sm text-red-600">{errors.technicalDetails.team.message}</p>
            )}
          </div>
        </div>

        {/* Commercial Details */}
        <div className="space-y-4 mb-6">
          <h4 className="text-md font-medium text-gray-700">Detalles Comerciales</h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto
              </label>
              <input
                type="number"
                {...register('commercialDetails.amount', {
                  required: 'Este campo es requerido',
                  min: { value: 0, message: 'El monto debe ser mayor a 0' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.commercialDetails?.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.commercialDetails.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Moneda
              </label>
              <select
                {...register('commercialDetails.currency', { required: 'Este campo es requerido' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="CLP">CLP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              {errors.commercialDetails?.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.commercialDetails.currency.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Términos de Pago
            </label>
            <textarea
              {...register('commercialDetails.paymentTerms', { required: 'Este campo es requerido' })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.commercialDetails?.paymentTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.commercialDetails.paymentTerms.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Validez de la Oferta
            </label>
            <input
              type="text"
              {...register('commercialDetails.validity', { required: 'Este campo es requerido' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.commercialDetails?.validity && (
              <p className="mt-1 text-sm text-red-600">{errors.commercialDetails.validity.message}</p>
            )}
          </div>
        </div>

        {/* Document Upload */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700">Documentos</h4>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Subir un archivo</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={(e) => {
                      // Handle file upload logic here
                    }}
                  />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOCX hasta 10MB</p>
            </div>
          </div>

          {documents.length > 0 && (
            <ul className="mt-4 divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="ml-2 text-sm text-gray-900">{doc.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Handle document removal
                    }}
                    className="ml-4 text-sm text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={createProposal.isPending}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createProposal.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Guardar Propuesta'
          )}
        </button>
      </div>
    </form>
  );
}