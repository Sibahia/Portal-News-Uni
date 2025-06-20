"use client"

import { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'direction': 'rlt' }],
            [{ 'color': [] }, {'background': []}],
            [{ 'font': [] }],
            [{ 'align': [] }]
            ],
        },
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return quillInstance.current?.root.innerHTML || "";
    },
    setContent: (html) => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = html;
      }
    },
  }));

  return <div ref={editorRef} style={{ minHeight: "200px" }} />;
});

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
