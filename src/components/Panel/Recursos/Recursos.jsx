import { useState } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"


const Recursos = () => {

    const recursosGuardados = localStorage.getItem("recursos");
    const [recursos, setRecursos] = useState(JSON.parse(recursosGuardados) || []);

    const agregarRecurso = (nuevoRecurso) => {
        const recursosActualizados = [...recursos, nuevoRecurso];
        localStorage.setItem("recursos", JSON.stringify(recursosActualizados));
        setRecursos(recursosActualizados);
    };

    const eliminarRecurso = (id) => {
        const recursosActualizados = recursos.filter(recurso => recurso.id !== id);
        localStorage.setItem("recursos", JSON.stringify(recursosActualizados));
        setRecursos(recursosActualizados);

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



