import { useState } from "react";
import { Link } from "react-router-dom";
import "./EspacioTrabajo.css";
import { PlusIcon, UserIcon } from "./Icons/Icons";
import CrearProyectoModal from "./CrearProyectoModal/CrearProyectoModal";
import ProyectosGrid from "./ProyectosGrid/ProyectosGrid";
import UnirseGrupoModal from "./UnirseGrupoModal/UnirseGrupoModal";

const EspacioTrabajo = ({ onSelectProyecto, usuarioActual }) => {
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
    const [mostrarUnirseModal, setMostrarUnirseModal] = useState(false);
    const [codigoInvitacion, setCodigoInvitacion] = useState("");

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

    const formatReadableDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const handleCreateProyecto = (e) => {
        e.preventDefault();
        if (!nuevoProyecto.title) return;

        const projectTag = nuevoProyecto.tag 
            ? nuevoProyecto.tag.toUpperCase() 
            : (nuevoProyecto.title ? nuevoProyecto.title.split(' ').map(w => w[0]).join('').slice(0, 5).toUpperCase() : "GRUPO");

        const project = {
            id: Date.now(),
            title: nuevoProyecto.title,
            tag: projectTag,
            description: nuevoProyecto.description || "Sin descripción disponible.",
            progress: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            membersCount: parseInt(nuevoProyecto.membersCount) || 1,
            startDate: formatReadableDate(nuevoProyecto.startDate) || "Hoy",
            endDate: formatReadableDate(nuevoProyecto.endDate) || "Por definir",
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

    const handleJoinGrupo = (e) => {
        e.preventDefault();
        if (!codigoInvitacion.trim()) return;

        const options = { day: 'numeric', month: 'short' };
        const todayStr = new Date().toLocaleDateString('es-ES', options);

        const project = {
            id: Date.now(),
            title: `Proyecto Unido (${codigoInvitacion.toUpperCase()})`,
            tag: "UNIDO",
            description: `Grupo unido mediante código de invitación: ${codigoInvitacion.toUpperCase()}`,
            progress: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            membersCount: 2,
            startDate: todayStr,
            endDate: "Por definir",
            iconType: "education"
        };

        setProyectos([...proyectos, project]);
        setCodigoInvitacion("");
        setMostrarUnirseModal(false);
    };

    // Iniciales para el mini-avatar
    const inicialesUsuario = usuarioActual
        ? `${usuarioActual.nombre?.[0] ?? ''}${usuarioActual.apellido?.[0] ?? ''}`.toUpperCase()
        : '';

    return (
        <div className="espacio-trabajo-container">
            <div className="espacio-trabajo-header">
                <div className="header-text-container">
                    <h1 className="proyectos-titulo">Tus Proyectos</h1>
                    <p className="proyectos-subtitulo">
                        {usuarioActual ? `Bienvenido, ${usuarioActual.nombre}. ` : ''}
                        Gestiona, organiza tareas y sincroniza el trabajo grupal de tus cursos u organizaciones.
                    </p>
                </div>
                <div className="header-acciones">
                    <button className="boton-crear-proyecto" onClick={() => setMostrarModal(true)}>
                        <PlusIcon />
                        <span>Nuevo Grupo</span>
                    </button>
                    <button className="boton-unirse-grupo" onClick={() => setMostrarUnirseModal(true)}>
                        <UserIcon />
                        <span>Unirse con Código</span>
                    </button>
                    {usuarioActual && (
                        <Link to="/perfil" className="avatar-usuario-header" id="ir-perfil" title="Ver mi perfil">
                            <span className="avatar-iniciales">{inicialesUsuario}</span>
                        </Link>
                    )}
                </div>
            </div>

            <div className="proyectos-divider"></div>

            <ProyectosGrid
                proyectos={proyectos}
                onSelectProyecto={onSelectProyecto}
            />

            <CrearProyectoModal
                mostrarModal={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onSubmit={handleCreateProyecto}
                nuevoProyecto={nuevoProyecto}
                onInputChange={handleInputChange}
            />

            <UnirseGrupoModal
                mostrarModal={mostrarUnirseModal}
                onClose={() => setMostrarUnirseModal(false)}
                onSubmit={handleJoinGrupo}
                codigo={codigoInvitacion}
                onCodigoChange={setCodigoInvitacion}
            />
        </div>
    );
};

export default EspacioTrabajo;
