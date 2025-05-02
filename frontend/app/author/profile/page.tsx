"use client"

import { useEffect } from "react"
import { Calendar, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleGetProfile, handleUpdateProfile } from "@/src/thunks/auth/authThunk"
import { selectCurrentUser } from "@/src/thunks/auth/authSlice"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function AuthorProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  });

  useEffect(() => {
    dispatch(handleGetProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(handleUpdateProfile(formData)).unwrap();
      console.log('Update result:', result);
      const profileResult = await dispatch(handleGetProfile()).unwrap();
      console.log('Profile result:', profileResult);
      toast({
        description: "Cập nhật thông tin thành công",
        duration: 2000, // Tự động ẩn sau 2 giây
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <Card className="flex-1">
          <CardHeader className="relative pb-0">
            <div className="h-32 w-full bg-gradient-to-r from-red-500 to-red-700 rounded-t-lg"></div>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={user.avatar || "/placeholder.svg"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-16 text-center">
            <CardTitle>{user.fullname}</CardTitle>
            <CardDescription>{user.role === 'JOURNALIST' ? 'Nhà báo' : user.role}</CardDescription>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Tham gia từ: {joinedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <div className="flex-[2]">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input
                    id="fullname"
                    value={formData.fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    type="email"
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">Lưu thay đổi</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
