import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FeatureTooltipProps {
  text: string;
  tooltip?: string;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({ text, tooltip }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);

  // Determine optimal position based on available space
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceAbove >= spaceBelow ? 'top' : 'bottom');
    }
  }, [isVisible]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  // No tooltip - render plain text
  if (!tooltip) {
    return <span>{text}</span>;
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-describedby={isVisible ? 'tooltip-content' : undefined}
    >
      {/* Text with dotted underline */}
      <span className="border-b border-dotted border-current">
        {text}
      </span>

      {/* Question mark icon */}
      <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#41CE2A] transition-colors flex-shrink-0" />

      {/* Tooltip popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id="tooltip-content"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
              absolute z-50 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
              left-1/2 -translate-x-1/2
              w-56 p-3
              bg-[#1F1F1F] text-white text-xs leading-relaxed
              rounded-lg shadow-xl
              pointer-events-none
              dark:bg-[#1a5c14]
            `}
          >
            <p className="font-bold text-white mb-1">{text}</p>
            <p className="text-white/90">{tooltip}</p>
            {/* Arrow */}
            <div
              className={`
                absolute left-1/2 -translate-x-1/2
                w-2 h-2 bg-[#1F1F1F] rotate-45
                ${position === 'top' ? 'top-full -mt-1' : 'bottom-full -mb-1'}
                dark:bg-[#1a5c14]
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default FeatureTooltip;
