import { useState } from "react";
import "./EspacioTrabajo.css";
import { PlusIcon, CloseIcon } from "./Icons/Icons";
import GrupoCreado from "./GrupoCreado/GrupoCreado";


const EspacioTrabajo = ({ onSelectProyecto }) => {
    const [proyectos, setProyectos] = useState([
        {
            id: 2,
            title: "Desarrollo Web",
            tag: "PROG-WEB",
            description: "Creación de la plataforma TeamSync",
            progress: 60,
            tasksCompleted: 3,
            tasksTotal: 5,
            membersCount: 3,
            startDate: "15 mar",
            endDate: "20 jun",
            iconType: "code"
        },
    ]);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoProyecto, setNuevoProyecto] = useState({
        title: "",
        tag: "",
        description: "",
        iconType: "education",
        membersCount: 1,
        startDate: "",
        endDate: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProyecto({
            ...nuevoProyecto,
            [name]: value
        });
    };

    const handleCreateProyecto = (e) => {
        e.preventDefault();
        if (!nuevoProyecto.title || !nuevoProyecto.tag) return;

        const project = {
            title: nuevoProyecto.title,
            tag: nuevoProyecto.tag.toUpperCase(),
            description: nuevoProyecto.description || "Sin descripción disponible.",
            progress: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            membersCount: parseInt(nuevoProyecto.membersCount) || 1,
            startDate: nuevoProyecto.startDate || "Hoy",
            endDate: nuevoProyecto.endDate || "Por definir",
            iconType: nuevoProyecto.iconType
        };

        setProyectos([...proyectos, project]);
        setMostrarModal(false);
        setNuevoProyecto({
            title: "",
            tag: "",
            description: "",
            iconType: "education",
            membersCount: 1,
            startDate: "",
            endDate: ""
        });
    };

    return (
        <div className="espacio-trabajo-container">
            <div className="espacio-trabajo-header">
                <div className="header-text-container">
                    <h1 className="proyectos-titulo">Tus Proyectos</h1>
                    <p className="proyectos-subtitulo">
                        Gestiona, organiza tareas y sincroniza el trabajo grupal de tus cursos u organizaciones.
                    </p>
                </div>
                <button className="boton-crear-proyecto" onClick={() => setMostrarModal(true)}>
                    <PlusIcon />
                    <span>Crear Proyecto</span>
                </button>
            </div>

            <div className="proyectos-divider"></div>

            <div className="proyectos-grid">
                {proyectos.map((proyecto) => (
                    <GrupoCreado
                        key={proyecto.id}
                        proyecto={proyecto}
                        onSelectProyecto={onSelectProyecto}
                    />
                ))}
            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Crear Nuevo Proyecto</h2>
                            <button className="modal-close-btn" onClick={() => setMostrarModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProyecto} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="title">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    placeholder="Ej. Curso de Estructura de Datos"
                                    value={nuevoProyecto.title}
                                    onChange={handleInputChange}
                                />
                            </div>


                            <div className="form-group">
                                <label htmlFor="description">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="3"
                                    placeholder="Describe brevemente el propósito de este proyecto..."
                                    value={nuevoProyecto.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="startDate">Fecha Inicio</label>
                                    <input
                                        type="text"
                                        id="startDate"
                                        name="startDate"
                                        placeholder="Ej. 10 nov"
                                        value={nuevoProyecto.startDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endDate">Fecha Fin</label>
                                    <input
                                        type="text"
                                        id="endDate"
                                        name="endDate"
                                        placeholder="Ej. 21 feb"
                                        value={nuevoProyecto.endDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="membersCount">Cantidad de Miembros</label>
                                <input
                                    type="number"
                                    id="membersCount"
                                    name="membersCount"
                                    min="1"
                                    value={nuevoProyecto.membersCount}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-crear">
                                    Crear Proyecto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EspacioTrabajo;
