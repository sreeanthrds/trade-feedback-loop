
import { FileText, Code2 } from 'lucide-react';
import React from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export const navigationItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/features',
    label: 'Features',
  },
  {
    path: '/app/strategy-builder',
    label: 'Strategy Builder',
    icon: <Code2 className="h-4 w-4" />,
    showIcon: true,
  },
  {
    path: '/pricing',
    label: 'Pricing',
  },
  {
    path: '/blog',
    label: 'Blog',
  },
  {
    path: '/documentation',
    label: 'Documentation',
    icon: <FileText className="h-4 w-4" />,
    showIcon: true,
  },
];
