function resizeImage(file, maxWidth=1280) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const aspectRatio = img.height / img.width;
        canvas.width = maxWidth;
        canvas.height = maxWidth * aspectRatio;
        ctx.drawImage(img, 0, 0, maxWidth, maxWidth * aspectRatio);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

function getCloudinaryThumbnail(url, width = 150) {
  const parts = url.split("/upload/");
  if (parts.length !== 2 || !url.includes("cloudinary.com")) {
      return "Invalid Cloudinary URL";
  }

  const transformation = `w_${width},h_${width},c_fill,g_center,c_thumb`;
  const thumbnailUrl = `${parts[0]}/upload/${transformation}/${parts[1]}`;
  
  return thumbnailUrl;
}

function getCombinedUrl(file) {
  return Object.keys(file)
  .filter(key => key !== 'chosen')
  .map(key => file[key])
  .join('');
}

export { getCloudinaryThumbnail, resizeImage, getCombinedUrl };