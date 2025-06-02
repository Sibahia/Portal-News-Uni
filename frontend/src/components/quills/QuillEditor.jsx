import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Quill from 'quill';
// import '../styles/quill.css';

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
    if (typeof window !== "undefined") {
      quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
      });
    }
  }, []);

  // useEffect(() => {
  //   if (editorRef.current) {
  //     quillInstance = new Quill(editorRef.current, {
  //       theme: 'snow',
  //       modules: {
  //         toolbar: toolbarOptions
  //       },
  //     });
  //   }
  // }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => quillInstance.root.innerHTML,
  }));

  return (
    <div
      ref={editorRef}
      style={{
        height: '640px',
        border: '1px solid #F2EDF80D',
        color: '#000',
      }}
    ></div>
  );
});

export default QuillEditor;