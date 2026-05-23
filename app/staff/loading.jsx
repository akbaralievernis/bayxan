import Skeleton from "@/components/ui/Skeleton";

export default function StaffLoading() {
  return (
    <div className="min-h-screen bg-[#1A1410]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
        <div className="py-8 sm:py-12 space-y-4">
          <Skeleton variant="text" className="w-24 h-3" />
          <Skeleton className="w-2/3 sm:w-1/2 h-14 sm:h-20" />
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>

        {/* Shift cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-[#231A12]/50 border border-amber-900/20 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-2/3 h-4" />
                  <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
              </div>
              <Skeleton className="h-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
