import { useState } from "react";

const AgregarRecurso = ({ onAgregarRecurso }) => {
    const [nombre, setNombre] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nombre.trim() === "") return;
        onAgregarRecurso({
            id: Date.now(),
            nombre: nombre,
            url: url
        });
        setNombre("");
        setUrl("");
    };

    return (
        <form class="ingresar-recurso" onSubmit={handleSubmit}>
            <div class="nombre-recurso">
                <p> Nombre del recurso </p>
                <input class="input-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del recurso..." />
            </div>

            <div class="contenedor-url-grande">
                <p> URL del recurso </p>
                <div class="contenedor-url">
                    <input class="input-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL del recurso..." />
                    <button type="submit" class="añadir"> + </button>
                </div>
            </div>
        </form>
    );
};

export default AgregarRecurso;