import "./ItemTarea.css"

const ItemTarea = ({ tarea, onCheck, onClick }) => {
    const formatFecha = (dateStr) => {
        if (!dateStr) return "Sin fecha";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const obtenerEstado = () => {
        if (tarea.check || tarea.estaTerminada) {
            return { label: "Completada", clase: "estado-completada" };
        }
        if (!tarea.fechaLimite) {
            return { label: "Sin fecha definida", clase: "estado-sin-fecha" };
        }
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date(tarea.fechaLimite + 'T00:00:00');
        if (isNaN(limite.getTime())) {
            return { label: "Sin fecha definida", clase: "estado-sin-fecha" };
        }
        if (limite < hoy) {
            return { label: "Atrasada", clase: "estado-atrasada" };
        }
        return { label: "Activa", clase: "estado-activa" };
    };

    const estado = obtenerEstado();
    const prioridad = tarea.prioridad || "Media";

    return (
        <article className={`item ${tarea.check ? 'item-check-completada' : ''}`} onClick={onClick}>
            <div className="item-principal">
                <p className="item-titulo">{tarea.titulo}</p>
                <div className="item-badges">
                    <span className={`badge-prioridad prioridad-${prioridad.toLowerCase()}`}>
                        {prioridad}
                    </span>
                    <span className={`badge-estado ${estado.clase}`}>
                        {estado.label}
                    </span>
                    {tarea.fechaLimite && (
                        <span className="badge-fecha">
                            📅 {formatFecha(tarea.fechaLimite)}
                        </span>
                    )}
                </div>
            </div>
            <div className="item-todo">
                <p className="nombre-alumno">{tarea.asignado || "Sin asignar"}</p>
                <input 
                    className="check" 
                    type="checkbox" 
                    checked={!!tarea.check} 
                    onClick={(e) => e.stopPropagation()} 
                    onChange={(e) => {
                        e.stopPropagation();
                        onCheck();
                    }} 
                />
            </div>
        </article>
    );
};

export default ItemTarea;