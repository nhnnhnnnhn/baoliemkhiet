"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, Plus, AlertCircle, RefreshCw, Save, Search } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { handleCreateTag, handleDeleteTag, handleGetTags, handleUpdateTag } from "@/src/thunks/tag/tagThunk"
import { selectCreateTagError, selectCreateTagSuccess, selectDeleteTagError, selectDeleteTagSuccess, selectError, selectIsCreatingTag, selectIsDeletingTag, selectIsLoading, selectTags, selectTotalTags, selectIsUpdatingTag, selectUpdateTagError, selectUpdateTagSuccess, clearCreateTagState, clearDeleteTagState, clearUpdateTagState, clearTagError } from "@/src/thunks/tag/tagSlice"
import { toast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tag as TagType } from "@/src/apis/tag"

export default function TagsClientPage() {
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const tags = useAppSelector(selectTags)
  const totalTags = useAppSelector(selectTotalTags)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const isCreatingTag = useAppSelector(selectIsCreatingTag)
  const createTagError = useAppSelector(selectCreateTagError)
  const createTagSuccess = useAppSelector(selectCreateTagSuccess)
  const isDeletingTag = useAppSelector(selectIsDeletingTag)
  const deleteTagError = useAppSelector(selectDeleteTagError)
  const deleteTagSuccess = useAppSelector(selectDeleteTagSuccess)
  const isUpdatingTag = useAppSelector(selectIsUpdatingTag)
  const updateTagError = useAppSelector(selectUpdateTagError)
  const updateTagSuccess = useAppSelector(selectUpdateTagSuccess)

  // Local state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
  const [newTag, setNewTag] = useState({ name: "", slug: "" })
  const [editedTag, setEditedTag] = useState({ name: "", slug: "" })
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch tags when component mounts
  useEffect(() => {
    dispatch(handleGetTags({}))
  }, [dispatch])

  // Handle create tag success/error
  useEffect(() => {
    if (createTagSuccess) {
      toast({
        title: "Thành công",
        description: "Thẻ mới đã được tạo thành công.",
        variant: "default",
      })
      setIsAddModalOpen(false)
      setNewTag({ name: "", slug: "" })
      dispatch(clearCreateTagState())
    }

    if (createTagError) {
      toast({
        title: "Lỗi",
        description: createTagError,
        variant: "destructive",
      })
      dispatch(clearCreateTagState())
    }
  }, [createTagSuccess, createTagError, dispatch])

  // Handle delete tag success/error
  useEffect(() => {
    if (deleteTagSuccess) {
      toast({
        title: "Thành công",
        description: "Đã xóa thẻ thành công.",
        variant: "default",
      })
      setIsDeleteModalOpen(false)
      setSelectedTag(null)
      dispatch(clearDeleteTagState())
    }

    if (deleteTagError) {
      toast({
        title: "Lỗi",
        description: deleteTagError,
        variant: "destructive",
      })
      dispatch(clearDeleteTagState())
    }
  }, [deleteTagSuccess, deleteTagError, dispatch])

  // Handle update tag success/error
  useEffect(() => {
    if (updateTagSuccess) {
      toast({
        title: "Thành công",
        description: "Đã cập nhật thẻ thành công.",
        variant: "default",
      })
      setIsEditModalOpen(false)
      setSelectedTag(null)
      setEditedTag({ name: "", slug: "" })
      dispatch(clearUpdateTagState())
      dispatch(handleGetTags({}))
    }

    if (updateTagError) {
      toast({
        title: "Lỗi",
        description: updateTagError,
        variant: "destructive",
      })
      dispatch(clearUpdateTagState())
    }
  }, [updateTagSuccess, updateTagError, dispatch])

  // Handler cho chức năng thêm tag
  const handleAddTag = () => {
    setIsAddModalOpen(true)
  }

  // Handler cho chức năng sửa tag
  const handleEditTag = (tag: TagType) => {
    setSelectedTag(tag)
    setEditedTag({ 
      name: tag.name,
      slug: tag.slug || generateSlug(tag.name)
    })
    setIsEditModalOpen(true)
  }

  // Handler cho chức năng xóa tag
  const openDeleteTagModal = (tag: TagType) => {
    setSelectedTag(tag)
    setIsDeleteModalOpen(true)
  }

  const confirmAddTag = () => {
    if (!newTag.name || !newTag.slug) return
    
    dispatch(handleCreateTag({
      name: newTag.name,
      slug: newTag.slug
    }))
  }

  const confirmEditTag = () => {
    if (!selectedTag || !editedTag.name) return

    dispatch(handleUpdateTag({
      id: selectedTag.id,
      data: {
        name: editedTag.name
      }
    }))
  }

  const confirmDeleteTag = () => {
    if (!selectedTag) return
    
    // API yêu cầu ID là số nguyên
    const tagId = Number(selectedTag.id)
    dispatch(handleDeleteTag(tagId))
  }

  const handleRefresh = () => {
    dispatch(handleGetTags({}))
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
          <Button
            variant="default"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Làm mới
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAddTag}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm thẻ
          </Button>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm thẻ..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Danh sách thẻ */}
      <div className="overflow-hidden rounded-lg border">
        {isLoading && tags.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <table className="w-full min-w-full divide-y">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tên thẻ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Số bài viết</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tags
                .filter((tag) => 
                  searchQuery
                    ? tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (tag.slug?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                    : true
                )
                .map((tag) => (
                <tr key={tag.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">{tag.id}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm font-medium">{tag.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-muted-foreground">{tag.articleCount || 0}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-right text-sm">
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2 h-8 w-8"
                      onClick={() => handleEditTag(tag)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => openDeleteTagModal(tag)}
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {tags.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    {error ? `Lỗi: ${error}` : "Không có thẻ nào để hiển thị"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
                <Input
                  type="text"
                  id="name"
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
                <Input
                  type="text"
                  id="slug"
                  value={newTag.slug}
                  onChange={(e) => setNewTag({ ...newTag, slug: e.target.value })}
                  placeholder="nhap-ten-the"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                onClick={confirmAddTag}
                disabled={isLoading || !newTag.name || !newTag.slug}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {isEditModalOpen && selectedTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-medium">Chỉnh sửa thẻ</h3>
            <div className="mb-4 space-y-4">
              <div>
                <label htmlFor="edit-name" className="mb-2 block text-sm font-medium">
                  Tên thẻ
                </label>
                <Input
                  type="text"
                  id="edit-name"
                  value={editedTag.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setEditedTag({
                      name,
                      slug: generateSlug(name)
                    })
                  }}
                  placeholder="Nhập tên thẻ"
                />
              </div>
              <div>
                <label htmlFor="edit-slug" className="mb-2 block text-sm font-medium">
                  Slug (tự động tạo)
                </label>
                <Input
                  type="text"
                  id="edit-slug"
                  value={editedTag.slug}
                  disabled
                  className="bg-gray-50"
                  placeholder="slug-se-tu-dong-tao"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdatingTag}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                onClick={confirmEditTag}
                disabled={isUpdatingTag || !editedTag.name}
              >
                {isUpdatingTag ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Lưu
              </Button>
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
              Bạn có chắc chắn muốn xóa thẻ <span className="font-medium">{selectedTag?.name}</span>? Hành động này không
              thể hoàn tác và sẽ ảnh hưởng đến tất cả bài viết có thẻ này.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteTag}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
