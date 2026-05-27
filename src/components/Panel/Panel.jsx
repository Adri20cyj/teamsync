import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"

const Panel = () => {

    return (
        <>
            <Header />
            <main>
                <section class="panel-tareas">
                    <ResumenProyecto />
                    <TablaTareas />
                </section>

                <section class="panel-recursos">
                    <Recursos />
                </section>


            </main>
        </>
    )
}

export default Panel

