import React from "react";
import "./GrupoCreado.css";
import { GraduationIcon, BookIcon, ArrowRightIcon, UserIcon, CalendarIcon, CodeIcon, DesignIcon } from "../Icons/Icons";

const GrupoCreado = ({ proyecto, onSelectProyecto }) => {
    const getIcon = (type) => {
        switch (type) {
            case "code":
                return <CodeIcon />;
            case "design":
                return <DesignIcon />;
            case "education":
            default:
                return <GraduationIcon />;
        }
    };

    return (
        <div className="proyecto-card">
            <div className="proyecto-card-header">
                <div className="proyecto-icon-wrapper">
                    {getIcon(proyecto.iconType)}
                </div>
                <button
                    onClick={() => onSelectProyecto && onSelectProyecto(proyecto)}
                    className="ver-workspace-btn"
                >
                    <span>VER PROYECTO</span>
                    <ArrowRightIcon />
                </button>
            </div>

            <h2 className="proyecto-card-titulo">{proyecto.title}</h2>

            <div className="proyecto-tag-badge">
                <BookIcon />
                <span>{proyecto.tag}</span>
            </div>

            <p className="proyecto-card-desc">{proyecto.description}</p>

            <div className="proyecto-logros-seccion">
                <div className="logros-labels">
                    <span className="logros-titulo">LOGROS DEL EQUIPO</span>
                    <span className="logros-valor">
                        {proyecto.progress}% ({proyecto.tasksCompleted}/{proyecto.tasksTotal})
                    </span>
                </div>
                <div className="progreso-barra-track">
                    <div
                        className="progreso-barra-fill"
                        style={{ width: `${proyecto.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="proyecto-card-divider"></div>

            <footer>
                <div className="footer-miembros">
                    <UserIcon />
                    <span>
                        {proyecto.membersCount} {proyecto.membersCount === 1 ? "Miembro" : "Miembros"}
                    </span>
                </div>
                <div className="footer-fechas">
                    <CalendarIcon />
                    <span>
                        {proyecto.startDate} - {proyecto.endDate}
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default GrupoCreado;
