import { useState } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"
import { useAuth } from "../../../context/AuthContext";


const Recursos = () => {

    const { usuarioActual, actualizarDatosUsuario } = useAuth();

    const [recursos, setRecursos] = useState(usuarioActual?.recursos || []);

    const agregarRecurso = (nuevoRecurso) => {
        const recursosActualizados = [...recursos, nuevoRecurso];
        localStorage.setItem("recursos", JSON.stringify(recursosActualizados));
        setRecursos(recursosActualizados);
        actualizarDatosUsuario(usuarioActual?.tareas || [], recursosActualizados);
    };

    const eliminarRecurso = (id) => {
        const recursosActualizados = recursos.filter(recurso => recurso.id !== id);
        setRecursos(recursosActualizados);
        actualizarDatosUsuario(usuarioActual?.tareas || [], recursosActualizados);
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



