import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Current Weather Skeleton */}
      <Card className="glass dark:glass-dark p-8 rounded-3xl border-2">
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-10 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <div className="text-center py-8">
            <Skeleton className="h-24 w-32 mx-auto mb-4" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </Card>

      {/* AI Assistant & Air Quality Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="glass dark:glass-dark p-6 rounded-3xl border-2">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Forecast Skeleton */}
      <div>
        <Skeleton className="h-10 w-48 mx-auto mb-6" />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-32 flex-shrink-0 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
