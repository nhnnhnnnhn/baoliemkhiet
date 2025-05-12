"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface MultiSelectProps {
  options: {
    label: string
    value: string
  }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Chọn các mục...",
  className = "",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          const newSelected = [...selected]
          newSelected.pop()
          onChange(newSelected)
        }
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }

  const selectables = options.filter((item) => !selected.includes(item.value))

  return (
    <div
      className={`border border-input p-1 px-3 rounded-md flex gap-1 flex-wrap ${className}`}
    >
      {selected.map((item) => {
        const selectedOption = options.find((option) => option.value === item)
        return (
          <Badge key={item} variant="secondary" className="mb-1 mt-1">
            {selectedOption?.label || item}
            <button
              title={`Xóa ${selectedOption?.label || item}`}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(item)
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleUnselect(item)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        )
      })}
      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div className="flex flex-1">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-transparent px-1 py-2 outline-none placeholder:text-muted-foreground flex-1"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder={selected.length === 0 ? placeholder : ""}
          />
        </div>
        <div className="relative">
          {open && selectables.length > 0 && (
            <div className="absolute top-0 z-10 w-full">
              <Command className="border rounded-md shadow bg-popover">
                <CommandGroup>
                  {selectables.map((option) => (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        onChange([...selected, option.value])
                        setInputValue("")
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </div>
          )}
        </div>
      </CommandPrimitive>
    </div>
  )
}
