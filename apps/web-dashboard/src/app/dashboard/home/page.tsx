// pages/dashboard/home.tsx (or app/dashboard/home/page.tsx for app router)
"use client";

import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { uploadService } from "@/services/uploadService";

const DashboardHome = () => {
  const uploads = useAppSelector((state) => state.uploadReducer.uploads);
  const activeUploads = useAppSelector(
    (state) => state.uploadReducer.activeUploads
  );
  const completedUploads = useAppSelector(
    (state) => state.uploadReducer.completedUploads
  );
  const failedUploads = useAppSelector(
    (state) => state.uploadReducer.failedUploads
  );

  const [refreshTime, setRefreshTime] = useState(Date.now());

  // Refresh every 2 seconds to show live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(Date.now());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "text-blue-400 bg-blue-900/30 border-blue-600";
      case "completed":
        return "text-green-400 bg-green-900/30 border-green-600";
      case "failed":
        return "text-red-400 bg-red-900/30 border-red-600";
      case "paused":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-600";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      case "completed":
        return (
          <svg
            className="w-4 h-4"
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
        );
      case "failed":
        return (
          <svg
            className="w-4 h-4"
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
        );
      case "paused":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const handlePauseUpload = (uploadId: string) => {
    uploadService.pauseUpload(uploadId);
  };

  const handleRetryUpload = (uploadId: string) => {
    const upload = uploads[uploadId];
    if (upload) {
      // Create a new File object and restart upload
      // Note: In a real implementation, you'd need to store the original file reference
      console.log("Retry functionality would restart upload for:", uploadId);
    }
  };

  const totalUploads = Object.keys(uploads).length;
  const activeCount = activeUploads.length;
  const completedCount = completedUploads.length;
  const failedCount = failedUploads.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Upload Dashboard
          </h1>
          <p className="text-gray-400">
            Monitor your movie uploads in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Uploads
                </p>
                <p className="text-2xl font-bold text-white">{totalUploads}</p>
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
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
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-white">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
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
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-white">{failedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
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
              </div>
            </div>
          </div>
        </div>

        {/* Upload List */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Upload History
              </h2>
              <div className="flex items-center text-gray-400 text-sm">
                <svg
                  className="w-4 h-4 mr-1 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Live updates
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-700/50">
            {totalUploads === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-500"
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
                <p className="text-gray-400 text-lg mb-2">No uploads yet</p>
                <p className="text-gray-500">
                  Upload your first movie to see it here
                </p>
              </div>
            ) : (
              Object.values(uploads)
                .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
                .map((upload) => (
                  <div key={upload.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-400"
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
                          <h3 className="text-white font-medium text-lg">
                            {upload.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{formatFileSize(upload.size)}</span>
                            <span>•</span>
                            <span>{upload.type}</span>
                            {upload.startTime && (
                              <>
                                <span>•</span>
                                <span>
                                  {formatDuration(
                                    upload.startTime,
                                    upload.completedTime
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(upload.status)}`}
                        >
                          {getStatusIcon(upload.status)}
                          <span className="capitalize">{upload.status}</span>
                        </div>

                        {upload.status === "uploading" && (
                          <button
                            onClick={() => handlePauseUpload(upload.id)}
                            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                            title="Pause upload"
                          >
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
                                d="M10 9v6m4-6v6"
                              />
                            </svg>
                          </button>
                        )}

                        {upload.status === "failed" && (
                          <button
                            onClick={() => handleRetryUpload(upload.id)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Retry upload"
                          >
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(upload.status === "uploading" ||
                      upload.status === "paused") && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{upload.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              upload.status === "uploading"
                                ? "bg-blue-600"
                                : "bg-yellow-600"
                            }`}
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {upload.status === "failed" && upload.error && (
                      <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-400 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-red-400 text-sm">
                            {upload.error}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {upload.status === "completed" && (
                      <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
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
                          <span className="text-green-400 text-sm">
                            Upload completed successfully
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <a
            href="/upload-movie"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
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
            Upload New Movie
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
