import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
  );
}