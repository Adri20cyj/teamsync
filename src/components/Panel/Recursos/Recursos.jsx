import "./Recursos.css"
import ItemRecurso from "./ItemRecurso"


const Recursos = () => {

    return (
        <>
            <div class="recursos-principal">
                <h2>Recursos</h2>
                <div class="contenedor-recursos">
                    <div class="recursos">
                        {/*Recursos temporales:: */}
                        <ItemRecurso nombre="Informe" url="https://docs.google.com/document/d/1Senkqzwf_5RDin20jHBswYaRI3N7V_7-9MRoe5E1Vp0/edit?hl=es&tab=t.0" />
                        <ItemRecurso nombre="Drive Compartido" url="https://drive.google.com/drive/folders/1SGkkP9Tb7_vZcPH2_o-wlX162VLb4oG_?hl=es" />
                    </div>

                    <div class="ingresar-recurso">
                        <div class="nombre-recurso">
                            <p> Nombre del recurso </p>
                            <input class="input-nombre" type="text" placeholder="Nombre del recurso" />
                        </div>
                        <div class="contenedor-url-grande">
                            <p> URL del recurso </p>
                            <div class="contenedor-url">
                                <input class="input-url" type="url" placeholder="URL del recurso" />
                                <button class="añadir"> + </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Recursos



