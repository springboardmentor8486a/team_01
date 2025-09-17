"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User, Mail, MapPin, UserCog, Lock, ShieldCheck } from "lucide-react"

export function LoginForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-blue-500/90 backdrop-blur-sm border-blue-400/50 shadow-2xl">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Create your Account</h1>
          <p className="text-blue-100 text-sm leading-relaxed">Join our Community to help and keep our streets clean</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <User size={20} />
            </div>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <Mail size={20} />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Location Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <MapPin size={20} />
            </div>
            <Input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Role Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <UserCog size={20} />
            </div>
            <Input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <Lock size={20} />
            </div>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
              <ShieldCheck size={20} />
            </div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-12 bg-blue-600/60 border-blue-500/50 text-white placeholder:text-blue-200 focus:border-blue-300 focus:ring-blue-300/50"
            />
          </div>

          {/* Register Button */}
          <Button type="submit" className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 mt-6">
            Register
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-blue-100 text-sm">
            Already Have an account? <button className="text-white font-semibold hover:underline">Login</button>
          </p>
        </div>
      </div>
    </Card>
  )
}
