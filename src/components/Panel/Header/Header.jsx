import "./Header.css"

const Header = ({setPestanaActiva}) => {

    return (
        <header>
            <div class="titulo">
                <h2>TeamSync</h2>
            </div>
            <div class="separador"></div>
            <div class="botones">
                <button class="boton-header">Volver a Proyectos</button>
                <button class="boton-header" onClick={() => setPestanaActiva('tareas')}>Panel de Tareas</button>
                <button class="boton-header">Panel de Anuncios</button>

                
            </div>
        </header>

    )
}

export default Header


