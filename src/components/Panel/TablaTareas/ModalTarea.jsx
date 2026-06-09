import { useState, useEffect } from "react";
import "./ModalTarea.css";

const ModalTarea = ({ tarea, onClose, onSave, onDelete, miembros = [] }) => {
    const [titulo, setTitulo] = useState(tarea.titulo || "");
    const [asignado, setAsignado] = useState(tarea.asignado || "Todos");
    const [prioridad, setPrioridad] = useState(tarea.prioridad || "Media");
    const [fechaLimite, setFechaLimite] = useState(tarea.fechaLimite || "");
    const [check, setCheck] = useState(!!tarea.check);

    // Actualizar estados si la tarea cambia externamente
    useEffect(() => {
        if (tarea) {
            setTitulo(tarea.titulo || "");
            setAsignado(tarea.asignado || "Todos");
            setPrioridad(tarea.prioridad || "Media");
            setFechaLimite(tarea.fechaLimite || "");
            setCheck(!!tarea.check);
        }
    }, [tarea]);

    // Calcular el estado de la tarea en tiempo real para mostrar el badge
    const obtenerEstado = () => {
        if (check) {
            return { label: "Completada", clase: "estado-completada" };
        }
        if (!fechaLimite) {
            return { label: "Sin fecha definida", clase: "estado-sin-fecha" };
        }
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date(fechaLimite + 'T00:00:00');
        if (isNaN(limite.getTime())) {
            return { label: "Sin fecha definida", clase: "estado-sin-fecha" };
        }
        if (limite < hoy) {
            return { label: "Atrasada", clase: "estado-atrasada" };
        }
        return { label: "Activa", clase: "estado-activa" };
    };

    const estado = obtenerEstado();

    const handleSave = (e) => {
        e.preventDefault();
        if (titulo.trim() === "") return;
        onSave({
            ...tarea,
            titulo: titulo.trim(),
            asignado,
            prioridad,
            fechaLimite,
            check,
            estaTerminada: check
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>Detalles de la Tarea</h3>
                    <button className="boton-cerrar-x" onClick={onClose}>&times;</button>
                </header>

                <form onSubmit={handleSave} className="modal-form">
                    <div className="grupo-formulario">
                        <label>Título de la Tarea</label>
                        <input 
                            type="text" 
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                            placeholder="Escribe el título..."
                            required
                        />
                    </div>

                    <div className="cuadricula-formulario">
                        <div className="grupo-formulario">
                            <label>Asignado a</label>
                            <select value={asignado} onChange={(e) => setAsignado(e.target.value)}>
                                <option value="Todos">Todos</option>
                                {miembros.map((miembro) => (
                                    <option key={miembro.id} value={miembro.email}>
                                        {miembro.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grupo-formulario">
                            <label>Prioridad</label>
                            <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                                <option value="Baja">Baja</option>
                                <option value="Media">Media</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>

                        <div className="grupo-formulario">
                            <label>Fecha Límite</label>
                            <input 
                                type="date" 
                                value={fechaLimite} 
                                onChange={(e) => setFechaLimite(e.target.value)} 
                            />
                        </div>

                        <div className="grupo-formulario">
                            <label>Estado Actual</label>
                            <div className="badge-contenedor-modal">
                                <span className={`badge-estado ${estado.clase}`}>
                                    {estado.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grupo-formulario checkbox-container">
                        <label className="checkbox-label-modal">
                            <input 
                                type="checkbox" 
                                checked={check} 
                                onChange={(e) => setCheck(e.target.checked)} 
                            />
                            <span className="checkbox-custom-label">Marcar como tarea completada</span>
                        </label>
                    </div>

                    <footer className="modal-footer">
                        <button 
                            type="button" 
                            className="boton-eliminar-tarea" 
                            onClick={() => onDelete(tarea.id)}
                        >
                            Eliminar Tarea
                        </button>
                        <div className="botones-derecha">
                            <button type="button" className="boton-cancelar" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="boton-guardar">
                                Guardar Cambios
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ModalTarea;
