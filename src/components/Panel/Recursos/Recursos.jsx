import { useState } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"
import { useAuth } from "../../../context/AuthContext";


const Recursos = ({ proyecto }) => {
    const { usuarioActual, actualizarContenidoProyecto } = useAuth();
    const [recursos, setRecursos] = useState(proyecto?.recursos || []);

    const agregarRecurso = (nuevoRecurso) => {

        const recursosActualizados = [...recursos, nuevoRecurso];
        setRecursos(recursosActualizados);

        const tareasActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.tareas || [];
        actualizarContenidoProyecto(proyecto.id, tareasActuales, recursosActualizados);
    };

    const eliminarRecurso = (id) => {
        setRecursos(recursosActualizados);
        const tareasActuales = usuarioActual?.proyectos?.find(p => p.id === proyecto.id)?.tareas || [];
        actualizarContenidoProyecto(proyecto.id, tareasActuales, recursosActualizados);

    }



    return (
        <>
            <div class="recursos-principal">
                <h2>Recursos</h2>
                <div class="contenedor-recursos">
                    <div class="recursos">
                        {recursos.map((recurso) => (
                            <ItemRecurso
                                id={recurso.id}
                                nombre={recurso.nombre}
                                url={recurso.url}
                                eliminarRecurso={eliminarRecurso}
                            />
                        ))}
                    </div>

                    <AgregarRecurso onAgregarRecurso={agregarRecurso} />
                </div>
            </div>
        </>
    )
}
export default Recursos



