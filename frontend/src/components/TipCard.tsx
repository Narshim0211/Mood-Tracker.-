
export function TipCard({ tip }: { tip: string }) {
  if (!tip) return null;
  return (
    <div className="mt-4 p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
      <p className="text-sm text-green-800 dark:text-green-200">{tip}</p>
    </div>
  );
}
