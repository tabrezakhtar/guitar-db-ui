const SkeletonImage = () => (
  <div 
    className="w-full aspect-square sm:h-full sm:aspect-auto bg-gray-300 flex items-end justify-center bg-cover bg-center pb-2"
    style={{
      backgroundImage: 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/e_grayscale/v1759859487/icon-huge_a5nmje.jpg)'
    }}
  >
    <span className="text-gray-500 bg-white/80 px-2 py-1 rounded">No Image</span>
  </div>
);

export default SkeletonImage;