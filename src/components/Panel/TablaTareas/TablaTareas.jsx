import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";

import "./TablaTareas.css"

const TablaTareas = ({ tareas, setTareas, miembros, setMiembros}) => {

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

            <AgregarTarea onAgregar={agregarTarea} miembros={miembros}/>
        </div>
    )
}

export default TablaTareas

