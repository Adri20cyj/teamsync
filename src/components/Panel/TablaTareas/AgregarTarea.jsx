import { useState } from "react";

const AgregarTarea = ({ onAgregar, miembros }) => {
    const [titulo, setTitulo] = useState("");
    const [asignado, setAsignado] = useState("Todos");


    const handleSubmit = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        onAgregar({
            titulo: titulo,
            asignado: asignado,
            check: false,
            estaTerminada: false
        });
        setTitulo("");
    };
    return (
        <form class="ingresar-tarea" onSubmit={handleSubmit}>
            <div class="selector-alumnos">
                <p>Asignado a:</p>
                <select class="selector" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                    <option value="Todos">Todos</option>
                    {miembros.map((miembro) => (
                        <option key={miembro.id} value={miembro.email}>
                            {miembro.email}
                        </option>
                    ))}
                </select>
            </div>

            <input type="text" placeholder="Escribe una tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <button type="submit" class="añadir-tarea"> + </button>
        </form>
    );
};

export default AgregarTarea;
