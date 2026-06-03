import "./ResumenProyecto.css"


const ResumenProyecto = ({ setPestanaActiva, proyecto, tareas = [], tareasCompletas = [] }) => {
    const title = proyecto ? proyecto.title : "Nombre Proyecto";
    const tag = proyecto ? proyecto.tag : "Nombre Curso";
    const startDate = proyecto ? proyecto.startDate : "Fecha de inicio";
    const endDate = proyecto ? proyecto.endDate : "Fecha de final";


    const total = tareas.length;
    const porcentaje = total > 0 ? Math.round((tareasCompletas.length / total) * 100) : 0;
    return (
        <div className="resumen">
            <div className="resumen-datos">
                <div className="curso">{tag}</div>
                <div className="fecha-inicio">Inicio: {startDate}</div>
                <div className="fecha-final">Fin: {endDate}</div>
            </div>

            <div className="resumen-nombre">
                <h1 className="titulo">{title}</h1>
                <button onClick={() => setPestanaActiva('dashboard')} className="boton-dashboard">Ir a Dashboard</button>
            </div>

            <div class="progreso-contenedor">
                <div class="progreso-info">
                    <p class="texto-progreso">Progreso del proyecto :</p>
                    <p class="texto-porcentaje"> {porcentaje} % completado </p>
                </div>
                <div class="barra-progreso">
                    <div class="progreso-llenado" style={{ width: `${porcentaje}%` }}></div>
                </div>
            </div>
        </div>
    )
}

export default ResumenProyecto


