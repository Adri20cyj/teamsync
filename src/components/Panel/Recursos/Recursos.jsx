import { useState } from "react";
import "./Recursos.css"
import AgregarRecurso from "./AgregarRecurso"
import ItemRecurso from "./ItemRecurso"


const Recursos = () => {
    const [recursos, setRecursos] = useState([
    ]);

    const agregarRecurso = (nuevoRecurso) => {
        const recursoConId = {
            ...nuevoRecurso,
            id: Date.now()
        };

        setRecursos([...recursos, recursoConId]);
    };

    const eliminarRecurso = (id) => {

        setRecursos(recursos.filter(recurso => recurso.id !== id));

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



