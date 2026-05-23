import Skeleton from "@/components/ui/Skeleton";

export default function TeamLoading() {
  return (
    <div className="min-h-screen bg-[#1A1410]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
        <div className="py-8 sm:py-12 space-y-4">
          <Skeleton variant="text" className="w-24 h-3" />
          <Skeleton className="w-2/3 sm:w-1/2 h-14 sm:h-20" />
          <Skeleton variant="text" className="w-1/2 max-w-md h-3.5" />
        </div>

        <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 bg-[#231A12]/50 border border-amber-900/20"
            >
              <Skeleton className="aspect-[3/4] mb-3" />
              <Skeleton variant="text" className="w-2/3 h-4 mb-2" />
              <Skeleton variant="text" className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
