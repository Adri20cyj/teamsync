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

    // 1. CAMBIO CRÍTICO: Buscamos el proyecto fresco directamente desde el usuario activo
    const proyectoSincronizado = usuarioActual?.proyectos?.find(p => p.id === proyecto.id) || proyecto;

    // 2. Extraemos las tareas directo del proyecto sincronizado (SIN useState)
    const tareas = proyectoSincronizado?.tareas || [];

    const storedMiembros = localStorage.getItem('miembros');
    const [miembros, setMiembros] = useState(JSON.parse(storedMiembros) || []);

    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (
        <>
            <Header setPestanaActiva={setPestanaActiva} onVolver={onVolver} />
            <main>
                <section className="panel-tareas">
                    <ResumenProyecto setPestanaActiva={setPestanaActiva} proyecto={proyectoSincronizado} tareas={tareas} tareasCompletas={tareasCompletas} />

                    {pestanaActiva === 'tareas' && (
                        <TablaTareas
                            miembros={miembros}
                            setMiembros={setMiembros}
                            proyecto={proyectoSincronizado}
                        />
                    )}
                    {pestanaActiva === 'dashboard' && (
                        <DashboardRendimiento
                            pestanaActiva={pestanaActiva}
                            tareas={tareas}
                            miembros={miembros}
                            setMiembros={setMiembros}
                        />
                    )}
                </section>

                <section className="panel-recursos">
                    <Recursos proyecto={proyectoSincronizado} />
                </section>
            </main>
        </>
    )
}

export default Panel;