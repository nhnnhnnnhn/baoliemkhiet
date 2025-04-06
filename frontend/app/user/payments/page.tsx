"use client"

import { useState } from "react"
import { Calendar, Check, CreditCard, Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import styles from "../../admin/admin.module.css"

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("subscription")
  const [showAddCardDialog, setShowAddCardDialog] = useState(false)

  // Mock subscription data
  const subscription = {
    plan: "Gói Premium",
    status: "Đang hoạt động",
    price: "99.000đ/tháng",
    startDate: "05/04/2025",
    nextBillingDate: "05/05/2025",
    features: [
      "Truy cập không giới hạn tất cả bài viết",
      "Không hiển thị quảng cáo",
      "Nội dung độc quyền",
      "Ưu tiên hỗ trợ khách hàng",
      "Tải xuống bài viết để đọc offline",
    ],
  }

  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "1234",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "5678",
      expiry: "09/25",
      isDefault: false,
    },
  ]

  // Mock billing history
  const billingHistory = [
    {
      id: "INV-001",
      date: "05/04/2025",
      amount: "99.000đ",
      status: "Đã thanh toán",
      description: "Gói Premium - Tháng 04/2025",
    },
    {
      id: "INV-002",
      date: "05/03/2025",
      amount: "99.000đ",
      status: "Đã thanh toán",
      description: "Gói Premium - Tháng 03/2025",
    },
    {
      id: "INV-003",
      date: "05/02/2025",
      amount: "99.000đ",
      status: "Đã thanh toán",
      description: "Gói Premium - Tháng 02/2025",
    },
  ]

  // Mock subscription plans
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Gói Cơ bản",
      price: "Miễn phí",
      description: "Truy cập giới hạn các bài viết",
      features: ["5 bài viết miễn phí mỗi tháng", "Nhận thông báo tin tức mới", "Bình luận bài viết"],
    },
    {
      id: "premium",
      name: "Gói Premium",
      price: "99.000đ/tháng",
      description: "Truy cập không giới hạn tất cả bài viết",
      features: [
        "Truy cập không giới hạn tất cả bài viết",
        "Không hiển thị quảng cáo",
        "Nội dung độc quyền",
        "Ưu tiên hỗ trợ khách hàng",
        "Tải xuống bài viết để đọc offline",
      ],
      current: true,
    },
    {
      id: "family",
      name: "Gói Gia đình",
      price: "199.000đ/tháng",
      description: "Chia sẻ với tối đa 5 thành viên gia đình",
      features: [
        "Tất cả tính năng của Gói Premium",
        "Chia sẻ với tối đa 5 thành viên gia đình",
        "Quản lý tài khoản gia đình",
        "Kiểm soát nội dung cho trẻ em",
      ],
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý thanh toán</h1>
        <div className={styles.pageBreadcrumb}>
          <div className={styles.breadcrumbItem}>Tài khoản</div>
          <div className={styles.breadcrumbDivider}>/</div>
          <div className={styles.breadcrumbItem}>Quản lý thanh toán</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscription" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription">Gói đăng ký</TabsTrigger>
          <TabsTrigger value="payment-methods">Phương thức thanh toán</TabsTrigger>
          <TabsTrigger value="billing-history">Lịch sử thanh toán</TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Subscription */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Gói đăng ký hiện tại</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-900">{subscription.plan}</h4>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      {subscription.status}
                    </span>
                    <span className="text-gray-600">{subscription.price}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Bắt đầu: {subscription.startDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Thanh toán tiếp theo: {subscription.nextBillingDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Tính năng bao gồm:</h5>
                  <ul className="space-y-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-2">
                  <Button className="w-full">Nâng cấp gói</Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    Hủy đăng ký
                  </Button>
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div className={`${styles.chartCard} md:col-span-2`}>
              <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Các gói đăng ký</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 ${plan.current ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        {plan.current && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Hiện tại
                          </span>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-lg font-bold text-gray-900">{plan.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <ul className="space-y-1 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={plan.current ? "outline" : "default"}
                        className="w-full text-sm"
                        disabled={plan.current}
                      >
                        {plan.current ? "Gói hiện tại" : "Chọn gói này"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="mt-6">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Phương thức thanh toán</h3>
              <Button size="sm" onClick={() => setShowAddCardDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm thẻ mới
              </Button>
            </div>
            <div className="p-6">
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {method.type === "Visa" ? (
                            <div className="h-10 w-16 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                              VISA
                            </div>
                          ) : (
                            <div className="h-10 w-16 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">
                              MC
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {method.type} **** {method.last4}
                            {method.isDefault && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">Hết hạn: {method.expiry}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">
                            Đặt làm mặc định
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có phương thức thanh toán</h3>
                  <p className="text-gray-500 mb-4">Thêm phương thức thanh toán để quản lý đăng ký của bạn</p>
                  <Button onClick={() => setShowAddCardDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm thẻ mới
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Add Card Dialog */}
          <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thẻ thanh toán mới</DialogTitle>
                <DialogDescription>Thêm thông tin thẻ của bạn để thanh toán đăng ký.</DialogDescription>
              </DialogHeader>

              <form className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Số thẻ</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                    <Input id="expiryDate" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">Mã bảo mật (CVC)</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardholderName">Tên chủ thẻ</Label>
                  <Input id="cardholderName" placeholder="NGUYEN VAN A" />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="setDefault" className="rounded border-gray-300" />
                  <Label htmlFor="setDefault" className="text-sm">
                    Đặt làm phương thức thanh toán mặc định
                  </Label>
                </div>
              </form>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setShowAddCardDialog(false)}>Lưu thẻ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="billing-history" className="mt-6">
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Lịch sử thanh toán</h3>
              <Button variant="outline" size="sm">
                Xuất hóa đơn
              </Button>
            </div>
            <div className={styles.tableContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>Mã hóa đơn</th>
                    <th className={styles.tableHeaderCell}>Ngày</th>
                    <th className={styles.tableHeaderCell}>Mô tả</th>
                    <th className={styles.tableHeaderCell}>Số tiền</th>
                    <th className={styles.tableHeaderCell}>Trạng thái</th>
                    <th className={styles.tableHeaderCell}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{invoice.id}</td>
                      <td className={styles.tableCell}>{invoice.date}</td>
                      <td className={styles.tableCell}>{invoice.description}</td>
                      <td className={styles.tableCell}>{invoice.amount}</td>
                      <td className={styles.tableCell}>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <Button variant="ghost" size="sm">
                          Xem hóa đơn
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

