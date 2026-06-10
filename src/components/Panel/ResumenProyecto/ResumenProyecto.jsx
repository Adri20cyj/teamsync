import "./ResumenProyecto.css"

const ResumenProyecto = ({ setPestanaActiva, proyecto, tareas = [], tareasCompletas = [] }) => {
    const title = proyecto ? proyecto.title : "Nombre Proyecto";
    const total = tareas.length;
    const completas = tareasCompletas.length;
    const porcentaje = total > 0 ? Math.round((completas / total) * 100) : 0;
    const alumnosCount = proyecto ? (proyecto.membersCount || 1) : 1;

    return (
        <div className="resumen-premium-card">
            {/* Sección Izquierda */}
            <div className="resumen-premium-izquierda">
                <div className="academia-badge">
                    <span>COLABORACIÓN EN EQUIPO</span>
                </div>
                <h3 className="resumen-premium-titulo">{title}</h3>
            </div>

            {/* Sección Derecha */}
            <div className="resumen-premium-derecha">
                <div className="logros-card">
                    <div className="logros-header">
                        <span>LOGROS DEL WORKSPACE</span>
                        <span className="logros-porcentaje">{porcentaje}%</span>
                    </div>
                    <div className="logros-barra-progreso">
                        <div className="logros-progreso-llenado" style={{ width: `${porcentaje}%` }}></div>
                    </div>

                    <div className="logros-metricas-grid">
                        <div className="logros-metrica-caja">
                            <h4>{completas} / {total}</h4>
                            <p>ACABADAS</p>
                        </div>
                        <div className="logros-metrica-caja">
                            <h4>{alumnosCount}</h4>
                            <p>ALUMNOS</p>
                        </div>
                    </div>

                    <button className="boton-ir-dashboard" onClick={() => setPestanaActiva('dashboard')}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
                        </svg>
                        <span>IR A DASHBOARD</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumenProyecto;



