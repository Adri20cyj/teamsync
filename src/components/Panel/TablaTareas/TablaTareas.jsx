import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";


import "./TablaTareas.css"

const TablaTareas = ({ tareas, setTareas }) => {
    const [tareasCompletas, setTareasCompletas] = useState([]);

    const agregarTarea = (nuevaTarea) => {
        const tareaConId = {
            ...nuevaTarea,
            id: Date.now()
        };

        setTareas([...tareas, tareaConId]);
    };

    const checkTarea = (id) => {
        setTareas(prevTareas =>
            prevTareas.map(tarea =>
                tarea.id === id ? { ...tarea, check: !tarea.check } : tarea
            )
        );
    };

    const completasCount = tareas.filter(t => t.check).length;

    return (
        <div class="tabla-tareas">
            <div class="tabla-titulo">
                <h2>Lista de Tareas</h2>
                <div class="pendientes">
                    {tareas.length - completasCount} pendientes
                </div>
            </div>

            <div class="lista-tareas">
                {tareas.map((tarea) => (
                    <ItemTarea
                        key={tarea.id}
                        titulo={tarea.titulo}
                        asignado={tarea.asignado}
                        check={tarea.check}
                        onCheck={() => checkTarea(tarea.id)}
                    />
                ))}
            </div>

            <AgregarTarea onAgregar={agregarTarea} />
        </div>
    )
}

export default TablaTareas

