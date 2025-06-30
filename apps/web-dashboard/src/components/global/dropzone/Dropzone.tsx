import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Icons } from "@/components/icons";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface Props {
  // File acceptance configuration
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number; // in bytes

  // UI customization
  title?: string;
  subtitle?: string;
  buttonText?: string;
  dragActiveText?: string;
  dragActiveSubtext?: string;


  onFilesSelected?: (files: File[]) => void;

  // Styling
  className?: string;
  disabled?: boolean;
}

const Dropzone = ({
  accept = { "video/*": [] },
  multiple = false,
  maxSize,
  title = "Drag & drop your files here",
  subtitle = "or click to browse and select a file",
  buttonText = "Choose File",
  dragActiveText = "Drop your files here",
  dragActiveSubtext = "Release to upload",
  onFilesSelected,
  className = "",
  disabled = false,
}: Props) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const isUploading = uploadStatus === "uploading";

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragActive,
    fileRejections,
  } = useDropzone({
    accept,
    multiple,
    maxSize,
    disabled: disabled || isUploading,
    onDrop: (files) => {
      if (onFilesSelected) {
        onFilesSelected(files);
      }
    },
  });


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  return (
    <div className={`px-4 pb-12 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            bg-black/40 backdrop-blur-sm shadow-lg
            ${
              isDragActive
                ? "border-blue-400 bg-blue-500/10"
                : disabled || isUploading
                  ? "border-gray-700 bg-gray-800/20 cursor-not-allowed opacity-50"
                  : "border-gray-600 hover:border-gray-500 hover:bg-black/60"
            }
          `}
        >
          <input {...getInputProps()} />

          {/* Upload Icon */}
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
            <Icons.Upload className="w-8 h-8 text-gray-300" />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-xl font-semibold text-blue-400 mb-2">
                {dragActiveText}
              </p>
              <p className="text-gray-400">{dragActiveSubtext}</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-white mb-2">{title}</p>
              <p className="text-gray-400 mb-4">{subtitle}</p>
              <div
                className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors duration-200 border ${
                  disabled || isUploading
                    ? "bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                }`}
              >
                <Icons.Plus className="w-5 h-5 mr-2" />
                {buttonText}
              </div>
            </div>
          )}
        </div>

        {/* File Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-4 p-4 bg-red-900/50 rounded-lg border border-red-600">
            <h4 className="text-red-400 font-medium mb-2">File Errors:</h4>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="text-sm text-red-300">
                <span className="font-medium">{file.name}:</span>
                {errors.map((error) => (
                  <div key={error.code} className="ml-2">
                    • {error.message}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* File List */}
        {acceptedFiles.length > 0 && (
          <div className="mt-6 p-6 bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Selected {multiple ? "Files" : "File"}:
            </h3>
            <ul className="space-y-3">
              {acceptedFiles.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                      {Icons.getFileTypeIcon(file.name, "w-5 h-5 text-gray-300")}
                    </div>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-400">
                    <Icons.Check className="w-5 h-5 text-green-400 mr-2" />
                  </div>
                </li>
              ))}
            </ul>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;
