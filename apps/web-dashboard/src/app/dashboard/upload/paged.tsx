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

const Dashboard = () => {
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
          Authorization: `Bearer ADMIN_TOKEN_HERE`,
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
    <div className="min-h-screen bg-slate-900  space-y-8">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Film className="text-red-400" />
            Upload Movies
          </h1>
          <p className="text-slate-400 mt-2">Add new movies to your platform</p>
        </header>

        {/* Movie Metadata Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Movie Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Movie Name
            </label>
            <input
              type="text"
              value={movieMetadata.name}
              onChange={(e) => handleMetadataChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
              placeholder="Enter movie name"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Genre
            </label>
            <select
              value={movieMetadata.genre}
              onChange={(e) => handleMetadataChange("genre", e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            >
              <option value="" className="bg-slate-700">
                Select genre
              </option>
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-slate-700">
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Streaming Platforms */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Available on Platforms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {streamingPlatforms.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/50 p-3 rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={movieMetadata.platforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="rounded border-slate-600 text-red-500 bg-slate-700 focus:ring-red-500/50"
                  />
                  <span className="text-sm text-slate-300">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-500/80 file:text-white hover:file:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            />
            {movieMetadata.thumbnail && (
              <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {movieMetadata.thumbnail.name}
              </p>
            )}
          </div>
        </section>

        {/* Upload Method Selection */}
        <section className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-4">
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
                className="flex items-center space-x-3 cursor-pointer hover:bg-slate-700/50 p-4 rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
              >
                <input
                  type="radio"
                  name="uploadMethod"
                  value={value}
                  checked={uploadMethod === value}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="text-red-500 bg-slate-700 border-slate-600 focus:ring-red-500/50"
                />
                <Icon className="h-5 w-5 text-slate-400" />
                <span className="text-slate-300 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Upload Area - File Upload */}
        {uploadMethod === "file" && (
          <section className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-red-500 bg-red-500/10"
                  : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-16 w-16 text-slate-400 mb-6" />
              <p className="text-xl font-medium text-white mb-2">
                Drop movie files here
              </p>
              <p className="text-slate-400 mb-6">or click to browse files</p>
              <input
                type="file"
                multiple
                accept="video/*,.mp4,.avi,.mov,.mkv,.webm"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm text-slate-500">
                Supported formats: {supportedFormats.join(", ").toUpperCase()}
              </p>
            </div>
          </section>
        )}

        {/* Upload Area - External Links */}
        {(uploadMethod === "link" || uploadMethod === "torrent") && (
          <section className="mb-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {uploadMethod === "torrent"
                  ? "Torrent/Magnet Link"
                  : "Direct Download Link"}
              </label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                placeholder={
                  uploadMethod === "torrent"
                    ? "magnet:?xt=urn:btih:... or https://example.com/movie.torrent"
                    : "https://example.com/movie.mp4"
                }
              />

              {/* Link Validation */}
              {externalLink && (
                <div className="mt-3">
                  {uploadMethod === "torrent" ? (
                    <p
                      className={`text-sm flex items-center gap-2 ${
                        isValidTorrentLink(externalLink)
                          ? "text-green-400"
                          : "text-red-400"
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
                      className={`text-sm flex items-center gap-2 ${
                        isValidDirectLink(externalLink)
                          ? "text-green-400"
                          : "text-red-400"
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
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    {uploadMethod === "torrent"
                      ? "Torrent Download"
                      : "Direct Link Download"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
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
          <section className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Film className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {/* Upload Progress */}
                    {uploadProgress[file.name] !== undefined && (
                      <div className="flex items-center space-x-2">
                        {uploadProgress[file.name] === "completed" ? (
                          <div className="flex items-center space-x-1 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">
                              Complete
                            </span>
                          </div>
                        ) : uploadProgress[file.name] === "error" ? (
                          <div className="flex items-center space-x-1 text-red-400">
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Error</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${uploadProgress[file.name]}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-slate-400 min-w-[3rem]">
                              {uploadProgress[file.name]}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
          <section className="mb-8">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                Available on:
              </h4>
              <div className="flex flex-wrap gap-2">
                {movieMetadata.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-red-500/80 text-white text-sm rounded-full font-medium"
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
            className="px-8 py-4 bg-gradient-to-r from-red-600/80 to-rose-500/70 text-white rounded-lg hover:from-red-700 hover:to-rose-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed flex items-center space-x-3 font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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

export default Dashboard;
