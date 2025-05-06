"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, RefreshCw, Save } from "lucide-react"

interface Tag {
  id: number
  name: string
  slug: string
  articleCount: number
}

export default function TagsClientPage() {
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: "Chính trị", slug: "chinh-tri", articleCount: 24 },
    { id: 2, name: "Kinh tế", slug: "kinh-te", articleCount: 31 },
    { id: 3, name: "Xã hội", slug: "xa-hoi", articleCount: 28 },
    { id: 4, name: "Văn hóa", slug: "van-hoa", articleCount: 19 },
    { id: 5, name: "Giáo dục", slug: "giao-duc", articleCount: 22 },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [newTag, setNewTag] = useState({ name: "", slug: "" })
  const [editedTag, setEditedTag] = useState({ name: "", slug: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = () => {
    setIsAddModalOpen(true)
  }

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setEditedTag({ name: tag.name, slug: tag.slug })
    setIsEditModalOpen(true)
  }

  const handleDeleteTag = (tag: Tag) => {
    setSelectedTag(tag)
    setIsDeleteModalOpen(true)
  }

  const confirmAddTag = () => {
    if (!newTag.name || !newTag.slug) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...tags.map((t) => t.id)) + 1
      setTags([
        ...tags,
        {
          id: newId,
          name: newTag.name,
          slug: newTag.slug,
          articleCount: 0,
        },
      ])

      setIsLoading(false)
      setIsAddModalOpen(false)
      setNewTag({ name: "", slug: "" })
    }, 500)
  }

  const confirmEditTag = () => {
    if (!selectedTag || !editedTag.name || !editedTag.slug) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setTags(tags.map((t) => (t.id === selectedTag.id ? { ...t, name: editedTag.name, slug: editedTag.slug } : t)))

      setIsLoading(false)
      setIsEditModalOpen(false)
      setSelectedTag(null)
      setEditedTag({ name: "", slug: "" })
    }, 500)
  }

  const confirmDeleteTag = () => {
    if (!selectedTag) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setTags(tags.filter((t) => t.id !== selectedTag.id))

      setIsLoading(false)
      setIsDeleteModalOpen(false)
      setSelectedTag(null)
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
        <h1 className="text-2xl font-bold tracking-tight">Quản lý thẻ</h1>
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
            onClick={handleAddTag}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm thẻ
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tên thẻ</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Số bài viết</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">{tag.id}</td>
                  <td className="p-4 align-middle font-medium">{tag.name}</td>
                  <td className="p-4 align-middle">{tag.slug}</td>
                  <td className="p-4 align-middle">{tag.articleCount}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => handleDeleteTag(tag)}
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

      {/* Add Tag Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Thêm thẻ mới</h3>
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Tên thẻ
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={newTag.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setNewTag({
                      name,
                      slug: generateSlug(name),
                    })
                  }}
                  placeholder="Nhập tên thẻ"
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
                  value={newTag.slug}
                  onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                  placeholder="nhap-ten-the"
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
                onClick={confirmAddTag}
                disabled={isLoading || !newTag.name || !newTag.slug}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {isEditModalOpen && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Chỉnh sửa thẻ</h3>
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-medium">
                  Tên thẻ
                </label>
                <input
                  type="text"
                  id="edit-name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={editedTag.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setEditedTag({
                      name,
                      slug: generateSlug(name),
                    })
                  }}
                  placeholder="Nhập tên thẻ"
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
                  value={editedTag.slug}
                  onChange={(e) => setEditedTag({ ...editedTag, slug: e.target.value })}
                  placeholder="nhap-ten-the"
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
                onClick={confirmEditTag}
                disabled={isLoading || !editedTag.name || !editedTag.slug}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Modal */}
      {isDeleteModalOpen && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">Xác nhận xóa</h3>
            </div>
            <p className="mb-4 text-sm">
              Bạn có chắc chắn muốn xóa thẻ <span className="font-medium">{selectedTag.name}</span>? Hành động này không
              thể hoàn tác và sẽ ảnh hưởng đến tất cả bài viết có thẻ này.
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
                onClick={confirmDeleteTag}
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
