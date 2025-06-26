"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin login:", formData);
    router.push("/dashboard/");
    // Handle admin login here
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Enhanced Visual Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Image with Low Opacity */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/assets/landing.png"
            alt="Admin Dashboard Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-cyan-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-red-400 rounded-2xl mb-8 shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-white text-5xl font-bold mb-4 leading-tight">
              Admin
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                Control Center
              </span>
            </h1>
            <p className="text-slate-300 text-xl max-w-md mx-auto leading-relaxed">
              Manage your platform with powerful tools and real-time insights
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12 max-w-md">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-1">Analytics</h3>
              <p className="text-slate-400 text-sm">Real-time data</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-1">Users</h3>
              <p className="text-slate-400 text-sm">Manage accounts</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
              <Settings className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-1">Settings</h3>
              <p className="text-slate-400 text-sm">System config</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-1">Security</h3>
              <p className="text-slate-400 text-sm">Access control</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime</div>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </div>
            <div className="w-px h-12 bg-slate-600"></div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">256-bit</div>
              <div className="text-slate-400 text-sm">Encryption</div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Right Side - Login Section */}
      <div className="flex-1 lg:flex-none lg:w-96 xl:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Admin Header */}
          <div className="text-center mb-12">
            <div>
              <Image
                src="/assets/logo.png"
                alt="Admin Logo"
                width={64}
                height={64}
                className="mx-auto mb-4 rounded-full shadow-lg"
              />
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-lg">
              Sign in to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="space-y-6">
              {/* Email field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-4 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-lg"
                  placeholder="Admin Email"
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-12 py-4 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-lg"
                  placeholder="Password"
                  required
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Login button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-red-600/80 to-rose-500/70 text-white rounded-lg py-4 text-lg font-semibold hover:from-red-700 hover:to-rose-700 hover:cursor-pointer focus:ring-2 focus:ring-red-500/50 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Access Dashboard
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Lock className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-slate-300 text-sm font-medium">
                  Secure Admin Access
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                This is a protected area. Only authorized administrators can
                access this dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
