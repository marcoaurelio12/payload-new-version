
import React from 'react';
import { 
  DocumentTextIcon, 
  MicrophoneIcon, 
  UserGroupIcon, 
  ScaleIcon, 
  BriefcaseIcon,
  ServerIcon,
  BoltIcon,
  AcademicCapIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export const COLORS = {
  bg: '#1F1F1F',
  bgDark: '#121212',
  accent: '#41CE2A',
  text: '#D1D1D1',
};

/**
 * Mapping of Payload 'Select' strings to Heroicons
 * Kept here as a utility for the dynamic components
 */
export const getIcon = (iconName: string, className?: string) => {
  const cn = className || "w-8 h-8";
  // Normalize string to handle case sensitivity from CMS
  const name = iconName?.toLowerCase();
  
  switch (name) {
    case 'document': return <DocumentTextIcon className={cn} />;
    case 'microphone': return <MicrophoneIcon className={cn} />;
    case 'usergroup': return <UserGroupIcon className={cn} />;
    case 'scale': return <ScaleIcon className={cn} />;
    case 'briefcase': return <BriefcaseIcon className={cn} />;
    case 'server': return <ServerIcon className={cn} />;
    case 'bolt': return <BoltIcon className={cn} />;
    case 'academiccap': return <AcademicCapIcon className={cn} />;
    case 'cpu': return <CpuChipIcon className={cn} />;
    case 'globe': return <GlobeAltIcon className={cn} />;
    case 'chat': return <ChatBubbleLeftRightIcon className={cn} />;
    default: return <DocumentTextIcon className={cn} />;
  }
};
