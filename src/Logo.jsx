import React from "react";

function Logo({ size = "normal" }) {
    // Size variants
    const sizes = {
        normal: {
            container: "space-x-2 text-2xl",
            image: "h-8 w-8"
        },
        large: {
            container: "space-x-3 text-4xl",
            image: "h-12 w-12"
        },
        xlarge: {
            container: "space-x-4 text-6xl",
            image: "h-16 w-16"
        }
    };
    
    const sizeClass = sizes[size] || sizes.normal;
    
    return (
        <div className={`flex items-center justify-center ${sizeClass.container} font-bold`}>
            <img 
                src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1757542336/favicon-192x192_kkkkll.png" 
                alt="rifftales Logo" 
                className={sizeClass.image}
            />
            <span className="text-[var(--color-logo-text)] drop-shadow-[2px_2px_0px_var(--color-logo-shadow)] dark:drop-shadow-[2px_2px_0px_var(--color-logo-shadow-dark)]">rifftales</span>
        </div>
    );
}

export default Logo;