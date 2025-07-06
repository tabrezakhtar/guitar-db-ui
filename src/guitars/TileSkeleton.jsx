function TileSkeleton({ tileClass }) {
  return (
    <div className={`break-inside-avoid rounded-lg overflow-hidden relative animate-pulse bg-gray-200 ${tileClass}`}>
      {/* Main skeleton background */}
      <div className="absolute inset-0 w-full h-full bg-gray-300"></div>
      
      {/* Avatar skeleton - top left */}
      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-gray-400 shadow-sm flex items-center">
        <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
        <div className="ml-2 w-16 h-3 bg-gray-500 rounded"></div>
      </div>
      
      {/* Equipment type icon skeleton - top right */}
      <div className="absolute top-2 right-2 bg-gray-400 rounded-full p-1 shadow-md">
        <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
      </div>
      
      {/* Title skeleton - center */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-3">
        <div className="px-3 py-2 rounded bg-gray-400">
          <div className="w-32 h-5 bg-gray-500 rounded"></div>
        </div>
      </div>
      
      {/* Like and comment buttons skeleton - bottom right */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <div className="bg-gray-400 px-2 py-1 rounded inline-flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
          <div className="w-4 h-3 bg-gray-500 rounded"></div>
        </div>
        <div className="bg-gray-400 px-2 py-1 rounded inline-flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded mr-1"></div>
          <div className="w-4 h-3 bg-gray-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default TileSkeleton;
