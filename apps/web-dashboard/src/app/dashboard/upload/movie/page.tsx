"use client";
import { useAppSelector } from "@/redux/store";

const UploadMoviePage = () => {
  const uploadUrl = useAppSelector(
    (state) => state.movieUploadUrlReducer.uploadUrl
  );

  console.log("this is the url", uploadUrl);
  return (
    <div className="flex flex-col bg-glow items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Movie</h1>
      <p className="text-lg mb-2">Upload URL: {uploadUrl}</p>
      <p className="text-gray-500">This is the upload page for movies.</p>
    </div>
  );
};

export default UploadMoviePage;
