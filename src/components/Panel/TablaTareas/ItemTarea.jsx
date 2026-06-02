import "./ItemTarea.css"
const ItemTarea = (props) => {

    return (
        <article class="item">
            <p>{props.titulo}</p>
            <div class="item-todo">
                <p class="nombre-alumno">{props.asignado}</p>
                <input class="check" type="checkbox" checked={props.check} onChange={props.onCheck} />
            </div>

        </article>
    )
}

export default ItemTarea