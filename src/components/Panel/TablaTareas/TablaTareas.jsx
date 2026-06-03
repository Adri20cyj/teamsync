import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";


import "./TablaTareas.css"

const TablaTareas = ({ tareas, setTareas, miembros = [], setMiembros }) => {
    const agregarTarea = (nuevaTarea) => {
        const tareaConId = {
            ...nuevaTarea,
            id: Date.now(),
            estaTerminada: false
        };

        setTareas([...tareas, tareaConId]);
        const existeMiembro = miembros.some(m => m.email === tareaConId.asignado);

        if (!existeMiembro && tareaConId.asignado !== "Todos") {
            const nuevoMiembro = {
                id: miembros.length + 1,
                email: tareaConId.asignado
            };
            setMiembros([...miembros, nuevoMiembro]);
        }

    };

    const checkTarea = (id) => {
        setTareas(prevTareas =>
            prevTareas.map(tarea =>
                tarea.id === id ? { ...tarea, check: !tarea.check, estaTerminada: !tarea.check } : tarea
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

            <AgregarTarea onAgregar={agregarTarea} miembros={miembros} />
        </div>
    )
}

export default TablaTareas

