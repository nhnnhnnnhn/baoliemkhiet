"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, CreditCard, Lock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") || "digital"

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit-card",
    plan: planParam,
  })

  const plans = {
    digital: {
      name: "Digital",
      price: "25.000đ/tuần",
      description: "Truy cập đầy đủ trên web và ứng dụng",
    },
    "digital-print": {
      name: "Digital + Print",
      price: "45.000đ/tuần",
      description: "Trải nghiệm đọc báo toàn diện",
    },
    premium: {
      name: "Premium",
      price: "65.000đ/tuần",
      description: "Trải nghiệm cao cấp nhất",
    },
  }

  const selectedPlan = plans[formData.plan as keyof typeof plans]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      nextStep()
    } else {
      // Submit the form
      console.log("Form submitted:", formData)
      // Redirect to success page or show success message
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            <img src="/logo.svg" alt="Báo Liêm Khiết" className="h-10" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/subscribe" className="text-sm text-gray-600 hover:text-gray-900">
              Quay lại
            </Link>
          </div>
        </div>
      </header>

      {/* Checkout Process */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>

              <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-700" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                >
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Tài khoản</span>
              </div>

              <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-700" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Thanh toán</span>
              </div>

              <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-700" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                >
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Xác nhận</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Account */}
                    {step === 1 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Tạo tài khoản hoặc đăng nhập</h2>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="email@example.com"
                            />
                          </div>

                          <div>
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              placeholder="••••••••"
                            />
                          </div>

                          <div>
                            <Label htmlFor="name">Họ và tên</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Nguyễn Văn A"
                            />
                          </div>

                          <div className="pt-4">
                            <p className="text-sm text-gray-500 mb-4">
                              Bằng việc tiếp tục, bạn đồng ý với{" "}
                              <Link href="#" className="text-blue-700 hover:underline">
                                Điều khoản sử dụng
                              </Link>{" "}
                              và{" "}
                              <Link href="#" className="text-blue-700 hover:underline">
                                Chính sách bảo mật
                              </Link>{" "}
                              của chúng tôi.
                            </p>

                            <Button type="submit" className="w-full">
                              Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-center pt-4">
                            <p className="text-sm text-gray-500">
                              Đã có tài khoản?{" "}
                              <Link href="/auth/login" className="text-blue-700 hover:underline">
                                Đăng nhập
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Thông tin thanh toán</h2>

                        <div className="space-y-4">
                          <div>
                            <Label>Phương thức thanh toán</Label>
                            <RadioGroup
                              value={formData.paymentMethod}
                              onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                              className="mt-2"
                            >
                              <div className="flex items-center space-x-2 border p-3 rounded-md">
                                <RadioGroupItem value="credit-card" id="credit-card" />
                                <Label htmlFor="credit-card" className="flex items-center">
                                  <CreditCard className="h-5 w-5 mr-2" />
                                  Thẻ tín dụng / Thẻ ghi nợ
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border p-3 rounded-md mt-2">
                                <RadioGroupItem value="banking" id="banking" />
                                <Label htmlFor="banking">Internet Banking</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {formData.paymentMethod === "credit-card" && (
                            <>
                              <div>
                                <Label htmlFor="cardNumber">Số thẻ</Label>
                                <Input
                                  id="cardNumber"
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleChange}
                                  required
                                  placeholder="1234 5678 9012 3456"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                                  <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required
                                    placeholder="MM/YY"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                    placeholder="123"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div>
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              placeholder="123 Đường ABC"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">Thành phố</Label>
                              <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="Hà Nội"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">Mã bưu điện</Label>
                              <Input
                                id="zipCode"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                placeholder="100000"
                              />
                            </div>
                          </div>

                          <div className="pt-4 flex justify-between">
                            <Button type="button" variant="outline" onClick={prevStep}>
                              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                            </Button>
                            <Button type="submit">
                              Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h2>

                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2">Thông tin tài khoản</h3>
                            <p>
                              <span className="text-gray-500">Email:</span> {formData.email}
                            </p>
                            <p>
                              <span className="text-gray-500">Họ tên:</span> {formData.name}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2">Thông tin thanh toán</h3>
                            <p>
                              <span className="text-gray-500">Phương thức:</span>{" "}
                              {formData.paymentMethod === "credit-card"
                                ? "Thẻ tín dụng / Thẻ ghi nợ"
                                : "Internet Banking"}
                            </p>
                            {formData.paymentMethod === "credit-card" && (
                              <p>
                                <span className="text-gray-500">Số thẻ:</span> **** **** ****{" "}
                                {formData.cardNumber.slice(-4)}
                              </p>
                            )}
                            <p>
                              <span className="text-gray-500">Địa chỉ:</span> {formData.address}, {formData.city},{" "}
                              {formData.zipCode}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2">Gói đăng ký</h3>
                            <p>
                              <span className="text-gray-500">Gói:</span> {selectedPlan.name}
                            </p>
                            <p>
                              <span className="text-gray-500">Giá:</span> {selectedPlan.price}
                            </p>
                            <p>
                              <span className="text-gray-500">Mô tả:</span> {selectedPlan.description}
                            </p>
                          </div>

                          <div className="pt-4 flex justify-between">
                            <Button type="button" variant="outline" onClick={prevStep}>
                              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                              Xác nhận và thanh toán
                            </Button>
                          </div>

                          <div className="text-center pt-4">
                            <p className="text-sm text-gray-500 flex items-center justify-center">
                              <Lock className="h-4 w-4 mr-1" /> Thanh toán an toàn và bảo mật
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Gói đăng ký</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Giá</span>
                      <span className="font-medium">{selectedPlan.price}</span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng</span>
                        <span>{selectedPlan.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Thanh toán hàng tháng</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md text-sm">
                      <p className="text-blue-700">
                        Bạn có thể hủy đăng ký bất cứ lúc nào. Chúng tôi sẽ gửi email nhắc nhở trước khi kết thúc thời
                        gian dùng thử.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

