import "./ResumenProyecto.css"


const ResumenProyecto = () => {

    return (
        <div class="resumen">
            <div class="resumen-datos">
                <div class="curso">Nombre Curso</div>
                <div class="fecha-inicio">Fecha de inicio</div>
                <div class="fecha-final">Fecha de final</div>
            </div>

            <div class="resumen-nombre">
                <h1 class="titulo">Nombre Proyecto</h1>
                <button class="boton-dashboard">Ir a Dashboard</button>
            </div>

            <div class="progreso-contenedor">
                <div class="progreso-info">
                    <p class="texto-progreso">Progreso del proyecto :</p>
                    <p class="texto-porcentaje"> # % completado </p>
                </div>
                <div class="barra-progreso">
                </div>
            </div>
        </div>
    )
}

export default ResumenProyecto


