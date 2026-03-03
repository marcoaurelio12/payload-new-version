
import React from 'react';
import { motion } from 'framer-motion';

const ROI_DATA = [
  {
    feature: "Agendamento (Cal.com)",
    value: "Elimina o 'vai-e-vem' de e-mails para marcar reuniões técnicas ou comerciais.",
    metric: "+25% na taxa de marcação de consultas.",
    color: "bg-blue-500/10 text-blue-500 dark:text-blue-400"
  },
  {
    feature: "Auto-Newsletter",
    value: "O site trabalha por si: novos artigos do blog são enviados automaticamente aos clientes.",
    metric: "Poupança de 16h/mês de trabalho administrativo.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
  },
  {
    feature: "Soberania Digital",
    value: "Sem 'taxas de plataforma' ocultas ou risco de perder dados críticos da Sociedade.",
    metric: "100% de controlo sobre os ativos digitais.",
    color: "bg-[#41CE2A]/10 text-[#41CE2A]"
  }
];

const ROISection: React.FC = () => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-4xl font-fluent text-gray-900 dark:text-white mb-4 transition-colors">Porquê a Alinhadamente?</h2>
        <p className="text-gray-600 dark:text-[#D1D1D1]/60 text-lg font-light transition-colors">Transformamos infraestrutura tecnológica em retorno financeiro e tempo de foco jurídico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ROI_DATA.map((item, idx) => (
          <motion.div
            key={item.feature}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="p-8 glass-card rounded-3xl border border-black/5 dark:border-white/5 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${item.color}`}>
                Funcionalidade Impactante
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">{item.feature}</h3>
              <p className="text-gray-600 dark:text-[#D1D1D1]/70 text-sm leading-relaxed mb-8 transition-colors">{item.value}</p>
            </div>
            
            <div className="pt-6 border-t border-black/5 dark:border-white/5 transition-colors">
              <p className="text-xs text-gray-400 dark:text-[#D1D1D1]/40 uppercase tracking-widest mb-1 transition-colors">Métrica de ROI</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">{item.metric}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ROISection;
