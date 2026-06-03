import './SubTareaAlumno.css'
const SubTareaAlumno = ({ listaTareasMiembro=[], onToggle }) => { 
    return (
        <>
            <div className="db-subtareas-lista">
                <span className="db-mini-tag">Tareas asignadas:</span>
                
                {listaTareasMiembro.length > 0 ? (listaTareasMiembro.map(t => (
                    <div key={t.id} className="db-item-tarea">
                        
                        <span className={`db-tarea-desc ${t.estaTerminada ? 'line-through opacity-40' : ''}`}> {t.titulo}</span>
                        <button 
                                type="button"
                                className={`db-btn-estado ${t.estaTerminada ? 'completo' : 'pendiente'}`}
                                onClick={() => onToggle(t.id)} 
                            >
                                {t.estaTerminada ? "Completo" : "Pendiente"}
                        </button>
                        
                    </div>
                ))) : (<p className="db-sin-tareas">Sin tareas asignadas en este ciclo.</p>)}
            </div>        </>
    )
}
export default SubTareaAlumno
