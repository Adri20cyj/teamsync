import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [adminActual, setAdminActual] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Cargar sesión guardada al iniciar
    useEffect(() => {
        const sesionUsuario = localStorage.getItem('usuarioActual');
        const sesionAdmin = localStorage.getItem('adminActual');
        if (sesionUsuario) setUsuarioActual(JSON.parse(sesionUsuario));
        if (sesionAdmin) setAdminActual(JSON.parse(sesionAdmin));
        setCargando(false);
    }, []);

    // Obtener lista de usuarios registrados
    const obtenerUsuarios = () => {
        const usuarios = localStorage.getItem('usuarios');
        return usuarios ? JSON.parse(usuarios) : [];
    };

    // Registrar nuevo usuario
    const registrarUsuario = (datosUsuario) => {
        const usuarios = obtenerUsuarios();
        const existeEmail = usuarios.find(u => u.email === datosUsuario.email);
        if (existeEmail) {
            return { exito: false, mensaje: 'Ya existe una cuenta con ese correo.' };
        }
        const nuevoUsuario = {
            id: Date.now(),
            nombre: datosUsuario.nombre,
            apellido: datosUsuario.apellido,
            email: datosUsuario.email,
            contrasena: datosUsuario.contrasena,
            activo: true,
            fechaRegistro: new Date().toLocaleDateString('es-ES'),
            proyectos: []
        };
        const usuariosActualizados = [...usuarios, nuevoUsuario];
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));
        return { exito: true };
    };

    // Iniciar sesión usuario
    const iniciarSesion = (email, contrasena) => {
        const emailLimpio = email.trim().toLowerCase();
        const contraseneLimpia = contrasena.trim();
        const usuarios = obtenerUsuarios();

        const usuario = usuarios.find(u => u.email.toLowerCase() === emailLimpio && u.contrasena === contraseneLimpia);
        if (!usuario) return { exito: false, mensaje: 'Correo o contraseña incorrectos.' };
        if (!usuario.activo) return { exito: false, mensaje: 'Tu cuenta está desactivada. Contacta al administrador.' };

        const sesion = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            fechaRegistro: usuario.fechaRegistro,
            proyectos: usuario.proyectos || []
        };
        setUsuarioActual(sesion);
        localStorage.setItem('usuarioActual', JSON.stringify(sesion));
        return { exito: true };
    };


    const actualizarContenidoProyecto = (proyectoId, nuevasTareas, nuevosRecursos) => {
        if (!usuarioActual || !usuarioActual.proyectos) return;

        // 1. Recorremos los proyectos del usuario y modificamos SOLO el proyecto actual
        const proyectosActualizados = usuarioActual.proyectos.map(p => {
            if (p.id === proyectoId) {
                const totalTareas = nuevasTareas.length;
                const tareasCompletas = nuevasTareas.filter(t => t.check).length;
                const progreso = totalTareas > 0 ? Math.round((tareasCompletas / totalTareas) * 100) : 0;
                return {
                    ...p,
                    tareas: nuevasTareas,
                    recursos: nuevosRecursos,
                    tasksTotal: totalTareas,
                    tasksCompleted: tareasCompletas,
                    progress: progreso
                };
            }
            return p; // Los demás proyectos se quedan intactos
        });

        // 2. Usamos tu función existente para guardar el bloque completo de proyectos
        actualizarProyectosUsuario(proyectosActualizados);
    };

    const actualizarProyectosUsuario = (nuevosProyectos) => {
        if (!usuarioActual) return;

        // 1. Actualizar en la lista maestra de todos los usuarios
        const usuarios = obtenerUsuarios();
        const usuariosActualizados = usuarios.map(u => {
            if (u.id === usuarioActual.id) {
                return { ...u, proyectos: nuevosProyectos };
            }
            return u;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosActualizados));

        // 2. Actualizar la sesión activa
        const sesionActualizada = { ...usuarioActual, proyectos: nuevosProyectos };
        setUsuarioActual(sesionActualizada);
        localStorage.setItem('usuarioActual', JSON.stringify(sesionActualizada));
    };

    // Cerrar sesión usuario
    const cerrarSesion = () => {
        setUsuarioActual(null);
        localStorage.removeItem('usuarioActual');
    };

    // Iniciar sesión administrador (interno)
    const iniciarSesionAdmin = (email, contrasena) => {
        const ADMIN_EMAIL = 'admin@teamsync.com';
        const ADMIN_CONTRASENA = 'Admin123';
        const emailLimpio = email.trim().toLowerCase();
        const contrasenaLimpia = contrasena.trim();
        if (emailLimpio === ADMIN_EMAIL && contrasenaLimpia === ADMIN_CONTRASENA) {
            const sesionAdmin = { email: ADMIN_EMAIL, nombre: 'Administrador' };
            setAdminActual(sesionAdmin);
            localStorage.setItem('adminActual', JSON.stringify(sesionAdmin));
            return { exito: true };
        }
        return { exito: false };
    };

    // Login unificado: detecta automáticamente si es admin o usuario
    const login = (email, contrasena) => {
        // Primero verifica si son credenciales de administrador
        const resultadoAdmin = iniciarSesionAdmin(email, contrasena);
        if (resultadoAdmin.exito) {
            return { exito: true, tipo: 'admin' };
        }
        // Si no, intenta como usuario normal
        const resultadoUsuario = iniciarSesion(email, contrasena);
        if (resultadoUsuario.exito) {
            return { exito: true, tipo: 'usuario' };
        }
        return { exito: false, mensaje: resultadoUsuario.mensaje };
    };

    // Cerrar sesión administrador
    const cerrarSesionAdmin = () => {
        setAdminActual(null);
        localStorage.removeItem('adminActual');
    };

    // Activar / desactivar usuario (acción del admin)
    const toggleEstadoUsuario = (idUsuario) => {
        const usuarios = obtenerUsuarios();
        const actualizados = usuarios.map(u =>
            u.id === idUsuario ? { ...u, activo: !u.activo } : u
        );
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
    };

    // Cambiar contraseña de usuario (acción del admin)
    const cambiarContrasenaUsuario = (idUsuario, nuevaContrasena) => {
        const usuarios = obtenerUsuarios();
        const actualizados = usuarios.map(u =>
            u.id === idUsuario ? { ...u, contrasena: nuevaContrasena } : u
        );
        localStorage.setItem('usuarios', JSON.stringify(actualizados));
    };

    return (
        <AuthContext.Provider value={{
            usuarioActual,
            adminActual,
            cargando,
            login,
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            iniciarSesionAdmin,
            cerrarSesionAdmin,
            obtenerUsuarios,
            toggleEstadoUsuario,
            cambiarContrasenaUsuario,
            actualizarProyectosUsuario,
            actualizarContenidoProyecto
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
