import "./ResumenProyecto.css"


const ResumenProyecto = ({ setPestanaActiva, proyecto }) => {
    const title = proyecto ? proyecto.title : "Nombre Proyecto";
    const tag = proyecto ? proyecto.tag : "Nombre Curso";
    const startDate = proyecto ? proyecto.startDate : "Fecha de inicio";
    const endDate = proyecto ? proyecto.endDate : "Fecha de final";
    const progress = proyecto ? proyecto.progress : 0;

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

            <div className="progreso-contenedor">
                <div className="progreso-info">
                    <p className="texto-progreso">Progreso del proyecto :</p>
                    <p className="texto-porcentaje"> {progress}% completado </p>
                </div>
                <div className="barra-progreso" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div className="barra-progreso-fill" style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #7c6df2, #a295ff)', borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                </div>
            </div>
        </div>
    )
}

export default ResumenProyecto


