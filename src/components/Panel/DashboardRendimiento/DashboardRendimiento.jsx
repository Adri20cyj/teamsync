import { useState } from 'react'
import {motion} from 'framer-motion'

import './DashboardRendimiento.css'
import AvanceGeneral from './AvanceGeneral/AvanceGeneral'
import AvanceIntegrante from './AvanceIntegrante/AvanceIntegrante'

const DashboardRendimiento= ({pestanaActiva, tareas =[], miembros =[]}) => {

    const totalTareas = tareas.length;
    const totalMiembros = miembros?.length || 0;
    const tareasCompletadas = tareas ? tareas.filter(tarea => tarea.estaTerminada).length : 0;
    const tareasPendientes = totalTareas - tareasCompletadas;
    const progreso = tareas && tareas.length > 0 ? Math.round((tareasCompletadas / tareas.length) * 100) : 0;
    /*const progreso = 50;Probar funcionalidad del circulito con ese valor*/
    
    const cargasTrabajo = miembros.map(m => {
        const tMiembro = tareas.filter(t => t.asignado === m.email);
        return {
            email: m.email,
            total: tMiembro.length,
            completado: tMiembro.filter(t => t.estaTerminada).length
        };
    });
    


    return (
        <>
            {pestanaActiva === 'dashboard' && (
                <motion.section 
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="dashboard-contenedor" 
                >
                    <div className="dashboard-header"> 
                        <div>
                            <h2 className="dashboard-titulo">Dashboard de Rendimiento</h2>
                            <span className="dashboard-subtitulo">Avance del Proyecto y Estadísticas del Equipo</span>
                        </div>

                    </div>

                    <AvanceGeneral progreso={progreso} totalTareas={totalTareas} totalMiembros={totalMiembros} tareasCompletadas={tareasCompletadas} tareasPendientes={tareasPendientes} />
                    <AvanceIntegrante miembros={miembros} cargasTrabajo={cargasTrabajo} tareas={tareas}/>
                    /* */
                    /* */

                </motion.section>
            )}

        </>

    )
}
export default DashboardRendimiento