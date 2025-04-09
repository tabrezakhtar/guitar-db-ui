function getCloudinaryThumbnail(url, width = 150) {
    const parts = url.split("/upload/");
    if (parts.length !== 2 || !url.includes("cloudinary.com")) {
        return "Invalid Cloudinary URL";
    }
    const transformation = `w_${width},c_thumb`;
    const thumbnailUrl = `${parts[0]}/upload/${transformation}/${parts[1]}`;
    
    return thumbnailUrl;
}

export { getCloudinaryThumbnail };