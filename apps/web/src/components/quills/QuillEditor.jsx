"use client"

import { useEffect, useImperativeHandle, forwardRef, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

import QuillImageResize from "quill-image-resize-module-react"

Quill.register("modules/imageResize", QuillImageResize)

const QuillEditor = forwardRef((props, ref) => {
  const editorRef = useRef(null)
  const quillInstance = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
              ["bold", "italic", "underline", "strike"],
              ["link", "image"],
              [{ size: ["small", false, "large", "huge"] }],
              [{ direction: "rtl" }],
              [{ color: [] }, { background: [] }],
            ],
            handlers: {

              image: () => fileInputRef.current?.click()
            }
          },
          imageResize: {
            modules: ["Resize", "DisplaySize", "Toolbar"],
          },
        },
      })
    }
  }, [])

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("http://localhost:3000/api/notices/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Error en la subida")
      const data = await res.json()
      return data.url
    } catch (err) {
      console.error("Fallo al subir imagen:", err)
      throw err
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const imageUrl = await handleImageUpload(file)
      const range = quillInstance.current.getSelection(true)
      quillInstance.current.insertEmbed(range.index, "image", imageUrl, "user")
      quillInstance.current.setSelection(range.index + 1)
    } catch (error) {
      console.error("Error inserting image:", error)
    } finally {
      e.target.value = ""
    }
  }

  useImperativeHandle(ref, () => ({
    getContent: () => quillInstance.current?.root.innerHTML || "",
    setContent: (html) => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = html
      }
    },
  }))

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: "200px" }} />
      { }
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  )
})

QuillEditor.displayName = "QuillEditor"

export default QuillEditor