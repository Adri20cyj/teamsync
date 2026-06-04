import { useState } from "react";
import ItemTarea from "./ItemTarea"
import AgregarTarea from "./AgregarTarea";
import { useAuth } from "../../../context/AuthContext";

import "./TablaTareas.css"

const TablaTareas = ({ proyecto, miembros = [], setMiembros }) => {
    const { usuarioActual, actualizarContenidoProyecto } = useAuth();
    const [tareas, setTareas] = useState(proyecto?.tareas || []);
    const agregarTarea = (nuevaTarea) => {
        const tareasActualizadas = [...tareas, nuevaTarea];
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];

        actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
        const existeMiembro = miembros.some(m => m.email === nuevaTarea.asignado);

        if (!existeMiembro && nuevaTarea.asignado !== "Todos") {
            const nuevoMiembro = {
                id: miembros.length + 1,
                email: nuevaTarea.asignado
            };

            const updatedMiembros = [...miembros, nuevoMiembro];
            setMiembros(updatedMiembros);
            localStorage.setItem("miembros", JSON.stringify(updatedMiembros));
        }


    };

    const checkTarea = (id) => {

        const tareasActualizadas = tareas.map(tarea =>
            tarea.id === id ? { ...tarea, check: !tarea.check, estaTerminada: !tarea.check } : tarea
        );
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);

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

