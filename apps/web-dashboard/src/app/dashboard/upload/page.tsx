import UploadMovieForm from "@/components/forms/upload-movie-form";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Background Pattern */}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Movie Management
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Easily upload and organize your movie collection with our
              intuitive platform
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-4 pb-12">
          <UploadMovieForm />
        </div>

        {/* Features Section */}
        <div className="px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Easy Upload</h3>
                <p className="text-gray-400 text-sm">
                  Upload your movie thumbnails and details with our simple form
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Organize</h3>
                <p className="text-gray-400 text-sm">
                  Categorize by genre and platform for easy browsing
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Secure</h3>
                <p className="text-gray-400 text-sm">
                  Your movie collection is stored safely and securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
