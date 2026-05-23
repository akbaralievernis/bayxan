import Skeleton from "@/components/ui/Skeleton";

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-[#1A1410]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-24">
        {/* Header */}
        <div className="py-8 sm:py-12 space-y-4">
          <Skeleton variant="text" className="w-28 h-3" />
          <Skeleton className="w-4/5 sm:w-2/3 h-16 sm:h-24" />
          <Skeleton variant="text" className="w-2/3 max-w-md h-3.5" />
        </div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-6 lg:gap-8 items-start">
          {/* Form sections */}
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-[#231A12]/50 border border-amber-900/20"
              >
                <Skeleton variant="text" className="w-32 h-3 mb-4" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                </div>
              </div>
            ))}
            <Skeleton className="h-14 rounded-full" />
          </div>

          {/* Order summary */}
          <aside className="space-y-4">
            <Skeleton className="h-64 rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  );
}
