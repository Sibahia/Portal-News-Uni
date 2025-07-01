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
    
    if (quillRef.current) {
      quillRef.current = null;
    }
    
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
            image: () => fileInputRef.current?.click()
          }
        },
        imageResize: {
          modules: ["Resize", "DisplaySize", "Toolbar"],
        },
      },
    });
    
    if (initialContent) {
      editor.clipboard.dangerouslyPasteHTML(initialContent);

      extractImagesFromContent(initialContent);
    }
    
    editor.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        checkForDeletedImages();
      }
    });
    
    quillRef.current = editor;
    
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [initialContent]);

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

  const checkForDeletedImages = () => {
    const content = quillRef.current.root.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const currentImages = new Set();
    
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        currentImages.add(src);
      }
    });
    
    const deletedImages = [...uploadedImages.current].filter(
      img => !currentImages.has(img)
    );
    
    deletedImages.forEach(img => {
      deleteImageFromServer(img);
    });
    
    uploadedImages.current = currentImages;
  };

  const deleteImageFromServer = async (imageUrl) => {
    try {
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const imageUrl = await handleImageUpload(file);
      
      uploadedImages.current.add(imageUrl);
      
      const range = quillRef.current.getSelection(true);
      quillRef.current.insertEmbed(range.index, "image", imageUrl, "user");
      quillRef.current.setSelection(range.index + 1);
    } catch (error) {
      console.error("Error insertando imagen:", error);
    } finally {
      e.target.value = "";
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

      extractImagesFromContent(html);
    }
  }));

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: 150 }} className="quill-editor-container" />
      {}
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