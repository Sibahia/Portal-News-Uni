"use client"

import { useState, useEffect, useRef } from "react"
import QuillChanges from "./QuillChanges.jsx"

const normalizeImageUrl = (url) => {
  if (!url) return null;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('/uploads/')) {
    return `http://localhost:3000${url}`;
  }
  
  return url;
};

const EditPage = ({ noticeId }) => {
  const quillRef = useRef(null)
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3000/api/notices/article/${noticeId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el aviso`)
        }

        const data = await response.json()
        setNotice(data.notice)
        setTitle(data.notice.title || "")
        setAuthor(data.notice.autor || "")
        
        setCurrentImage(normalizeImageUrl(data.notice.image))
      } catch (err) {
        setError(err.message)
        console.error("Error fetching notice:", err)
      } finally {
        setLoading(false)
      }
    }

    if (noticeId) {
      fetchNotice()
    }
  }, [noticeId])

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setHasChanges(true)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeNewImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setHasChanges(true)
  }

  const removeCurrentImage = () => {
    setCurrentImage(null)
    setHasChanges(true)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    setHasChanges(true)
  }

  const handleAuthorChange = (e) => {
    setAuthor(e.target.value)
    setHasChanges(true)
  }

 const handleSave = async () => {
    if (!quillRef.current) return;

    setSaving(true);

    try {
      const content = quillRef.current.getContent();
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);

      } else if (!currentImage && !selectedImage) {
        imageUrl = null;

      } else {
        imageUrl = currentImage;
      }

      const noticeData = {
        title,
        autor: author,
        content,
        image: imageUrl ? imageUrl.replace("http://localhost:3000", "") : null
      };

      const response = await fetch(`http://localhost:3000/api/notices/article/${noticeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron guardar los cambios`);
      }

      setHasChanges(false);
      showAlert("¡Aviso actualizado exitosamente!", "success");
      
      setTimeout(() => {
        window.location.href = "/menu/noticias";
      }, 2000);
    } catch (err) {
      console.error("Error saving notice:", err);
      showAlert(`Error al guardar: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const showAlert = (message, type = "success") => {
    const alertContainer = document.getElementById("alert-container") || createAlertContainer()

    const alertColors = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
    }

    const alertHTML = `
      <div class="flex items-center p-4 border rounded-lg shadow-lg ${alertColors[type]} transform translate-x-full transition-transform duration-300 ease-in-out max-w-md">
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
      </div>
    `

    alertContainer.insertAdjacentHTML("beforeend", alertHTML)

    const alertElement = alertContainer.lastElementChild
    setTimeout(() => {
      alertElement.classList.remove("translate-x-full")
    }, 100)

    setTimeout(() => {
      alertElement.classList.add("translate-x-full")
      setTimeout(() => alertElement.remove(), 300)
    }, 4000)
  }

  const createAlertContainer = () => {
    const container = document.createElement("div")
    container.id = "alert-container"
    container.className = "fixed top-4 right-4 z-50 space-y-2"
    document.body.appendChild(container)
    return container
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aviso...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => (window.location.href = "/menu/noticias")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/menu/noticias")}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Aviso</h1>
                <p className="text-gray-600 mt-1">ID: #{noticeId}</p>
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-sm font-medium">Cambios sin guardar</span>
              </div>
            )}
          </div>
        </div>

        {}
        <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <header className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Información del Aviso</h2>
                  <p className="text-sm text-gray-600">Creado el {formatDate(notice?.time_created)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8">
            {}
            <section className="space-y-3">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                Título del Aviso *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="block w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Título del aviso"
                required
              />
            </section>

            {}
            <section className="space-y-3">
              <label htmlFor="author" className="block text-sm font-semibold text-gray-700">
                Autor *
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {author ? author.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={handleAuthorChange}
                  className="flex-1 px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Nombre del autor"
                  required
                />
              </div>
            </section>

            {}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Imagen del Aviso</label>

              {}
              {currentImage && !imagePreview && (
                <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img
                      src={normalizeImageUrl(currentImage) || "/placeholder.svg"}
                      alt="Imagen actual"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Imagen actual</p>
                      <p className="text-sm text-gray-500">Imagen asociada al aviso</p>
                      <button
                        onClick={removeCurrentImage}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar imagen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {}
              {imagePreview && (
                <div className="relative bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Nueva imagen"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedImage?.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={removeNewImage}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar nueva imagen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {}
              {!currentImage && !imagePreview && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
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
                        <p className="text-lg font-medium text-gray-700">Seleccionar nueva imagen</p>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </section>

            {}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Contenido del Aviso *</label>
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
                {notice && (
                  <QuillChanges ref={quillRef} initialContent={notice.content || ""} />
                )}
              </div>
            </section>
          </div>

          {}
          <footer className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Última modificación: {formatDate(notice?.time_created)}</div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => (window.location.href = "/menu/noticias")}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className={`px-8 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 ${
                    saving || !hasChanges ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
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
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}

export default EditPage