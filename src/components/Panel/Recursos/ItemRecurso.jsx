import "./ItemRecurso.css"

const ItemRecurso = (props) => {
    return (
        <div class="item-recurso">
            <div class="contenedor-item">
                <p>{props.nombre}</p>
                <a class="url-recurso" href={props.url} target="_blank">
                    {props.url}
                </a>
            </div>
            <button class="eliminar">-</button>
        </div>
    )
}

export default ItemRecurso

