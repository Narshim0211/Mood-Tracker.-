import { cn } from '../../lib/cn';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-2 flex items-center justify-between', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('text-sm text-neutral-600 dark:text-neutral-300', className)} {...props} />;
}
