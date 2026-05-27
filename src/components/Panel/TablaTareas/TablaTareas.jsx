
import ItemTarea from "./ItemTarea"

import "./TablaTareas.css"

const TablaTareas = () => {


    return (
        <div class="tabla-tareas">
            <div class="tabla-titulo">
                <h2>Lista de Tareas</h2>
                <div class="pendientes">
                    # pendientes
                </div>
            </div>

            <div class="lista-tareas">
                <ItemTarea titulo="Coordinar reunion con el contacto" asignado="Alumno 1" />

                <ItemTarea titulo="Escribir el capitulo I del informe" asignado="Alumno 2" />
                <ItemTarea titulo="Investigar sobre la metodologia" asignado="Alumno 3" />
                <ItemTarea titulo="Diseñar la encuesta para el cliente" asignado="Alumno 4" />

            </div>

            <div class="ingresar-tarea">
                <div class="selector-alumnos">
                    <p> Asignado a: </p>
                    <select class="selector">
                        <option>Todos</option>
                        <option>Alumno 1</option>
                        <option>Alumno 2</option>
                        <option>Alumno 3</option>
                    </select>
                </div>

                <input type="text" placeholder="Escribe una tarea..." />
                <button class="añadir-tarea"> + </button>
            </div>
        </div>
    )
}

export default TablaTareas

