import "./Header.css"

const Header = ({setPestanaActiva, onVolver}) => {

    return (
        <header>
            <div className="titulo">
                <h2>TeamSync</h2>
            </div>
            <div className="separador"></div>
            <div className="botones">
                <button className="boton-header" onClick={onVolver}>Volver a Proyectos</button>
                <button className="boton-header" onClick={() => setPestanaActiva('tareas')}>Panel de Tareas</button>
                <button className="boton-header">Panel de Anuncios</button>

                
            </div>
        </header>

    )
}

export default Header


