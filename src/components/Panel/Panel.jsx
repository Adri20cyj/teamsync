import { useState, useMemo } from "react"
import Header from "./Header/Header"
import ResumenProyecto from "./ResumenProyecto/ResumenProyecto"
import Recursos from "./Recursos/Recursos"
import TablaTareas from "./TablaTareas/TablaTareas"
import "./Panel.css"
import DashboardRendimiento from "./DashboardRendimiento/DashboardRendimiento"
import { useAuth } from "../../context/AuthContext";

const Panel = ({ onVolver, proyecto }) => {
    const { usuarioActual, obtenerUsuarios } = useAuth();
    const [pestanaActiva, setPestanaActiva] = useState('tareas');

    // 1. CAMBIO CRÍTICO: Buscamos el proyecto fresco directamente desde el usuario activo
    const proyectoSincronizado = usuarioActual?.proyectos?.find(p => p.id === proyecto.id) || proyecto;

    // 2. Extraemos las tareas directo del proyecto sincronizado (SIN useState)
    const tareas = proyectoSincronizado?.tareas || [];

    // 3. Derivamos los miembros del grupo: todos los usuarios que tienen este proyecto
    const miembros = useMemo(() => {
        const todosUsuarios = obtenerUsuarios();
        return todosUsuarios
            .filter(u => u.proyectos?.some(p => p.id === proyectoSincronizado.id))
            .map((u, i) => ({ id: i + 1, email: u.email, nombre: u.nombre, apellido: u.apellido }));
    }, [proyectoSincronizado.id]);

    const tareasCompletas = tareas.filter(tarea => tarea.check);

    return (
        <div className="panel-wrapper">
            <Header setPestanaActiva={setPestanaActiva} onVolver={onVolver} />
            <div className="panel-body">
                <section className="panel-tareas">
                    <ResumenProyecto setPestanaActiva={setPestanaActiva} proyecto={proyectoSincronizado} tareas={tareas} tareasCompletas={tareasCompletas} />

                    {pestanaActiva === 'tareas' && (
                        <TablaTareas
                            miembros={miembros}
                            proyecto={proyectoSincronizado}
                        />
                    )}
                    {pestanaActiva === 'dashboard' && (
                        <DashboardRendimiento
                            pestanaActiva={pestanaActiva}
                            tareas={tareas}
                            miembros={miembros}
                        />
                    )}
                </section>

                <section className="panel-recursos">
                    <Recursos proyecto={proyectoSincronizado} />
                </section>
            </div>
        </div>
    )
}

export default Panel;