const ProfileSkeleton = () => {
  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="h-8 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-48"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-24"></div>
          <div className="h-10 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-16"></div>
        </div>
      </div>
      <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
          <div className="w-24 h-24 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded-full animate-pulse mb-4 sm:mb-0 sm:mr-6"></div>
          <div className="text-center sm:text-left">
            <div className="h-6 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-32 mb-2"></div>
            <div className="h-4 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-5 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-16 mb-2"></div>
          <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-full mb-1"></div>
          <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-3/4"></div>
        </div>
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-5 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-20 mb-2"></div>
          <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-32"></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-32"></div>
          <div className="h-10 bg-[var(--color-skeleton-bg)] dark:bg-[var(--color-skeleton-bg-dark)] rounded animate-pulse w-32"></div>
        </div>
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-5 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-24 mb-2"></div>
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse"></div>
            <div className="w-32 h-32 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse"></div>
            <div className="w-32 h-32 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-5 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-40 mb-2"></div>
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse"></div>
            <div className="w-32 h-32 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-5 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-36 mb-2"></div>
          <div className="space-y-4">
            <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-3 rounded-md">
              <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-full mb-2"></div>
              <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-3/4"></div>
            </div>
            <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-3 rounded-md">
              <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-full mb-2"></div>
              <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <div className="h-4 bg-[var(--color-skeleton-line)] dark:bg-[var(--color-skeleton-line-dark)] rounded animate-pulse w-48"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;