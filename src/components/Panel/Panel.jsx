import { useState } from "react"
import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"
import DashboardRendimiento from "./DashboardRendimiento/DashboardRendimiento"
import { useAuth } from "../../context/AuthContext";

const Panel = ({ onVolver, proyecto }) => {
    const { usuarioActual } = useAuth();
    const [pestanaActiva, setPestanaActiva] = useState('tareas');

    const [tareas, setTareas] = useState(usuarioActual?.tareas || []);

    const storedMiembros = localStorage.getItem('miembros');
    const [miembros, setMiembros] = useState(JSON.parse(storedMiembros) || []);

    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (
        <>
            <Header setPestanaActiva={setPestanaActiva} onVolver={onVolver} />
            <main>
                <section className="panel-tareas">
                    <ResumenProyecto setPestanaActiva={setPestanaActiva} proyecto={proyecto} tareas={tareas} tareasCompletas={tareasCompletas} />

                    {pestanaActiva === 'tareas' && (<TablaTareas tareas={tareas} setTareas={setTareas} miembros={miembros} setMiembros={setMiembros} />)}
                    {pestanaActiva === 'dashboard' && (<DashboardRendimiento pestanaActiva={pestanaActiva} tareas={tareas} miembros={miembros} setMiembros={setMiembros} />)}
                </section>

                <section className="panel-recursos">
                    <Recursos />
                </section>
            </main>
        </>
    )
}

export default Panel
