import './BarraProgreso.css'
const BarraProgreso = ({ porcentaje = 0, completadas = 0, total = 0 }) => { 
    return (
        <>
            <div className="db-progreso-contenedor">
                <div className="db-progreso-texto">
                    <span>Progreso Asignado</span>
                    <span>{porcentaje}% ({completadas}/{total})</span>
                </div>
                <div className="db-barra-fondo">
                    <div className="db-barra-relleno" style={{ width: `${porcentaje}%` }} />
                </div>
            </div>       
        </>
    )
}
export default BarraProgreso