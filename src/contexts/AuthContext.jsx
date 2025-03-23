import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm kiểm tra xem localStorage có thông tin user không
  const checkUserInStorage = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Đã lấy thông tin user từ localStorage:", parsedUser);
        setUser(parsedUser);
      } else {
        console.log("Không tìm thấy thông tin user trong localStorage");
      }
    } catch (e) {
      console.error("Lỗi khi đọc thông tin user từ localStorage:", e);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Khi component mount, kiểm tra localStorage
  useEffect(() => {
    checkUserInStorage();
  }, []);

  // Hàm đăng nhập
  const login = (userData) => {
    try {
      // Đảm bảo userData có đủ thông tin cần thiết
      const userToSave = {
        ...userData,
        role: userData.role || "user",
        loginTime: new Date().toISOString()
      };
      
      // Lưu vào localStorage và state
      localStorage.setItem("user", JSON.stringify(userToSave));
      setUser(userToSave);
      console.log("Đăng nhập thành công:", userToSave);
      return true;
    } catch (e) {
      console.error("Lỗi khi đăng nhập:", e);
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    try {
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem("user");
      
      // Xóa các dữ liệu khác của người dùng nếu có
      // Ví dụ: localStorage.removeItem("userPreferences");
      
      // Cập nhật state để UI phản ánh trạng thái đăng xuất
      setUser(null);
      
      console.log("Đã đăng xuất thành công");
      return true;
    } catch (e) {
      console.error("Lỗi khi đăng xuất:", e);
      return false;
    }
  };

  // Kiểm tra có phải admin không
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin,
      loading,
      checkUserInStorage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
