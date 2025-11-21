import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropZone({ currentEquipment, setCurrentEquipment, setFilesToUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const currentImageCount = currentEquipment?.images?.length || 0;
    const maxImages = 8;
    const remainingSlots = maxImages - currentImageCount;
    
    if (remainingSlots <= 0) {
      alert(`Maximum of ${maxImages} images allowed.`);
      return;
    }
    
    // Only take as many files as we have remaining slots
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    
    if (acceptedFiles.length > remainingSlots) {
      alert(`Only ${remainingSlots} more image(s) can be added. Maximum of ${maxImages} images allowed.`);
    }

    const newFiles = filesToAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setCurrentEquipment({
      ...currentEquipment,
      images: [...(currentEquipment?.images || []), ...newFiles.map((f) => f.url)]
    });

    setFilesToUpload((prevFiles) => [...(prevFiles || []), ...newFiles]);
  }, [currentEquipment, setCurrentEquipment, setFilesToUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/tiff": [".tiff"],
      "image/bmp": [".bmp"],
      "image/webp": [".webp"]
    }
  });

  const currentImageCount = currentEquipment?.images?.length || 0;
  const maxImages = 8;
  const isAtLimit = currentImageCount >= maxImages;

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-32 p-4 mb-2 border-2 border-dashed rounded-lg focus:outline-none ${
          isAtLimit 
            ? "border-gray-300 cursor-not-allowed opacity-50" 
            : "border-gray-300 cursor-pointer hover:border-blue-500"
        }`}
      >
        <input {...getInputProps()} disabled={isAtLimit} />
        {
          isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p className={isAtLimit ? "text-gray-400" : "text-gray-500"}>
              {isAtLimit 
                ? "Maximum images reached (8/8)" 
                : "Drag 'n' drop some files here, or click to select files"
              }
            </p>
          )
        }
      </div>
      <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        📷 Maximum 8 images ({currentImageCount}/{maxImages})
      </div>
    </div>
  );
}
