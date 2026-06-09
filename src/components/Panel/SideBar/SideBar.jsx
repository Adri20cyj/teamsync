import React from "react";
import "./Sidebar.css";

// SVG Icons
const IconHome = () => (
    <svg className="icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

const IconCalendar = () => (
    <svg className="icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
    </svg>
);

const IconBell = () => (
    <svg className="icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
);

const IconFolder = () => (
    <svg className="icon-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
);

const IconChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
);

const IconChevronRight = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
);

const IconLogout = () => (
    <svg className="icon-svg red-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
);

const IconStack = () => (
    <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 16.54l-7.37-3.73L3 13.78l9 4.96 9-4.96-1.63-.97L12 16.54zm0-9.22l7.25 3.67L21 10.02l-9-4.95-9 4.95 1.75.97L12 7.32zM12 2L3 6.95l9 4.95 9-4.95L12 2z" />
    </svg>
);

const Sidebar = ({
    colapsado,
    setColapsado,
    usuarioActual,
    proyectos = [],
    onSelectProyecto,
    onNavigateToProyectos,
    onNavigateToCalendario,
    onNavigateToCarga,
    onOpenNotifications,
    onLogout,
    proyectoSeleccionado
}) => {

    // Obtener inicial del usuario
    const inicialesUsuario = usuarioActual
        ? `${usuarioActual.nombre?.[0] ?? ''}${usuarioActual.apellido?.[0] ?? ''}`.toUpperCase()
        : 'U';

    const getProgresoProyecto = (proyecto) => {
        const tareas = proyecto.tareas || [];
        if (tareas.length === 0) return 0;
        const completadas = tareas.filter(t => t.check).length;
        return Math.round((completadas / tareas.length) * 100);
    };

    return (
        <aside className={`app-sidebar ${colapsado ? "colapsado" : "expandido"}`}>
            {/* Header del Sidebar */}
            <div className="sidebar-header">
                <div className="logo-section">
                    <div className="logo-box">
                        <IconFolder />
                    </div>
                    {!colapsado && (
                        <div className="logo-text">
                            <h3>TeamSync</h3>
                            <span>CLICKUP EDITION</span>
                        </div>
                    )}
                </div>
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setColapsado(!colapsado)}
                    title={colapsado ? "Expandir Sidebar" : "Colapsar Sidebar"}
                >
                    {colapsado ? <IconChevronRight /> : <IconChevronLeft />}
                </button>
            </div>

            {/* Contenedor de Scroll de Items */}
            <div className="sidebar-scroll-content">
                {/* Sección de Navegación */}
                <div className="sidebar-section">
                    {!colapsado && <h5 className="section-title">Navegación</h5>}
                    <ul className="nav-list">
                        <li
                            onClick={onNavigateToProyectos}
                            className={`nav-item ${!proyectoSeleccionado ? "activo" : ""}`}
                            title="Inicio & Proyectos"
                        >
                            <IconHome />
                            {!colapsado && <span>Inicio & Proyectos</span>}
                        </li>
                        <li
                            onClick={onNavigateToCalendario}
                            className="nav-item"
                            title="Calendario General"
                        >
                            <IconCalendar />
                            {!colapsado && <span>Calendario General</span>}
                        </li>
                        <li
                            onClick={onOpenNotifications}
                            className="nav-item"
                            title="Notificaciones"
                        >
                            <IconBell />
                            {!colapsado && <span>Notificaciones</span>}
                        </li>
                    </ul>
                </div>

                {/* Sección de Espacios / Proyectos */}
                <div className="sidebar-section">
                    {!colapsado ? (
                        <div className="section-title-container">
                            <h5 className="section-title">Múltiples Espacios ({proyectos.length})</h5>
                            <span className="section-badge">COURSES</span>
                        </div>
                    ) : (
                        <div className="sidebar-separator">
                            <IconStack />
                        </div>
                    )}

                    <div className="projects-list-sidebar">
                        {proyectos.map((p) => {
                            const seleccionado = proyectoSeleccionado && proyectoSeleccionado.id === p.id;
                            const inicial = p.title ? p.title.charAt(0).toUpperCase() : "P";
                            const progreso = getProgresoProyecto(p);

                            return (
                                <div
                                    key={p.id}
                                    className={`sidebar-project-card ${seleccionado ? "seleccionado" : ""}`}
                                    onClick={() => onSelectProyecto(p)}
                                    title={`${p.title} (${progreso}% completado)`}
                                >
                                    <div className="project-avatar-sidebar">
                                        {inicial}
                                    </div>
                                    {!colapsado && (
                                        <div className="project-info-sidebar">
                                            <div className="project-name-row">
                                                <h4>{p.title}</h4>
                                            </div>
                                            <p>{p.description || "Proyecto Libre"}</p>

                                            {/* Barra de progreso miniatura */}
                                            <div className="sidebar-progress-container">
                                                <div className="sidebar-progress-bar">
                                                    <div
                                                        className="sidebar-progress-fill"
                                                        style={{ width: `${progreso}%` }}
                                                    ></div>
                                                </div>
                                                <span className="sidebar-progress-text">{progreso}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer / Perfil */}
            <div className="sidebar-footer">
                <div className="user-profile-sidebar">
                    <div className="user-avatar-circle">
                        {inicialesUsuario}
                    </div>
                    {!colapsado && (
                        <div className="user-info-text">
                            <h4>{usuarioActual?.nombre || usuarioActual?.email || "Usuario"}</h4>
                            <span>Estudiante verificado</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    className={`logout-sidebar-btn ${colapsado ? "btn-colapsado" : "btn-expandido"}`}
                    title="Cerrar Sesión"
                >
                    <IconLogout />
                    {!colapsado && <span>CERRAR SESIÓN</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
