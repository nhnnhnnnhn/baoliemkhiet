"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { register, error, resetError } = useAuth()
  const { toast } = useToast()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "USER",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    resetError()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu xác nhận không khớp!",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Lỗi đăng ký",
        description: "Bạn cần đồng ý với điều khoản dịch vụ!",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        role: formData.accountType,
      })
      
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục.",
        variant: "default",
      })
      
      // Redirect to login page
      router.push("/auth/login")
    } catch (err) {
      toast({
        title: "Đăng ký thất bại",
        description: error || "Vui lòng kiểm tra lại thông tin đăng ký",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img src="/logo.svg" alt="Báo Liêm Khiết" className="mx-auto h-12 w-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="pl-10"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accountType">Loại tài khoản</Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => handleSelectChange("accountType", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="accountType" className="mt-1">
                  <SelectValue placeholder="Chọn loại tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Độc giả</SelectItem>
                  <SelectItem value="JOURNALIST">Nhà báo</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Tài khoản nhà báo sẽ được xét duyệt trước khi có thể đăng bài
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox 
              id="agree-terms" 
              checked={formData.agreeTerms} 
              onCheckedChange={handleCheckboxChange} 
              required
              disabled={isLoading}
            />
            <Label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              Tôi đồng ý với{" "}
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Chính sách bảo mật
              </Link>
            </Label>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

