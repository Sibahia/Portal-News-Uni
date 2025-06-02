import { useRef } from 'react';
import QuillEditor from './QuillEditor.jsx';
import Button from '../Button.jsx'

const EditorForm = () => {
  const quillRef = useRef(null);

  const handleSubmit = async () => {

    if (quillRef.current) {
        const content = quillRef.current.getContent();
        const title = typeof window !== "undefined" ? document.querySelector('#titulo').value : "";

        try {
            const response = await fetch('http://localhost:3000/api/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content})
            });

            if (response.ok) {
                console.log('Enviado correctamente')
            } else {
                console.log('Error al enviar contenido')
            };

        } catch (error) {
            console.log('Error en solicitud: ', error)
        };
    };
  };

  return (
   <article className=" mt-4 w-auto h-auto p-4 rounded-xl">
        <header className="relative z-0 w-full mt-1 mb-5 group">
            <input type="text" name="titulo" id="titulo" class="block bg-none py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-700 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="titulo" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Título</label>
        </header>

        <section className="m-auto">
            <QuillEditor ref={quillRef} client:only="react"/>
        </section>

        <footer className="m-4 flex justify-end">
            <Button onClick={handleSubmit}>Enviar</Button>
        </footer>
    </article>
  );
};

export default EditorForm;