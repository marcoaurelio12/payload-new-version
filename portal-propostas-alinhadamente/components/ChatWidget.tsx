
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface ChatWidgetProps {
    contact?: {
        email: string;
        whatsapp?: string;
    }
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ contact }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!contact) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end no-print">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-[#181818] border border-white/10 p-6 rounded-2xl shadow-2xl w-72"
          >
            <h4 className="text-white font-bold mb-2">Dúvidas?</h4>
            <p className="text-xs text-[#D1D1D1]/60 mb-4">A nossa equipa responde tipicamente em menos de 5 minutos.</p>
            
            <div className="space-y-3">
              <a 
                href={`mailto:${contact.email}`} 
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <EnvelopeIcon className="w-5 h-5 text-[#41CE2A]" />
                <span className="text-sm text-white">Enviar Email</span>
              </a>
              {contact.whatsapp && (
                <a 
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-3 p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-xl transition-colors text-left"
                >
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    <span className="text-sm text-white">WhatsApp</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#41CE2A] rounded-full flex items-center justify-center text-[#1F1F1F] shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <XMarkIcon className="w-8 h-8" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-8 h-8" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
