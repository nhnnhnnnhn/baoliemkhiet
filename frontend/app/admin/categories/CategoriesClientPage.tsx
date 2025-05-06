"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, RefreshCw, Save } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  articleCount: number
}

export default function CategoriesClientPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Thời sự", slug: "thoi-su", articleCount: 42 },
    { id: 2, name: "Thế giới", slug: "the-gioi", articleCount: 38 },
    { id: 3, name: "Kinh doanh", slug: "kinh-doanh", articleCount: 29 },
    { id: 4, name: "Công nghệ", slug: "cong-nghe", articleCount: 35 },
    { id: 5, name: "Thể thao", slug: "the-thao", articleCount: 47 },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [editedCategory, setEditedCategory] = useState({ name: "", slug: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddCategory = () => {
    setIsAddModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setEditedCategory({ name: category.name, slug: category.slug })
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const confirmAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...categories.map((c) => c.id)) + 1
      setCategories([
        ...categories,
        {
          id: newId,
          name: newCategory.name,
          slug: newCategory.slug,
          articleCount: 0,
        },
      ])

      setIsLoading(false)
      setIsAddModalOpen(false)
      setNewCategory({ name: "", slug: "" })
    }, 500)
  }

  const confirmEditCategory = () => {
    if (!selectedCategory || !editedCategory.name || !editedCategory.slug) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id ? { ...c, name: editedCategory.name, slug: editedCategory.slug } : c,
        ),
      )

      setIsLoading(false)
      setIsEditModalOpen(false)
      setSelectedCategory(null)
      setEditedCategory({ name: "", slug: "" })
    }, 500)
  }

  const confirmDeleteCategory = () => {
    if (!selectedCategory) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id))

      setIsLoading(false)
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
    }, 500)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call to refresh data
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
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
                  <td className="p-4 align-middle">{category.articleCount}</td>
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
