"use client"

import type React from "react"
import type { AxiosError } from "axios"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import {
  selectOtpSending,
  selectOtpVerifying,
  selectOtpError,
  selectOtpSent,
  selectOtpVerified
} from "@/src/thunks/auth/authSlice"

import { Button } from "@/components/ui/button"
import { handleSendOtp, handleVerifyOtp, handleRegister } from "@/src/thunks/auth/authThunk"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  
  // Get OTP states from Redux
  const otpSending = useAppSelector(selectOtpSending)
  const otpVerifying = useAppSelector(selectOtpVerifying)
  const otpError = useAppSelector(selectOtpError)
  const otpSent = useAppSelector(selectOtpSent)
  const otpVerified = useAppSelector(selectOtpVerified)
  const loading = otpSending || otpVerifying
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    agreeTerms: false,
    otp: "",
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

  const handleSendOtpClick = async () => {
    if (!formData.email) {
      setError("Email không được để trống.\nVui lòng nhập email của bạn để nhận mã OTP.")
      return
    }

    setError("")
    
    try {
      await dispatch(handleSendOtp({
        email: formData.email,
        action: "REGISTER"
      })).unwrap()
      
      setError("✓ Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã.")
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const axiosError = error as AxiosError<{message: string}>;
      const serverError = axiosError.response?.data?.message || axiosError.message || '';
      let displayError = 'Có lỗi xảy ra khi gửi mã OTP';

      if (serverError === "Email already exists") {
        displayError = "Email này đã được sử dụng để đăng ký tài khoản";
      } else if (serverError.includes("Invalid email")) {
        displayError = "Email không đúng định dạng";
      } else if (serverError.includes("Too many requests")) {
        displayError = "Bạn đã yêu cầu gửi mã OTP quá nhiều lần. Vui lòng đợi 5 phút và thử lại";
      } else if (serverError === "Failed to generate OTP") {
        displayError = "Không thể tạo mã OTP. Vui lòng thử lại sau";
      }

      setError(`⚠️ ${displayError}`);
    }
  }

  const handleVerifyOtpClick = async () => {
    if (!formData.otp) {
      setError("Mã OTP không được để trống.\nVui lòng nhập mã OTP đã được gửi đến email của bạn.")
      return
    }

    setError("")

    try {
      await dispatch(handleVerifyOtp({
        email: formData.email,
        code: formData.otp,
        action: "REGISTER"
      })).unwrap()
      
      setError("✓ Xác thực OTP thành công!")
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      const axiosError = error as AxiosError<{message: string}>;
      const serverError = axiosError.response?.data?.message || axiosError.message || '';
      let displayError = 'Có lỗi xảy ra khi xác thực OTP';

      if (serverError === "Invalid OTP") {
        displayError = "Mã OTP không chính xác. Vui lòng kiểm tra và nhập lại";
      } else if (serverError === "OTP expired") {
        displayError = "Mã OTP đã hết hạn. Vui lòng bấm 'Gửi mã' để nhận mã mới";
      } else if (serverError === "OTP already used") {
        displayError = "Mã OTP này đã được sử dụng. Vui lòng bấm 'Gửi mã' để nhận mã mới";
      } else if (serverError.includes("Too many attempts")) {
        displayError = "Bạn đã thử xác thực quá nhiều lần. Vui lòng đợi 5 phút và thử lại";
      }

      setError(`⚠️ ${displayError}`);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("❌ Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Mật khẩu xác nhận không khớp với mật khẩu đã nhập!")
      return
    }

    if (!formData.agreeTerms) {
      setError("❌ Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục!")
      return
    }

    if (!otpVerified) {
      setError("❌ Vui lòng xác thực mã OTP trước khi đăng ký! Nếu chưa nhận được mã, hãy bấm 'Gửi mã'.")
      return
    }

    if (!formData.fullName.trim()) {
      setError("❌ Vui lòng nhập họ và tên của bạn!")
      return
    }

    setError("")

    try {
      const registerPayload = {
        email: formData.email,
        password: formData.password,
        fullname: formData.fullName,
        role: formData.accountType === 'journalist' ? 'JOURNALIST' : 'USER',
        otp: formData.otp,
        action: 'REGISTER',
        bio: null,
        avatar: null
      };

      console.log('Sending registration request with:', registerPayload);

      const result = await dispatch(handleRegister(registerPayload)).unwrap();
      
      console.log('Registration successful:', result);
      setError('✓ Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      const axiosError = error as AxiosError<{message: string}>;
      console.error('Error during registration:', {
        error: axiosError,
        response: axiosError.response?.data,
        originalMessage: axiosError.message
      });
      
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Có lỗi xảy ra trong quá trình đăng ký';
      const serverError = axiosError.response?.data?.message || axiosError.message || '';
      let displayError = 'Có lỗi xảy ra trong quá trình đăng ký';

      if (serverError.includes("Email already exists")) {
        displayError = "Email này đã được sử dụng để đăng ký tài khoản";
      } else if (serverError.includes("Invalid password")) {
        displayError = "Mật khẩu không đáp ứng yêu cầu (cần có chữ hoa, chữ thường và số)";
      } else if (serverError.includes("Invalid role")) {
        displayError = "Loại tài khoản không hợp lệ";
      } else if (serverError.includes("Invalid OTP")) {
        displayError = "Mã OTP không hợp lệ";
      }

      setError(`⚠️ ${displayError}`);

      // Scroll to error message
      const errorElement = document.querySelector('.error-message');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <svg
              width="48"
              height="48"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-blue-600"
            >
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M22 12.5C22 10.567 20.433 9 18.5 9C16.567 9 15 10.567 15 12.5C15 14.433 16.567 16 18.5 16C20.433 16 22 14.433 22 12.5Z"
                fill="white"
              />
              <path
                d="M17 19.5C17 17.567 15.433 16 13.5 16C11.567 16 10 17.567 10 19.5C10 21.433 11.567 23 13.5 23C15.433 23 17 21.433 17 19.5Z"
                fill="white"
              />
            </svg>
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
          {error && (
            <div
              className={`p-3 text-sm rounded-md shadow-sm border error-message ${
                error.includes("thành công") || error.includes("✓")
                  ? "text-green-500 bg-green-50 border-green-200"
                  : "text-red-500 bg-red-50 border-red-200"
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold mb-1">
                  {error.includes("thành công") || error.includes("✓")
                    ? "✓ Thành công!"
                    : error.includes("⚠️")
                      ? "Lỗi!"
                      : "Thông báo:"}
                </p>
                <p className="text-sm whitespace-pre-wrap">{error.includes("⚠️") ? error.replace("⚠️ ", "") : error}</p>
                {error.includes("⚠️") && (
                  <p className="text-xs mt-1 text-gray-600 italic">
                    Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vẫn gặp vấn đề
                  </p>
                )}
              </div>
            </div>
          )}
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
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="otp">Mã OTP</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="pr-24"
                  placeholder="Nhập mã OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  {!otpSent ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleSendOtpClick}
                      disabled={loading || !formData.email}
                    >
                      {otpSending ? "Đang gửi..." : "Gửi mã"}
                    </Button>
                  ) : !otpVerified ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleVerifyOtpClick}
                      disabled={loading || !formData.otp}
                    >
                      {otpVerifying ? "Đang xác thực..." : "Xác thực"}
                    </Button>
                  ) : (
                    <div className="text-green-600 flex items-center pr-3">
                      ✓ Đã xác thực
                    </div>
                  )}
                </div>
              </div>
              {otpSent && !otpVerified && (
                <p className="mt-1 text-sm text-gray-600">
                  Mã OTP đã được gửi đến email của bạn.<br/>
                  Vui lòng kiểm tra hòm thư (kể cả thư rác) và nhập mã trong vòng 5 phút.<br/>
                  Nếu không nhận được, hãy thử kiểm tra email đã nhập chính xác chưa và thử lại.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="accountType">Loại tài khoản</Label>
              <Select value={formData.accountType} onValueChange={(value) => handleSelectChange("accountType", value)}>
                <SelectTrigger id="accountType" className="mt-1">
                  <SelectValue placeholder="Chọn loại tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Độc giả</SelectItem>
                  <SelectItem value="journalist">Tác giả</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-gray-500">
                Tài khoản tác giả sẽ được xét duyệt trước khi có thể đăng bài
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox id="agree-terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} required />
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
            <Button
              type="submit"
              className="w-full"
              disabled={otpSending || otpVerifying || !otpVerified}
            >
              {otpSending ? "Đang gửi OTP..." :
               otpVerifying ? "Đang xác thực OTP..." : "Đăng ký"}
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
            <Button variant="outline" className="w-full">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
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