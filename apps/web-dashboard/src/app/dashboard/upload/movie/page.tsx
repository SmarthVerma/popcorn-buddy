"use client";

import { useAppSelector } from "@/redux/store";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

const UploadMoviePage = () => {
  const uploadUrl = useAppSelector(
    (state) => state.movieUploadUrlReducer.uploadUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      accept: {
        "video/*": [], // Accept only videos if you're uploading movies
      },
      multiple: false,
    });

  const handleUpload = async () => {
    if (!acceptedFiles.length || !uploadUrl) {
      alert("Please select a file and ensure upload URL is available");
      return;
    }

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      // Create FormData for S3 upload
      const formData = new FormData();
      formData.append("file", file);

      console.log("this is contentType ", file.type);
      // return;
      // Upload to S3 using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          setUploadStatus("success");
          console.log("Upload successful");
        } else {
          setUploadStatus("error");
          console.error("Upload failed:", xhr.statusText);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setUploadStatus("error");
        setIsUploading(false);
        console.error("Upload error");
      };

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setIsUploading(false);
    }
  };

  console.log("this is the url", uploadUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upload Movie
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Drag and drop your movie file or click to browse and select
            </p>
          </div>
        </div>

        {/* Upload Container */}
        <div className="px-4 pb-12">
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
                    : "border-gray-600 hover:border-gray-500 hover:bg-black/60"
                }
              `}
            >
              <input {...getInputProps()} />

              {/* Upload Icon */}
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-600">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              {isDragActive ? (
                <div>
                  <p className="text-xl font-semibold text-blue-400 mb-2">
                    Drop your movie file here
                  </p>
                  <p className="text-gray-400">Release to upload</p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Drag & drop your movie file here
                  </p>
                  <p className="text-gray-400 mb-4">
                    or click to browse and select a file
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 border border-gray-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Choose File
                  </div>
                </div>
              )}
            </div>

            {/* File List */}
            {acceptedFiles.length > 0 && (
              <div className="mt-6 p-6 bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Selected File:
                </h3>
                <ul className="space-y-3">
                  {acceptedFiles.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="text-green-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        Uploading...
                      </span>
                      <span className="text-gray-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Status */}
                {uploadStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-900/50 rounded-lg border border-green-600">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-green-400 font-medium">
                        Upload successful!
                      </span>
                    </div>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-900/50 rounded-lg border border-red-600">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-red-400 font-medium">
                        Upload failed. Please try again.
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !uploadUrl}
                    className={`
                      inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200
                      ${
                        isUploading || !uploadUrl
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      }
                    `}
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload to S3
                      </>
                    )}
                  </button>
                </div>

                {!uploadUrl && (
                  <div className="mt-4 p-4 bg-yellow-900/50 rounded-lg border border-yellow-600">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 17.333 3.924 19 5.464 19z"
                        />
                      </svg>
                      <span className="text-yellow-400 font-medium">
                        No S3 upload URL available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="px-4 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <svg
                    className="w-6 h-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Supported Formats
                </h3>
                <p className="text-gray-400 text-sm">
                  MP4, AVI, MOV, MKV and other video formats
                </p>
              </div>

              <div className="text-center p-6 bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <svg
                    className="w-6 h-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Secure Upload</h3>
                <p className="text-gray-400 text-sm">
                  Your files are encrypted and safely processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMoviePage;
