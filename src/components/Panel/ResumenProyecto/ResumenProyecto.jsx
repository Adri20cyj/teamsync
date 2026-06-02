import "./ResumenProyecto.css"


const ResumenProyecto = ({ setPestanaActiva }) => {

    return (
        <div className="resumen">
            <div className="resumen-datos">
                <div className="curso">Nombre Curso</div>
                <div className="fecha-inicio">Fecha de inicio</div>
                <div className="fecha-final">Fecha de final</div>
            </div>

            <div className="resumen-nombre">
                <h1 className="titulo">Nombre Proyecto</h1>
                <button onClick={() => setPestanaActiva('dashboard')} className="boton-dashboard">Ir a Dashboard</button>
            </div>

            <div className="progreso-contenedor">
                <div className="progreso-info">
                    <p className="texto-progreso">Progreso del proyecto :</p>
                    <p className="texto-porcentaje"> # % completado </p>
                </div>
                <div className="barra-progreso">
                </div>
            </div>
        </div>
    )
}

export default ResumenProyecto


