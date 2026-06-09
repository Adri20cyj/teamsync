import React from "react";
import "./CalendarioGeneral.css";

const CalendarioGeneral = ({ proyectos = [], onSelectProyecto }) => {
    // ==========================================
    // DATOS CONSOLIDADOS (TODAS LAS TAREAS)
    // ==========================================
    const todasLasTareas = [];
    proyectos.forEach(p => {
        const tareasProyecto = p.tareas || [];
        tareasProyecto.forEach(t => {
            todasLasTareas.push({
                ...t,
                proyectoId: p.id,
                proyectoTitle: p.title,
                proyectoTag: p.tag
            });
        });
    });

    const formatFechaDetalle = (dateStr) => {
        if (!dateStr) return "Sin fecha";
        const parts = dateStr.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        return `${date.getDate()} de ${months[date.getMonth()]}`;
    };

    // Ordenar tareas por fecha de vencimiento
    const tareasOrdenadas = [...todasLasTareas].sort((a, b) => {
        if (!a.fechaLimite) return 1;
        if (!b.fechaLimite) return -1;
        return new Date(a.fechaLimite) - new Date(b.fechaLimite);
    });

    return (
        <div className="workspace-tab-content">
            <div className="workspace-section-header">
                <h3>Calendario General de Hitos</h3>
                <p>Visualiza y organiza todas tus tareas planificadas de todos tus cursos y grupos.</p>
            </div>
            
            {tareasOrdenadas.length === 0 ? (
                <div className="gantt-empty-state">No tienes tareas registradas. Entra a un proyecto para crearlas.</div>
            ) : (
                <div className="calendario-general-lista">
                    {tareasOrdenadas.map(tarea => {
                        const prioridad = tarea.prioridad || "Media";
                        const proyecto = proyectos.find(p => p.id === tarea.proyectoId);
                        
                        return (
                            <div 
                                key={tarea.id} 
                                className={`calendario-tarea-row prioridad-border-${prioridad.toLowerCase()} ${tarea.check ? 'completa' : ''}`}
                                onClick={() => proyecto && onSelectProyecto(proyecto)}
                            >
                                <div className="calendario-tarea-left">
                                    <div className="calendario-project-tag">{tarea.proyectoTag}</div>
                                    <div className="calendario-tarea-info">
                                        <h4>{tarea.titulo}</h4>
                                        <span>Grupo: {tarea.proyectoTitle}</span>
                                    </div>
                                </div>
                                <div className="calendario-tarea-right">
                                    <span className={`calendario-prioridad prioridad-${prioridad.toLowerCase()}`}>{prioridad}</span>
                                    <span className="calendario-fecha">
                                        📅 {tarea.fechaLimite ? formatFechaDetalle(tarea.fechaLimite) : "Por definir"}
                                    </span>
                                    <span className="calendario-responsable">{tarea.asignado || "Todos"}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CalendarioGeneral;
