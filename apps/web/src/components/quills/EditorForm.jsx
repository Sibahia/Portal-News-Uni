"use client"

import { useEffect, useRef, useState } from "react"
import QuillEditor from "./QuillEditor.jsx"

const EditorForm = () => {
  const quillRef = useRef(null)
  const fileInputRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [userName, setUserName] = useState("")


  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) return;

      try {
        const resAuthVerify = await fetch("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${authToken} ` }
        });

        if (!resAuthVerify.ok) { console.error("Error al obtener el perfil") };

        const data = await resAuthVerify.json();
        setUserName(data?.user?.user || "");
      } catch (error) {
        console.log("Error en la solicitud del perfil: ", error)
      };
    };

    fetchUserProfile();
  }, []);


  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleImageSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleImageSelect(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    if (quillRef.current) {
      const content = quillRef.current.getContent()
      const title = typeof window !== "undefined" ? document.querySelector("#titulo").value : ""

      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("autor", userName)

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      try {
        const response = await fetch("http://localhost:3000/api/notices", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          console.log("Enviado correctamente")
          document.querySelector("#titulo").value = ""
          if (quillRef.current) {
            quillRef.current.setContent("")
          }
          removeImage()

          alert("¡Noticia creada exitosamente!")
        } else {
          console.log("Error al enviar contenido")
          alert("Error al crear publicación. Por favor, intenta nuevamente.")
        }
      } catch (error) {
        console.log("Error en solicitud: ", error)
        alert("Error de conexión. Por favor, verifica tu conexión a internet.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Publicación</h1>
              <p className="text-sm text-gray-600 mt-1">Completa la información para publicar tu publicación</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Title Section */}
          <section className="space-y-2">
            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-3">
              Título del Publicación *
            </label>
            <div className="relative">
              <input
                type="text"
                name="titulo"
                id="titulo"
                className="block w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                placeholder="Ingresa un título descriptivo para tu publicación"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </section>

          {}
          <section className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Imagen del Publicación (Opcional)</label>

            {!imagePreview ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      Seleccionar archivo
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{selectedImage?.name}</p>
                        <p className="text-sm text-gray-500">
                          {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        onClick={removeImage}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar imagen"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center">
                      <div className="flex-1 bg-green-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                      <span className="ml-2 text-xs text-green-600 font-medium">Listo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Content Editor Section */}
          <section className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Contenido del Publicación *</label>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
              <QuillEditor ref={quillRef} client:only="react" />
            </div>
            <p className="text-sm text-gray-500">
              Utiliza el editor para dar formato a tu contenido. Puedes agregar enlaces, listas y más.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 px-8 py-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Los campos marcados con * son obligatorios</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-2.5 text-sm font-medium flex items-center text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 space-x-2 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Publicar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}

export default EditorForm
