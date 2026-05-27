import "./ItemTarea.css"
const ItemTarea = (props) => {

    return (
        <article class="item">
            <p>{props.titulo}</p>
            <div class="item-todo">
                <p class="nombre-alumno">{props.asignado}</p>
                <input class="check" type="checkbox" />
            </div>

        </article>
    )
}

export default ItemTarea