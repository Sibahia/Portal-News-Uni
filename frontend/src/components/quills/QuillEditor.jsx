import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/quill.css';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  ['bold', 'italic', 'underline', 'strike'],
  ['link', 'image'],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'direction': 'rlt' }],
  [{ 'color': [] }, {'background': []}],
  [{ 'font': [] }],
  [{ 'align': [] }]
];


const QuillEditor = forwardRef((props, ref) => {
  const editorRef = useRef(null);
  let quillInstance = null;

  useEffect(() => {
    if (editorRef.current) {
      quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
      });
    }
  }, []);

  // Permitir que el componente padre acceda al contenido de Quill
  useImperativeHandle(ref, () => ({
    getContent: () => quillInstance.root.innerHTML,
  }));

  return (
    <div
      ref={editorRef}
      style={{
        height: '640px',
        background: '#1A1F22',
        border: '1px solid #F2EDF80D',
        color: '#c7c9db',
      }}
    ></div>
  );
});

export default QuillEditor;