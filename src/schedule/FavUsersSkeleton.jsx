const FavUsersSkeleton = () => {
  return (
    <div className="w-full max-w-2xl animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      
      <div className="mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default FavUsersSkeleton;
