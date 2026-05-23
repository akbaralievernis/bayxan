import Skeleton, { SkeletonCard } from "@/components/ui/Skeleton";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-[#1A1410]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
        {/* Header */}
        <div className="py-8 sm:py-12 space-y-4">
          <Skeleton variant="text" className="w-32 h-3" />
          <Skeleton className="w-3/4 sm:w-1/2 h-14 sm:h-20" />
          <Skeleton variant="text" className="w-2/3 max-w-md h-3.5" />
        </div>

        {/* Category rail */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24 sm:w-28 shrink-0 rounded-full"
            />
          ))}
        </div>

        {/* Dish grid */}
        <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
