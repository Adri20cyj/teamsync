import { useState } from "react"
import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"
import DashboardRendimiento from "./DashboardRendimiento/DashboardRendimiento"

const Panel = ({ onVolver, proyecto }) => {
    const [pestanaActiva, setPestanaActiva] = useState('tareas');

    const [tareas, setTareas] = useState([ /*prueba*/
        { id: 101, asignado: 'angie@universidad.edu.pe', titulo: 'tarea 1', estaTerminada: false, check: false },
        { id: 103, asignado: 'juan@universidad.edu.pe', titulo: 'tarea 1', estaTerminada: false, check: false },
        { id: 105, asignado: 'juan@universidad.edu.pe', titulo: 'tarea 2', estaTerminada: false, check: false },
        { id: 106, asignado: 'maria@universidad.edu.pe', titulo: 'tarea 1', estaTerminada: false, check: false }
    ]);
    const [miembros, setMiembros] = useState([ /*prueba*/
        { id: 1, email: 'angie@universidad.edu.pe' },
        { id: 2, email: 'juan@universidad.edu.pe' },
        { id: 3, email: 'maria@universidad.edu.pe' }
    ]);

    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (
        <>
            <Header setPestanaActiva={setPestanaActiva} onVolver={onVolver} />
            <main>
                <section className="panel-tareas">
                    <ResumenProyecto setPestanaActiva={setPestanaActiva} proyecto={proyecto} tareas={tareas} tareasCompletas={tareasCompletas} />

                    {pestanaActiva === 'tareas' && (<TablaTareas tareas={tareas} setTareas={setTareas} miembros={miembros} setMiembros={setMiembros} />)}
                    {pestanaActiva === 'dashboard' && (<DashboardRendimiento pestanaActiva={pestanaActiva} tareas={tareas} miembros={miembros} setTareas={setTareas} setMiembros={setMiembros} />)}
                </section>

                <section className="panel-recursos">
                    <Recursos />
                </section>
            </main>
        </>
    )
}

export default Panel