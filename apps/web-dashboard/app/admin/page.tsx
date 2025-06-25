"use client";

import React, { useState } from "react";
import {
  Upload,
  Film,
  AlertCircle,
  CheckCircle,
  X,
  Link,
  Download,
} from "lucide-react";

const AdminUI = () => {
  // State management
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadMethod, setUploadMethod] = useState("file");
  const [externalLink, setExternalLink] = useState("");
  const [movieMetadata, setMovieMetadata] = useState({
    name: "",
    genre: "",
    platforms: [],
    thumbnail: null,
  });

  // Constants
  const streamingPlatforms = ["Netflix", "Amazon Prime", "Hotstar", "Other"];
  const genres = [
    "action",
    "adventure",
    "comedy",
    "drama",
    "horror",
    "romance",
    "sci-fi",
    "thriller",
    "fantasy",
  ];
  const supportedFormats = [".mp4", ".avi", ".mov", ".mkv", ".webm"];

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (uploadMethod !== "file") return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const videoFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith("video/") ||
        supportedFormats.some((ext) => file.name.toLowerCase().endsWith(ext))
    );

    if (videoFiles.length > 0) {
      setFiles((prev) => [...prev, ...videoFiles]);
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Metadata handlers
  const handleMetadataChange = (field, value) => {
    setMovieMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlatformToggle = (platform) => {
    setMovieMetadata((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setMovieMetadata((prev) => ({
        ...prev,
        thumbnail: file,
      }));
    }
  };

  // Upload functionality
  const uploadToS3 = async () => {
    const formData = new FormData();

    // Add metadata
    formData.append("metadata", JSON.stringify(movieMetadata));
    if (movieMetadata.thumbnail) {
      formData.append("thumbnail", movieMetadata.thumbnail);
    }

    // Add upload method specific data
    formData.append("uploadMethod", uploadMethod);

    if (uploadMethod === "file" && files.length > 0) {
      files.forEach((file) => {
        formData.append("movies", file);
      });
    } else if (uploadMethod === "link" || uploadMethod === "torrent") {
      formData.append("externalLink", externalLink);
    }

    try {
      const fileName =
        uploadMethod === "file"
          ? files[0]?.name
          : `${movieMetadata.name}_external`;

      setUploadProgress((prev) => ({ ...prev, [fileName]: 0 }));

      const response = await fetch("/api/admin/upload-movie", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      // Simulate progress for demo
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileName]: i }));
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setUploadProgress((prev) => ({ ...prev, [fileName]: "completed" }));
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      const fileName =
        uploadMethod === "file"
          ? files[0]?.name
          : `${movieMetadata.name}_external`;
      setUploadProgress((prev) => ({ ...prev, [fileName]: "error" }));
      throw error;
    }
  };

  const handleUpload = async () => {
    // Validation
    if (!movieMetadata.name.trim()) {
      alert("Please enter movie name");
      return;
    }

    if (uploadMethod === "file" && files.length === 0) {
      alert("Please select files to upload");
      return;
    }

    if (
      (uploadMethod === "link" || uploadMethod === "torrent") &&
      !externalLink.trim()
    ) {
      alert("Please enter a valid link");
      return;
    }

    try {
      await uploadToS3();

      // Reset form after successful upload
      setFiles([]);
      setExternalLink("");
      setMovieMetadata({
        name: "",
        genre: "",
        platforms: [],
        thumbnail: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isValidTorrentLink = (url) => {
    return (
      url.startsWith("magnet:") ||
      url.endsWith(".torrent") ||
      url.includes("torrent")
    );
  };

  const isValidDirectLink = (url) => {
    try {
      new URL(url);
      return supportedFormats.some((ext) => url.toLowerCase().includes(ext));
    } catch {
      return false;
    }
  };

  const isFormValid = () => {
    if (!movieMetadata.name.trim()) return false;

    if (uploadMethod === "file") {
      return files.length > 0;
    }

    if (uploadMethod === "link" || uploadMethod === "torrent") {
      return externalLink.trim() !== "";
    }

    return false;
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Film className="text-blue-600" />
            Upload Movies
          </h1>
        </header>
        {/* Movie Metadata Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Movie Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie Name
            </label>
            <input
              type="text"
              value={movieMetadata.name}
              onChange={(e) => handleMetadataChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter movie name"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={movieMetadata.genre}
              onChange={(e) => handleMetadataChange("genre", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  text-black placeholder:text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Select genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Streaming Platforms */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available on Platforms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {streamingPlatforms.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={movieMetadata.platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="w-full px-3 py-2 border border-gray-300   text-black placeholder:text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            {movieMetadata.thumbnail && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {movieMetadata.thumbnail.name}
              </p>
            )}
          </div>
        </section>

        {/* Upload Method Selection */}
        <section className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Method
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "file", icon: Upload, label: "Upload Files" },
              { value: "link", icon: Link, label: "Direct Link" },
              { value: "torrent", icon: Download, label: "Torrent/Magnet" },
            ].map(({ value, icon: Icon, label }) => (
              <label
                key={value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="uploadMethod"
                  value={value}
                  checked={uploadMethod === value}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Upload Area - File Upload */}
        {uploadMethod === "file" && (
          <section className="mb-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-700 mb-2">
                Drop movie files here
              </p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <input
                type="file"
                multiple
                accept="video/*,.mp4,.avi,.mov,.mkv,.webm"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm text-gray-400">
                Supported formats: {supportedFormats.join(", ").toUpperCase()}
              </p>
            </div>
          </section>
        )}

        {/* Upload Area - External Links */}
        {(uploadMethod === "link" || uploadMethod === "torrent") && (
          <section className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {uploadMethod === "torrent"
                  ? "Torrent/Magnet Link"
                  : "Direct Download Link"}
              </label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder={
                  uploadMethod === "torrent"
                    ? "magnet:?xt=urn:btih:... or https://example.com/movie.torrent"
                    : "https://example.com/movie.mp4"
                }
              />

              {/* Link Validation */}
              {externalLink && (
                <div className="mt-2">
                  {uploadMethod === "torrent" ? (
                    <p
                      className={`text-sm flex items-center gap-1 ${
                        isValidTorrentLink(externalLink)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isValidTorrentLink(externalLink) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {isValidTorrentLink(externalLink)
                        ? "Valid torrent/magnet link"
                        : "Invalid torrent/magnet link"}
                    </p>
                  ) : (
                    <p
                      className={`text-sm flex items-center gap-1 ${
                        isValidDirectLink(externalLink)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isValidDirectLink(externalLink) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {isValidDirectLink(externalLink)
                        ? "Valid direct link"
                        : "Invalid direct link"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {uploadMethod === "torrent"
                      ? "Torrent Download"
                      : "Direct Link Download"}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {uploadMethod === "torrent"
                      ? "The system will download the movie from the torrent/magnet link and process it."
                      : "The system will download the movie from the direct link and process it."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Selected Files List */}
        {uploadMethod === "file" && files.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Film className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Upload Progress */}
                    {uploadProgress[file.name] !== undefined && (
                      <div className="flex items-center space-x-2">
                        {uploadProgress[file.name] === "completed" ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">
                              Complete
                            </span>
                          </div>
                        ) : uploadProgress[file.name] === "error" ? (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Error</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${uploadProgress[file.name]}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 min-w-[3rem]">
                              {uploadProgress[file.name]}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Selected Platforms Display */}
        {movieMetadata.platforms.length > 0 && (
          <section className="mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Available on:
              </h4>
              <div className="flex flex-wrap gap-2">
                {movieMetadata.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Upload Button */}
        <footer className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!isFormValid()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 font-medium transition-colors shadow-sm hover:shadow-md"
          >
            {uploadMethod === "file" ? (
              <Upload className="h-5 w-5" />
            ) : uploadMethod === "link" ? (
              <Link className="h-5 w-5" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>
              {uploadMethod === "file"
                ? "Upload Movie"
                : uploadMethod === "link"
                  ? "Process Link"
                  : "Process Torrent"}
            </span>
          </button>
        </footer>

      </div>
    </div>
  );
};

export default AdminUI;
