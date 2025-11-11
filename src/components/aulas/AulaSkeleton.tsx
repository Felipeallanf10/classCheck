export function AulaSkeleton() {
  return (
    <div className="bg-white dark:bg-muted border rounded-lg p-4 shadow space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  )
}

export function AulasSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <AulaSkeleton key={i} />
      ))}
    </div>
  )
}
