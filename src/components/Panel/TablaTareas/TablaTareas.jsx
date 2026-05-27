import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";

import "./TablaTareas.css"

const TablaTareas = () => {
    const [tareas, setTareas] = useState([
    ]);

    const agregarTarea = (nuevaTarea) => {
        const tareaConId = {
            ...nuevaTarea,
            id: Date.now()
        };

        setTareas([...tareas, tareaConId]);
    };


    return (
        <div class="tabla-tareas">
            <div class="tabla-titulo">
                <h2>Lista de Tareas</h2>
                <div class="pendientes">
                    {tareas.length} pendientes
                </div>
            </div>

            <div class="lista-tareas">
                {tareas.map((tarea) => (
                    <ItemTarea
                        key={tarea.id}
                        titulo={tarea.titulo}
                        asignado={tarea.asignado}
                    />
                ))}
            </div>

            <AgregarTarea onAgregar={agregarTarea} />
        </div>
    )
}

export default TablaTareas

