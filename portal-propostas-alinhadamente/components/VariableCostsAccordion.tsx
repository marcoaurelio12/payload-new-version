
import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { VariableCost } from '../types';

interface VariableCostsProps {
  costs: VariableCost[];
}

const VariableCostsAccordion: React.FC<VariableCostsProps> = ({ costs }) => {
  if (!costs || costs.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-fluent text-gray-900 dark:text-white tracking-tight transition-colors">Custos Variáveis Externos</h2>
          <p className="text-xs text-gray-500 dark:text-[#D1D1D1]/40 mt-2 max-w-md transition-colors">
            Estes valores são pagos diretamente aos fornecedores (Hosting, Domínios, APIs). A Alinhadamente configura, mas a faturação é em seu nome.
          </p>
        </div>
        <div className="bg-[#41CE2A]/5 border border-[#41CE2A]/20 rounded-2xl p-4 flex items-center space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-[#41CE2A]" />
          <span className="text-[10px] text-gray-600 dark:text-[#D1D1D1]/60 font-medium leading-tight transition-colors">
            Transparência Radical: <br/> Lucro Zero sobre estes serviços.
          </span>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-[#D1D1D1]/40">Serviço</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-[#D1D1D1]/40">Custo Estimado</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-[#D1D1D1]/40">Detalhe</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-[#D1D1D1]/40 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-6">
                    <span className="font-bold text-gray-900 dark:text-white">{cost.name}</span>
                  </td>
                  <td className="p-6">
                     <span className="font-mono text-gray-600 dark:text-[#D1D1D1]">~{cost.estimated_cost}€</span>
                  </td>
                  <td className="p-6">
                     <p className="text-sm text-gray-500 dark:text-[#D1D1D1]/60">{cost.description}</p>
                  </td>
                  <td className="p-6 text-right">
                    {cost.required ? (
                       <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase rounded">Obrigatório</span>
                    ) : (
                       <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-[#D1D1D1]/50 text-[10px] font-bold uppercase rounded">Opcional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VariableCostsAccordion;
