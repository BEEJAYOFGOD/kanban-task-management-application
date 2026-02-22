// components/BoardSkeleton.tsx
export default function BoardSkeleton() {
    return (
        <div className="flex w-full gap-4">
            {/* Simulate 3 columns */}
            {[1, 2, 3].map((col) => (
                <div key={col} className="flex flex-col gap-4 w-[240px]">
                    {/* Column header */}
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                        <div className="h-3 w-28 bg-gray-300 animate-pulse rounded" />
                    </div>

                    {/* Task cards */}
                    <div className="flex gap-2 flex-col">
                        {[1, 2, 3].map((task) => (
                            <div key={task} className="p-4 px-3 rounded-sm border bg-white space-y-2">
                                <div className="h-4 w-36 bg-gray-300 animate-pulse rounded" />
                                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
