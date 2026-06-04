import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";
import { useAuth } from "../../../context/AuthContext";

import "./TablaTareas.css"

const TablaTareas = ({ tareas, setTareas, miembros = [], setMiembros }) => {
    const { usuarioActual, actualizarDatosUsuario } = useAuth();

    const agregarTarea = (nuevaTarea) => {

        const tareasActualizadas = [...tareas, nuevaTarea];
        setTareas(tareasActualizadas);
        actualizarDatosUsuario(tareasActualizadas, usuarioActual?.recursos || []);
        const existeMiembro = miembros.some(m => m.email === nuevaTarea.asignado);

        if (!existeMiembro && nuevaTarea.asignado !== "Todos") {
            const nuevoMiembro = {
                id: miembros.length + 1,
                email: nuevaTarea.asignado
            };
            setMiembros([...miembros, nuevoMiembro]);
        }


    };

    const checkTarea = (id) => {

        const tareasActualizadas = tareas.map(tarea =>
            tarea.id === id ? { ...tarea, check: !tarea.check, estaTerminada: !tarea.check } : tarea
        );
        setTareas(tareasActualizadas);
        actualizarDatosUsuario(tareasActualizadas, usuarioActual?.recursos || []);

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

