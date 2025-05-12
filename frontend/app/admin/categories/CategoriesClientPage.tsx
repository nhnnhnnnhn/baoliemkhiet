"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, RefreshCw, Save, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import {
  handleCreateCategory,
  handleDeleteCategory as deleteCategory,
  handleGetCategories,
  handleUpdateCategory
} from "@/src/thunks/category/categoryThunk"
import {
  selectCategories,
  selectTotalCategories,
  selectError,
  selectIsLoading,
  selectCreateCategoryError,
  selectCreateCategorySuccess,
  selectUpdateCategoryError,
  selectUpdateCategorySuccess,
  selectDeleteCategoryError,
  selectDeleteCategorySuccess,
  selectIsCreatingCategory,
  selectIsUpdatingCategory,
  selectIsDeletingCategory,
  clearCreateCategoryState,
  clearUpdateCategoryState,
  clearDeleteCategoryState,
  clearCategoryError
} from "@/src/thunks/category/categorySlice"
import { toast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Category as CategoryType } from "@/src/apis/category"

export default function CategoriesClientPage() {
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const categories = useAppSelector(selectCategories)
  const totalCategories = useAppSelector(selectTotalCategories)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const isCreatingCategory = useAppSelector(selectIsCreatingCategory)
  const createCategoryError = useAppSelector(selectCreateCategoryError)
  const createCategorySuccess = useAppSelector(selectCreateCategorySuccess)
  const isUpdatingCategory = useAppSelector(selectIsUpdatingCategory)
  const updateCategoryError = useAppSelector(selectUpdateCategoryError)
  const updateCategorySuccess = useAppSelector(selectUpdateCategorySuccess)
  const isDeletingCategory = useAppSelector(selectIsDeletingCategory)
  const deleteCategoryError = useAppSelector(selectDeleteCategoryError)
  const deleteCategorySuccess = useAppSelector(selectDeleteCategorySuccess)

  // Local state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [editedCategory, setEditedCategory] = useState({ name: "", slug: "", description: "" })
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(handleGetCategories({}))
  }, [dispatch])

  // Handle refresh categories
  const handleRefresh = () => {
    dispatch(handleGetCategories({}))
  }

  // Handle create category success/error
  useEffect(() => {
    if (createCategorySuccess) {
      toast({
        title: "Thành công",
        description: "Danh mục mới đã được tạo thành công.",
      })
      setIsAddModalOpen(false)
      setNewCategory({ name: "", slug: "", description: "" })
      dispatch(clearCreateCategoryState())
    } else if (createCategoryError) {
      toast({
        title: "Lỗi",
        description: createCategoryError,
        variant: "destructive",
      })
      dispatch(clearCreateCategoryState())
    }
  }, [createCategorySuccess, createCategoryError, dispatch])

  // Handle update category success/error
  useEffect(() => {
    if (updateCategorySuccess) {
      toast({
        title: "Thành công",
        description: "Danh mục đã được cập nhật thành công.",
      })
      setIsEditModalOpen(false)
      setSelectedCategory(null)
      setEditedCategory({ name: "", slug: "", description: "" })
      dispatch(clearUpdateCategoryState())
    } else if (updateCategoryError) {
      toast({
        title: "Lỗi",
        description: updateCategoryError,
        variant: "destructive",
      })
      dispatch(clearUpdateCategoryState())
    }
  }, [updateCategorySuccess, updateCategoryError, dispatch])

  // Handle delete category success/error
  useEffect(() => {
    if (deleteCategorySuccess) {
      toast({
        title: "Thành công",
        description: "Danh mục đã được xóa thành công.",
      })
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
      dispatch(clearDeleteCategoryState())
    } else if (deleteCategoryError) {
      toast({
        title: "Lỗi",
        description: deleteCategoryError,
        variant: "destructive",
      })
      dispatch(clearDeleteCategoryState())
    }
  }, [deleteCategorySuccess, deleteCategoryError, dispatch])

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive",
      })
      dispatch(clearCategoryError())
    }
  }, [error, dispatch])

  const handleAddCategory = () => {
    setIsAddModalOpen(true)
  }

  const handleEditCategory = (category: CategoryType) => {
    setSelectedCategory(category)
    setEditedCategory({ 
      name: category.name, 
      slug: category.slug, 
      description: category.description || "" 
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = (category: CategoryType) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const confirmAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) return
    
    dispatch(handleCreateCategory({
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description || newCategory.name // Sử dụng name làm mô tả mặc định nếu không có
    }))
  }

  const confirmEditCategory = () => {
    if (!selectedCategory || !editedCategory.name || !editedCategory.slug) return

    dispatch(handleUpdateCategory({
      id: selectedCategory.id,
      data: {
        name: editedCategory.name,
        slug: editedCategory.slug,
        description: editedCategory.description || editedCategory.name // Sử dụng name làm mô tả mặc định nếu không có
      }
    }))
  }

  const confirmDeleteCategory = () => {
    if (!selectedCategory) return
    
    // API yêu cầu ID là số nguyên
    const categoryId = Number(selectedCategory.id)
    // Gọi hàm xóa category từ thunk đã được đổi tên
    dispatch(deleteCategory(categoryId))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Làm mới
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            onClick={handleAddCategory}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tên danh mục</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Số bài viết</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{category.id}</td>
                  <td className="p-4 align-middle font-medium">{category.name}</td>
                  <td className="p-4 align-middle">{category.slug}</td>
                  <td className="border px-4 py-2 text-center">{category.count || 0}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Thêm danh mục mới</h3>
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setNewCategory({
                      name,
                      slug: generateSlug(name),
                      description: newCategory.description
                    })
                  }}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label htmlFor="slug" className="mb-2 block text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="nhap-ten-danh-muc"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={confirmAddCategory}
                disabled={isLoading || !newCategory.name || !newCategory.slug}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Chỉnh sửa danh mục</h3>
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-medium">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="edit-name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editedCategory.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setEditedCategory({
                      name,
                      slug: generateSlug(name),
                      description: editedCategory.description
                    })
                  }}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label htmlFor="edit-slug" className="mb-2 block text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  id="edit-slug"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editedCategory.slug}
                  onChange={(e) => setEditedCategory({ ...editedCategory, slug: e.target.value })}
                  placeholder="nhap-ten-danh-muc"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={confirmEditCategory}
                disabled={isLoading || !editedCategory.name || !editedCategory.slug}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">Xác nhận xóa</h3>
            </div>
            <p className="mb-4 text-sm">
              Bạn có chắc chắn muốn xóa danh mục <span className="font-medium">{selectedCategory.name}</span>? Hành động
              này không thể hoàn tác và sẽ ảnh hưởng đến tất cả bài viết trong danh mục này.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                onClick={confirmDeleteCategory}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
