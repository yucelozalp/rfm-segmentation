'use client';

import { RFMScore } from '@/types/rfm';

interface SelectedCustomersProps {
  selectedCustomers: RFMScore[];
  onRemoveCustomer: (customerId: string) => void;
  onSendToAPI: () => void;
  isLoading: boolean;
}

/**
 * Seçilen müşterileri listeleyen ve API'ye gönderen component
 */
export default function SelectedCustomers({ 
  selectedCustomers, 
  onRemoveCustomer, 
  onSendToAPI,
  isLoading 
}: SelectedCustomersProps) {
  
  if (selectedCustomers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Seçilen Müşteriler</h3>
        <p className="text-gray-500 text-center py-8">
          Henüz müşteri seçilmedi. Grid'den müşteri seçmek için hücrelere tıklayın.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Seçilen Müşteriler ({selectedCustomers.length})
        </h3>
        <button
          onClick={onSendToAPI}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-md font-medium transition-colors
            ${isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isLoading ? 'Gönderiliyor...' : 'API\'ye Gönder'}
        </button>
      </div>

      {/* Müşteri listesi */}
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {selectedCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="font-medium text-gray-900">
                    {customer.id}
                  </div>
                  <div className="flex space-x-3 text-sm text-gray-600">
                    <span title="Recency (gün)">
                      R: {customer.recency}
                    </span>
                    <span title="Frequency (adet)">
                      F: {customer.frequency}
                    </span>
                    <span title="Monetary (TL)">
                      M: {customer.monetary.toLocaleString('tr-TR')}₺
                    </span>
                  </div>
                  <div className="flex space-x-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      R:{customer.recency_score}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      F:{customer.frequency_score}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      M:{customer.monetary_score}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveCustomer(customer.id)}
                className="ml-4 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                title="Seçimden kaldır"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Özet istatistikler */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {Math.round(selectedCustomers.reduce((sum, c) => sum + c.recency, 0) / selectedCustomers.length)}
            </div>
            <div className="text-gray-500">Ort. Recency</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {Math.round(selectedCustomers.reduce((sum, c) => sum + c.frequency, 0) / selectedCustomers.length)}
            </div>
            <div className="text-gray-500">Ort. Frequency</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {Math.round(selectedCustomers.reduce((sum, c) => sum + c.monetary, 0) / selectedCustomers.length).toLocaleString('tr-TR')}₺
            </div>
            <div className="text-gray-500">Ort. Monetary</div>
          </div>
        </div>
      </div>
    </div>
  );
}