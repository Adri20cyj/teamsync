import { useState, useEffect } from "react";
import ItemTarea from "./ItemTarea";
import AgregarTarea from "./AgregarTarea";
import ModalTarea from "./ModalTarea";
import CronogramaTareas from "../CronogramaTareas/CronogramaTareas";
import { useAuth } from "../../../context/AuthContext";

import "./TablaTareas.css";

const TablaTareas = ({ proyecto, miembros = [], setMiembros }) => {
    const { usuarioActual, actualizarContenidoProyecto } = useAuth();
    const [tareas, setTareas] = useState(proyecto?.tareas || []);
    const [vistaTareas, setVistaTareas] = useState("lista"); // "lista" | "cronograma"
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);


    // Sincronizar el estado de tareas cuando el proyecto cambia (ej. recargas)
    useEffect(() => {
        setTareas(proyecto?.tareas || []);
    }, [proyecto]);

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
        
        // Si la tarea que se checkea está abierta en el modal, actualizarla allí también
        if (tareaSeleccionada && tareaSeleccionada.id === id) {
            setTareaSeleccionada(prev => prev ? { ...prev, check: !prev.check } : null);
        }
    };

    const actualizarTarea = (tareaActualizada) => {
        const tareasActualizadas = tareas.map(t => t.id === tareaActualizada.id ? tareaActualizada : t);
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
    };

    const eliminarTarea = (idTarea) => {
        const tareasActualizadas = tareas.filter(t => t.id !== idTarea);
        setTareas(tareasActualizadas);
        const recursosActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.recursos || [];
        actualizarContenidoProyecto(proyecto.id, tareasActualizadas, recursosActuales);
    };

    const completasCount = tareas.filter(t => t.check).length;

    return (
        <div className="tabla-tareas">
            <div className="tabla-titulo">
                <div>
                    <h2>Tareas del Proyecto</h2>
                    <div className="pendientes">
                        {tareas.length - completasCount} pendientes
                    </div>
                </div>

                {/* Alternador de Vistas */}
                <div className="vista-switcher">
                    <button 
                        className={`switcher-btn ${vistaTareas === 'lista' ? 'activo' : ''}`}
                        onClick={() => setVistaTareas('lista')}
                    >
                        📋 Lista
                    </button>
                    <button 
                        className={`switcher-btn ${vistaTareas === 'cronograma' ? 'activo' : ''}`}
                        onClick={() => setVistaTareas('cronograma')}
                    >
                        📅 Cronograma
                    </button>
                </div>
            </div>

            {/* Contenedor principal de visualización */}
            <div className="vistas-tareas-contenedor">
                {vistaTareas === 'lista' && (
                    <div className="lista-tareas">
                        {tareas.length === 0 ? (
                            <div className="tarjeta-vacia">Sin tareas creadas todavía. Usa el formulario de abajo para empezar.</div>
                        ) : (
                            tareas.map((tarea) => (
                                <ItemTarea
                                    key={tarea.id}
                                    tarea={tarea}
                                    onCheck={() => checkTarea(tarea.id)}
                                    onClick={() => setTareaSeleccionada(tarea)}
                                />
                            ))
                        )}
                    </div>
                )}

                {vistaTareas === 'cronograma' && (
                    <CronogramaTareas 
                        tareas={tareas} 
                        onSelectTarea={setTareaSeleccionada}
                    />
                )}
            </div>

            {/* Agregar tarea visible en la parte inferior */}
            <AgregarTarea onAgregar={agregarTarea} miembros={miembros} />

            {/* Modal de Detalle de Tarea */}
            {tareaSeleccionada && (
                <ModalTarea 
                    tarea={tareaSeleccionada}
                    onClose={() => setTareaSeleccionada(null)}
                    onSave={(updated) => {
                        actualizarTarea(updated);
                        setTareaSeleccionada(null);
                    }}
                    onDelete={(id) => {
                        eliminarTarea(id);
                        setTareaSeleccionada(null);
                    }}
                    miembros={miembros}
                />
            )}
        </div>
    );
};

export default TablaTareas;


