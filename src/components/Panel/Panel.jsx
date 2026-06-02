import { useState } from "react"
import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"

const Panel = () => {
    const [tareas, setTareas] = useState([]);
    const [recursos, setRecursos] = useState([]);
    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (

        <>
            <Header />
            <main>
                <section class="panel-tareas">
                    <ResumenProyecto tareas={tareas} tareasCompletas={tareasCompletas} />
                    <TablaTareas tareas={tareas} setTareas={setTareas} />
                </section>

                <section class="panel-recursos">
                    <Recursos />
                </section>


            </main>
        </>
    )
}

export default Panel

