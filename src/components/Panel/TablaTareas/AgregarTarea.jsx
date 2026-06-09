import { useState } from "react";

const AgregarTarea = ({ onAgregar, miembros }) => {
    const [titulo, setTitulo] = useState("");
    const [asignado, setAsignado] = useState("Todos");
    const [prioridad, setPrioridad] = useState("Media");
    const [fechaLimite, setFechaLimite] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        onAgregar({
            id: Date.now(),
            titulo: titulo,
            asignado: asignado,
            prioridad: prioridad,
            fechaLimite: fechaLimite,
            check: false,
            estaTerminada: false
        });
        setTitulo("");
        setAsignado("Todos");
        setPrioridad("Media");
        setFechaLimite("");
    };

    return (
        <form className="ingresar-tarea" onSubmit={handleSubmit}>
            <div className="campos-adicionales">
                <div className="campo-grupo">
                    <p>Asignado a:</p>
                    <select className="selector" value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                        <option value="Todos">Todos</option>
                        {miembros.map((miembro) => (
                            <option key={miembro.id} value={miembro.email}>
                                {miembro.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-grupo">
                    <p>Prioridad:</p>
                    <select className="selector" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                <div className="campo-grupo">
                    <p>Fecha Límite:</p>
                    <input 
                        type="date" 
                        className="selector selector-fecha" 
                        value={fechaLimite} 
                        onChange={(e) => setFechaLimite(e.target.value)} 
                    />
                </div>
            </div>

            <input type="text" placeholder="Escribe una tarea..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <button type="submit" className="añadir-tarea"> + </button>
        </form>
    );
};

export default AgregarTarea;

