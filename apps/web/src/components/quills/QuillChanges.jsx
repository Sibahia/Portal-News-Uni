import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", QuillImageResize);

const QuillChanges = forwardRef(({ initialContent = "" }, ref) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadedImages = useRef(new Set());

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Destruir instancia anterior si existe
    if (quillRef.current) {
      quillRef.current = null;
    }
    
    // Crear nueva instancia de Quill
    const editor = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "blockquote", "code-block", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
          handlers: {
            // Manejador personalizado para imágenes
            image: () => fileInputRef.current?.click()
          }
        },
        imageResize: {
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      },
    });
    
    // Establecer contenido inicial
    if (initialContent) {
      editor.clipboard.dangerouslyPasteHTML(initialContent);
      // Extraer imágenes del contenido inicial
      extractImagesFromContent(initialContent);
    }
    
    // Evento para detectar cuando se elimina una imagen
    editor.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        checkForDeletedImages();
      }
    });
    
    quillRef.current = editor;
    
    return () => {
      // Limpiar al desmontar
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [initialContent]);

  // Extraer imágenes del contenido HTML
  const extractImagesFromContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        uploadedImages.current.add(src);
      }
    });
  };

  // Verificar si se eliminaron imágenes
  const checkForDeletedImages = () => {
    const content = quillRef.current.root.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const currentImages = new Set();
    
    // Recoger todas las imágenes actuales
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        currentImages.add(src);
      }
    });
    
    // Encontrar imágenes que estaban pero ya no están
    const deletedImages = [...uploadedImages.current].filter(
      img => !currentImages.has(img)
    );
    
    // Eliminar las imágenes del backend
    deletedImages.forEach(img => {
      deleteImageFromServer(img);
    });
    
    // Actualizar el conjunto de imágenes
    uploadedImages.current = currentImages;
  };

  // Eliminar imagen del servidor
  const deleteImageFromServer = async (imageUrl) => {
    try {
      // Extraer solo el nombre del archivo de la URL completa
      const fileName = imageUrl.split('/').pop();
      
      const response = await fetch(`http://localhost:3000/api/notices/delete-image/${fileName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo eliminar la imagen`);
      }

      console.log(`Imagen eliminada: ${fileName}`);
    } catch (err) {
      console.error("Error eliminando imagen:", err);
    }
  };

  // Manejador para subida de imágenes
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/api/notices/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la subida");
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("Fallo al subir imagen:", err);
      throw err;
    }
  };

  // Manejador para cambio de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const imageUrl = await handleImageUpload(file);
      
      // Agregar la nueva imagen al conjunto
      uploadedImages.current.add(imageUrl);
      
      // Insertar la imagen en el editor
      const range = quillRef.current.getSelection(true);
      quillRef.current.insertEmbed(range.index, "image", imageUrl, "user");
      quillRef.current.setSelection(range.index + 1);
    } catch (error) {
      console.error("Error insertando imagen:", error);
    } finally {
      e.target.value = ""; // Reset input
    }
  };

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (!quillRef.current) return "";
      return containerRef.current.querySelector(".ql-editor").innerHTML;
    },
    setContent: (html) => {
      if (!quillRef.current) return;
      quillRef.current.clipboard.dangerouslyPasteHTML(html);
      // Extraer imágenes del nuevo contenido
      extractImagesFromContent(html);
    }
  }));

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: 150 }} className="quill-editor-container" />
      {/* Input oculto para manejar imágenes */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
});

export default QuillChanges;
// import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// const QuillChanges = forwardRef(({ initialContent = "" }, ref) => {
//   const containerRef = useRef(null);
//   const quillRef = useRef(null);
  
//   useEffect(() => {
//     if (!containerRef.current) return;
    
//     // Destruir instancia anterior si existe
//     if (quillRef.current) {
//       quillRef.current = null;
//     }
    
//     // Crear nueva instancia de Quill
//     const editor = new Quill(containerRef.current, {
//       theme: "snow",
//       modules: {
//         toolbar: [
//           [{ header: [1, 2, false] }],
//           ["bold", "italic", "underline"],
//           ["link", "blockquote", "code-block", "image"],
//           [{ list: "ordered" }, { list: "bullet" }],
//           ["clean"],
//         ],
//       },
//     });
    
//     // Establecer contenido inicial
//     if (initialContent) {
//       editor.clipboard.dangerouslyPasteHTML(initialContent);
//     }
    
//     quillRef.current = editor;
    
//     return () => {
//       // Limpiar al desmontar
//       if (quillRef.current) {
//         quillRef.current = null;
//       }
//     };
//   }, [initialContent]);

//   useImperativeHandle(ref, () => ({
//     getContent: () => {
//       if (!quillRef.current) return "";
//       return containerRef.current.querySelector(".ql-editor").innerHTML;
//     },
//     setContent: (html) => {
//       if (!quillRef.current) return;
//       quillRef.current.clipboard.dangerouslyPasteHTML(html);
//     }
//   }));

//   return <div ref={containerRef} style={{ minHeight: 150 }} className="quill-editor-container" />;
// });

// export default QuillChanges;