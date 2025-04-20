import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  progressValue?: number;
}

export function StatsCard({
  title,
  value,
  subValue,
  icon,
  change,
  changeType = 'positive',
  progressValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-muted-foreground">{title}</h3>
          <i className={`${icon} text-accent`}></i>
        </div>
        <p className="text-3xl font-bold">{value}</p>
        
        {progressValue !== undefined && (
          <div className="w-full bg-accent/10 rounded-full h-2.5 mt-3">
            <div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
        )}
        
        {change && (
          <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'} mt-2`}>
            <i className={`fas ${changeType === 'positive' ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> {change}
          </p>
        )}
        
        {!change && subValue && (
          <p className="text-sm text-muted-foreground mt-2">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
