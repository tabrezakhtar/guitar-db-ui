function Logo({ size = "normal" }) {
    // Size variants
    const sizes = {
        normal: {
            container: "space-x-2 text-xl md:text-2xl",
            image: "h-6 w-6 md:h-8 md:w-8",
            brush: "h-12 md:h-14"
        },
        large: {
            container: "space-x-2 md:space-x-3 text-2xl md:text-4xl",
            image: "h-8 w-8 md:h-12 md:w-12",
            brush: "h-17 md:h-19"
        },
        xlarge: {
            container: "space-x-3 md:space-x-4 text-4xl md:text-6xl",
            image: "h-12 w-12 md:h-16 md:w-16",
            brush: "h-24 md:h-28"
        }
    };
    
    const sizeClass = sizes[size] || sizes.normal;
    
    return (
        <div className={`inline-flex items-center ${sizeClass.container} font-bold relative isolate`}>
            <img 
                src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1773139629/brush_cropped_ephma6.svg"
                alt=""
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass.brush} object-contain opacity-80 text-yellow-400`}
                style={{ fill: "currentColor", zIndex: -1, transform: "translate(-0%, 5%) scale(1.5)" }}
                aria-hidden="true"
            />
            <img 
                src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1757542336/favicon-192x192_kkkkll.png" 
                alt="rifftales Logo" 
                className={`${sizeClass.image} relative z-10`}
            />
            <span className="text-[var(--color-logo-text)] drop-shadow-[2px_2px_0px_var(--color-logo-shadow)] dark:drop-shadow-[2px_2px_0px_var(--color-logo-shadow-dark)] relative z-10">rifftales</span>
        </div>
    );
}

export default Logo;