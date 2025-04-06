import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropZone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center w-full h-32 p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none"
    >
      <input {...getInputProps()} />
      {
        isDragActive ? (
          <p className="text-blue-500">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
        )
      }
    </div>
  )
}
