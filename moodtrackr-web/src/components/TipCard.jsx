import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Lightbulb } from 'lucide-react';

export function TipCard({ tip }) {
  if (!tip) return null;
  return (
    <Card className="border-amber-300/50 bg-amber-50/50 dark:border-amber-400/20 dark:bg-amber-900/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <CardTitle>Suggestion</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p>{tip}</p>
      </CardContent>
    </Card>
  );
}
