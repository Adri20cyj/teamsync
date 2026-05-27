import { useState } from "react";

const AgregarTarea = ({ onAgregar }) => {
    const [titulo, setTitulo] = useState("");
    const [asignado, setAsignado] = useState("Todos");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        onAgregar({
            titulo: titulo,
            asignado: asignado
        });
        setTitulo("");
    };
    return (
        <form class="ingresar-tarea" onSubmit={handleSubmit}>
            <div class="selector-alumnos">
                <p>Asignado a:</p>
                <select class="selector" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                    <option value="Todos">Todos</option>
                    <option value="Alumno 1">Alumno 1</option>
                    <option value="Alumno 2">Alumno 2</option>
                    <option value="Alumno 3">Alumno 3</option>
                    <option value="Alumno 4">Alumno 4</option>
                </select>
            </div>

            <input type="text" placeholder="Escribe una tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <button type="submit" class="añadir-tarea"> + </button>
        </form>
    );
};

export default AgregarTarea;