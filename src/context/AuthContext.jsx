import { createContext, useContext, useEffect, useState } from 'react';
import {
    getUsuarios,
    registrarUsuario as registrarUsuarioApi,
    autenticarUsuario,
    actualizarUsuario,
    toggleEstadoAlumno,
    cambiarContrasenaAlumno
} from '../services/alumno.api.js';
import { adminLogin } from '../services/admin.service.js';
import {
    getProyectosByUsuario,
    crearProyecto,
    eliminarProyecto,
    unirseGrupoPorCodigo as unirseGrupoPorCodigoApi,
    salirDeGrupo as salirDeGrupoApi,
    quitarMiembro as quitarMiembroApi,
    sincronizarTareas,
    sincronizarRecursos,
    actualizarProyecto
} from '../services/proyecto.service.js';

const AuthContext = createContext(null);

const USER_SESSION_KEY = 'usuarioActual';
const ADMIN_SESSION_KEY = 'adminActual';
const USERS_CACHE_KEY = 'usuarios';

const readJson = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

const writeJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const formatReadableDate = (dateStr) => {
    if (!dateStr) return '';
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    if (Number.isNaN(date.getTime())) return dateStr;
    return `${date.getDate()} ${months[date.getMonth()]}`;
};

const generarCodigoGrupo = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 6; i += 1) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
};

const normalizarTarea = (tarea = {}) => ({
    ...tarea,
    id: tarea.id ?? Date.now(),
    titulo: tarea.titulo ?? tarea.title ?? tarea.nombre ?? '',
    descripcion: tarea.descripcion ?? tarea.description ?? '',
    asignado: tarea.asignado ?? tarea.assignedTo ?? tarea.responsable ?? 'Todos',
    fechaLimite: tarea.fechaLimite ?? tarea.dueDate ?? tarea.fecha ?? '',
    peso: toNumber(tarea.peso, 0),
    prioridad: tarea.prioridad ?? tarea.priority ?? 'Media',
    estado: tarea.estado ?? (tarea.check || tarea.estaTerminada ? 'ENVIADO' : 'PENDIENTE'),
    check: Boolean(tarea.check ?? tarea.estaTerminada ?? false),
    estaTerminada: Boolean(tarea.estaTerminada ?? tarea.check ?? false)
});

const normalizarRecurso = (recurso = {}) => ({
    ...recurso,
    id: recurso.id ?? Date.now(),
    nombre: recurso.nombre ?? recurso.title ?? '',
    url: recurso.url ?? recurso.enlace ?? '',
    categoria: recurso.categoria ?? recurso.type ?? 'url',
    esArchivo: Boolean(recurso.esArchivo ?? recurso.isFile ?? false),
    archivoNombre: recurso.archivoNombre ?? recurso.fileName ?? ''
});

const normalizarProyecto = (proyecto = {}) => {
    const tareas = Array.isArray(proyecto.tareas) ? proyecto.tareas.map(normalizarTarea) : [];
    const recursos = Array.isArray(proyecto.recursos) ? proyecto.recursos.map(normalizarRecurso) : [];
    const tareasCompletadas = tareas.filter((t) => t.check || t.estaTerminada).length;
    const totalTareas = proyecto.tasksTotal ?? proyecto.totalTareas ?? tareas.length;
    const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : toNumber(proyecto.progress, 0);

    return {
        id: proyecto.id ?? proyecto._id ?? Date.now(),
        title: proyecto.title ?? proyecto.nombre ?? 'Proyecto',
        tag: proyecto.tag ?? proyecto.codigo ?? proyecto.shortCode ?? 'GRUPO',
        description: proyecto.description ?? proyecto.descripcion ?? 'Sin descripción disponible.',
        progress: progreso,
        tasksCompleted: tareasCompletadas,
        tasksTotal: totalTareas,
        membersCount: toNumber(proyecto.membersCount ?? proyecto.miembrosCount ?? proyecto.totalMembers, 1),
        startDate: proyecto.startDate ?? formatReadableDate(proyecto.fechaInicio) ?? 'Hoy',
        endDate: proyecto.endDate ?? formatReadableDate(proyecto.fechaFin) ?? 'Por definir',
        startDateRaw: proyecto.startDateRaw ?? proyecto.fechaInicio ?? null,
        endDateRaw: proyecto.endDateRaw ?? proyecto.fechaFin ?? null,
        iconType: proyecto.iconType ?? proyecto.icono ?? 'education',
        tareas,
        recursos,
        codigo: proyecto.codigo ?? proyecto.inviteCode ?? proyecto.codigoInvitacion ?? generarCodigoGrupo(),
        creadorId: proyecto.creadorId ?? proyecto.ownerId ?? proyecto.userId ?? null
    };
};

const normalizarUsuario = (usuario = {}) => ({
    ...usuario,
    id: usuario.id ?? usuario._id ?? Date.now(),
    nombre: usuario.nombre ?? usuario.firstName ?? usuario.nombres ?? '',
    apellido: usuario.apellido ?? usuario.lastName ?? usuario.apellidos ?? '',
    email: usuario.email ?? usuario.correo ?? '',
    contrasena: usuario.contrasena ?? usuario.password ?? '',
    activo: usuario.activo ?? usuario.enabled ?? true,
    fechaRegistro: usuario.fechaRegistro ?? usuario.createdAt ?? '',
    proyectos: Array.isArray(usuario.proyectos)
        ? usuario.proyectos.map(normalizarProyecto)
        : Array.isArray(usuario.grupos)
            ? usuario.grupos.map(normalizarProyecto)
            : []
});

const cloneUsuario = (usuario) => normalizarUsuario(usuario);

const replaceUsuario = (lista, usuarioActualizado) => lista.map((usuario) => (
    usuario.id === usuarioActualizado.id ? cloneUsuario(usuarioActualizado) : usuario
));

const persistirUsuariosEnApi = (usuariosActualizados) => {
    void Promise.allSettled(
        usuariosActualizados.map((usuario) => actualizarUsuario(usuario.id, usuario))
    );
};

const persistirUsuarioEnApi = (usuario) => {
    void actualizarUsuario(usuario.id, usuario).catch(() => {});
};

const persistirProyectoEnApi = (proyectoId, payload) => {
    void actualizarProyecto(proyectoId, payload).catch(() => {});
};

export const AuthProvider = ({ children }) => {
    const [usuarioActual, setUsuarioActual] = useState(() => {
        const session = readJson(USER_SESSION_KEY, null);
        return session ? cloneUsuario(session) : null;
    });
    const [adminActual, setAdminActual] = useState(() => readJson(ADMIN_SESSION_KEY, null));
    const [usuarios, setUsuarios] = useState(() => readJson(USERS_CACHE_KEY, []));
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;

        const cargarDatos = async () => {
            const sesionUsuario = readJson(USER_SESSION_KEY, null);
            const sesionAdmin = readJson(ADMIN_SESSION_KEY, null);
            const usuariosCache = readJson(USERS_CACHE_KEY, []);

            if (sesionAdmin && activo) {
                setAdminActual(sesionAdmin);
            }

            if (sesionUsuario && activo) {
                setUsuarioActual(cloneUsuario(sesionUsuario));
            }

            try {
                const usuariosApi = await getUsuarios();
                if (!activo) return;

                const usuariosNormalizados = Array.isArray(usuariosApi) && usuariosApi.length > 0
                    ? usuariosApi.map(normalizarUsuario)
                    : usuariosCache.map(normalizarUsuario);

                setUsuarios(usuariosNormalizados);
                writeJson(USERS_CACHE_KEY, usuariosNormalizados);

                if (sesionUsuario) {
                    const usuarioSesion = usuariosNormalizados.find((usuario) => usuario.email === sesionUsuario.email)
                        || cloneUsuario(sesionUsuario);
                    setUsuarioActual(usuarioSesion);
                    writeJson(USER_SESSION_KEY, usuarioSesion);
                }
            } catch {
                if (!activo) return;
                const usuariosNormalizados = usuariosCache.map(normalizarUsuario);
                setUsuarios(usuariosNormalizados);

                if (sesionUsuario) {
                    setUsuarioActual(cloneUsuario(sesionUsuario));
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        cargarDatos();

        return () => {
            activo = false;
        };
    }, []);

    const obtenerUsuarios = () => usuarios;

    const actualizarUsuarios = (usuariosActualizados, usuarioSesionActualizada = null) => {
        const normalizados = usuariosActualizados.map(normalizarUsuario);
        setUsuarios(normalizados);
        writeJson(USERS_CACHE_KEY, normalizados);
        persistirUsuariosEnApi(normalizados);

        if (usuarioSesionActualizada) {
            const sesionNormalizada = cloneUsuario(usuarioSesionActualizada);
            setUsuarioActual(sesionNormalizada);
            writeJson(USER_SESSION_KEY, sesionNormalizada);
        } else if (usuarioActual) {
            const sesionActualizada = normalizados.find((usuario) => usuario.id === usuarioActual.id) || usuarioActual;
            setUsuarioActual(sesionActualizada);
            writeJson(USER_SESSION_KEY, sesionActualizada);
        }
    };

    const registrarUsuario = async (datosUsuario) => {
        const nombre = datosUsuario.nombre?.trim();
        const apellido = datosUsuario.apellido?.trim();
        const email = datosUsuario.email?.trim().toLowerCase();
        const contrasena = datosUsuario.contrasena?.trim();

        if (!nombre || !apellido || !email || !contrasena) {
            return { exito: false, mensaje: 'Por favor completa todos los campos.' };
        }

        try {
            // Llamar a la API primero para que el backend haga el hash de la contraseña
            const respuestaApi = await registrarUsuarioApi({ nombre, apellido, email, contrasena });
            const usuarioApi = respuestaApi?.usuario ?? respuestaApi?.data ?? respuestaApi;

            if (usuarioApi && typeof usuarioApi === 'object' && usuarioApi.email) {
                const usuarioPersistido = normalizarUsuario(usuarioApi);
                const usuariosActualizados = replaceUsuario(
                    [...usuarios, usuarioPersistido],
                    usuarioPersistido
                );
                actualizarUsuarios(usuariosActualizados);
                return { exito: true };
            }

            // Si la API respondió sin datos de usuario, asumir que el email ya existe
            return { exito: false, mensaje: respuestaApi?.mensaje || 'No se pudo completar el registro.' };
        } catch (error) {
            const mensaje = error?.response?.data?.mensaje
                || error?.response?.data?.message
                || error?.message
                || 'Error al registrar. Intenta de nuevo.';
            return { exito: false, mensaje };
        }
    };

    const iniciarSesion = async (email, contrasena) => {
        const emailLimpio = email.trim().toLowerCase();
        const contrasenaLimpia = contrasena.trim();

        try {
            const respuestaApi = await autenticarUsuario({ email: emailLimpio, contrasena: contrasenaLimpia });

            // El backend retorna { exito: true, token, usuario }
            if (!respuestaApi?.exito) {
                return { exito: false, mensaje: respuestaApi?.mensaje || 'Correo o contraseña incorrectos.' };
            }

            const usuarioApi = respuestaApi?.usuario ?? respuestaApi?.user ?? respuestaApi?.data;
            if (!usuarioApi) {
                return { exito: false, mensaje: 'Respuesta inválida del servidor.' };
            }

            const usuarioNormalizado = normalizarUsuario(usuarioApi);
            if (usuarioNormalizado.activo === false) {
                return { exito: false, mensaje: 'Tu cuenta está desactivada. Contacta al administrador.' };
            }

            const usuarioConProyectos = cloneUsuario({
                ...usuarioNormalizado,
                proyectos: usuarioNormalizado.proyectos?.length > 0 ? usuarioNormalizado.proyectos : []
            });

            setUsuarioActual(usuarioConProyectos);
            writeJson(USER_SESSION_KEY, usuarioConProyectos);

            if (respuestaApi?.token) {
                localStorage.setItem('token', respuestaApi.token);
            }

            return { exito: true };
        } catch (error) {
            // Propagar el mensaje de error real del backend
            const mensaje = error?.response?.data?.mensaje
                || error?.response?.data?.message
                || error?.message
                || 'Correo o contraseña incorrectos.';
            return { exito: false, mensaje };
        }
    };

    const iniciarSesionAdmin = async (email, contrasena) => {
        const emailLimpio = email.trim().toLowerCase();
        const contrasenaLimpia = contrasena.trim();

        try {
            const respuestaApi = await adminLogin(emailLimpio, contrasenaLimpia);
            if (respuestaApi?.exito) {
                const sesionAdmin = respuestaApi.admin ?? respuestaApi.usuario ?? respuestaApi.user ?? { email: emailLimpio, nombre: 'Administrador' };
                setAdminActual(sesionAdmin);
                writeJson(ADMIN_SESSION_KEY, sesionAdmin);
                if (respuestaApi?.token) {
                    localStorage.setItem('token', respuestaApi.token);
                }
                return { exito: true };
            }
            return { exito: false, mensaje: respuestaApi?.mensaje || 'Credenciales de administrador incorrectas.' };
        } catch (error) {
            const mensaje = error?.response?.data?.mensaje
                || error?.response?.data?.message
                || error?.message
                || 'Credenciales de administrador incorrectas.';
            return { exito: false, mensaje };
        }
    };

    const login = async (email, contrasena) => {
        const resultadoAdmin = await iniciarSesionAdmin(email, contrasena);
        if (resultadoAdmin.exito) {
            return { exito: true, tipo: 'admin' };
        }

        const resultadoUsuario = await iniciarSesion(email, contrasena);
        if (resultadoUsuario.exito) {
            return { exito: true, tipo: 'usuario' };
        }

        return { exito: false, mensaje: resultadoUsuario.mensaje || resultadoAdmin.mensaje || 'Correo o contraseña incorrectos.' };
    };

    const actualizarProyectosUsuario = async (nuevosProyectos) => {
        if (!usuarioActual) return { exito: false };

        const proyectosNormalizados = (nuevosProyectos || []).map(normalizarProyecto);
        const usuariosActualizados = usuarios.map((usuario) => {
            if (usuario.id === usuarioActual.id) {
                return { ...usuario, proyectos: proyectosNormalizados };
            }

            if (usuario.proyectos?.some((proyecto) => proyectosNormalizados.some((proyectoActualizado) => proyectoActualizado.id === proyecto.id))) {
                return {
                    ...usuario,
                    proyectos: usuario.proyectos.map((proyecto) => {
                        const proyectoActualizado = proyectosNormalizados.find((item) => item.id === proyecto.id);
                        return proyectoActualizado || proyecto;
                    })
                };
            }

            return usuario;
        });

        const sesionActualizada = { ...usuarioActual, proyectos: proyectosNormalizados };
        actualizarUsuarios(usuariosActualizados, sesionActualizada);
        persistirUsuarioEnApi(sesionActualizada);

        return { exito: true };
    };

    const actualizarContenidoProyecto = async (proyectoId, nuevasTareas, nuevosRecursos) => {
        if (!usuarioActual) return { exito: false };

        const tareasNormalizadas = (nuevasTareas || []).map(normalizarTarea);
        const recursosNormalizados = (nuevosRecursos || []).map(normalizarRecurso);
        const tareasCompletadas = tareasNormalizadas.filter((tarea) => tarea.check || tarea.estaTerminada).length;
        const totalTareas = tareasNormalizadas.length;
        const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

        const usuariosActualizados = usuarios.map((usuario) => {
            if (!usuario.proyectos?.some((proyecto) => proyecto.id === proyectoId)) {
                return usuario;
            }

            return {
                ...usuario,
                proyectos: usuario.proyectos.map((proyecto) => (
                    proyecto.id === proyectoId
                        ? {
                            ...proyecto,
                            tareas: tareasNormalizadas,
                            recursos: recursosNormalizados,
                            tasksCompleted: tareasCompletadas,
                            tasksTotal: totalTareas,
                            progress: progreso
                        }
                        : proyecto
                ))
            };
        });

        const sesionActualizada = usuariosActualizados.find((usuario) => usuario.id === usuarioActual.id) || {
            ...usuarioActual,
            proyectos: (usuarioActual.proyectos || []).map((proyecto) => (
                proyecto.id === proyectoId
                    ? {
                        ...proyecto,
                        tareas: tareasNormalizadas,
                        recursos: recursosNormalizados,
                        tasksCompleted: tareasCompletadas,
                        tasksTotal: totalTareas,
                        progress: progreso
                    }
                    : proyecto
            ))
        };

        actualizarUsuarios(usuariosActualizados, sesionActualizada);
        persistirProyectoEnApi(proyectoId, {
            tareas: tareasNormalizadas,
            recursos: recursosNormalizados,
            tasksCompleted: tareasCompletadas,
            tasksTotal: totalTareas,
            progress: progreso
        });
        void Promise.allSettled([
            sincronizarTareas(proyectoId, tareasNormalizadas),
            sincronizarRecursos(proyectoId, recursosNormalizados)
        ]);

        return { exito: true };
    };

    const crearProyectoUsuario = async (nuevoProyecto) => {
        if (!usuarioActual) {
            return { exito: false, mensaje: 'Debes iniciar sesión para crear un grupo.' };
        }

        const proyectoNormalizado = normalizarProyecto({
            ...nuevoProyecto,
            id: nuevoProyecto.id ?? Date.now(),
            tareas: nuevoProyecto.tareas || [],
            recursos: nuevoProyecto.recursos || [],
            creadorId: usuarioActual.id,
            codigo: nuevoProyecto.codigo || generarCodigoGrupo()
        });

        const proyectosActuales = usuarioActual.proyectos || [];
        const proyectosActualizados = [...proyectosActuales, proyectoNormalizado];
        await actualizarProyectosUsuario(proyectosActualizados);

        try {
            await crearProyecto(proyectoNormalizado);
        } catch {
            // El backend puede no estar listo todavía; el estado local ya quedó consistente.
        }

        return { exito: true, proyecto: proyectoNormalizado };
    };

    const unirseGrupoPorCodigo = async (codigo) => {
        if (!usuarioActual) {
            return { exito: false, mensaje: 'Debes iniciar sesión para unirte a un grupo.' };
        }

        const codigoLimpio = codigo.trim().toUpperCase();

        try {
            const respuestaApi = await unirseGrupoPorCodigoApi(codigoLimpio, usuarioActual.id);
            const proyectoApi = respuestaApi?.proyecto ?? respuestaApi?.grupo ?? respuestaApi?.data ?? null;
            if (proyectoApi) {
                const proyectoNormalizado = normalizarProyecto(proyectoApi);
                const proyectosActualizados = [...(usuarioActual.proyectos || []), proyectoNormalizado];
                await actualizarProyectosUsuario(proyectosActualizados);
                return { exito: true, proyecto: proyectoNormalizado };
            }
        } catch {
            // Continúa con el respaldo local.
        }

        const proyectosGlobales = usuarios.flatMap((usuario) => usuario.proyectos || []);
        const proyectoEncontrado = proyectosGlobales.find((proyecto) => proyecto.codigo?.toUpperCase() === codigoLimpio);

        if (!proyectoEncontrado) {
            return { exito: false, mensaje: 'No se encontró ningún grupo con ese código de invitación.' };
        }

        const yaPertenece = (usuarioActual.proyectos || []).some((proyecto) => proyecto.id === proyectoEncontrado.id);
        if (yaPertenece) {
            return { exito: false, mensaje: 'Ya eres miembro de este grupo.' };
        }

        const proyectoActualizado = normalizarProyecto({
            ...proyectoEncontrado,
            membersCount: toNumber(proyectoEncontrado.membersCount, 1) + 1
        });

        const proyectosActualizados = [...(usuarioActual.proyectos || []), proyectoActualizado];
        await actualizarProyectosUsuario(proyectosActualizados);

        return { exito: true, proyecto: proyectoActualizado };
    };

    const eliminarGrupo = async (proyectoId) => {
        if (!usuarioActual) return { exito: false };

        const usuariosActualizados = usuarios.map((usuario) => ({
            ...usuario,
            proyectos: (usuario.proyectos || []).filter((proyecto) => proyecto.id !== proyectoId)
        }));

        const sesionActualizada = {
            ...usuarioActual,
            proyectos: (usuarioActual.proyectos || []).filter((proyecto) => proyecto.id !== proyectoId)
        };

        actualizarUsuarios(usuariosActualizados, sesionActualizada);

        try {
            await eliminarProyecto(proyectoId, usuarioActual.id);
        } catch {
            // Sin backend disponible, la sincronización queda en memoria.
        }

        return { exito: true };
    };

    const salirDeGrupo = async (proyectoId) => {
        if (!usuarioActual) return { exito: false };

        const usuariosActualizados = usuarios.map((usuario) => {
            if (usuario.id === usuarioActual.id) {
                return {
                    ...usuario,
                    proyectos: (usuario.proyectos || []).filter((proyecto) => proyecto.id !== proyectoId)
                };
            }

            if (usuario.proyectos?.some((proyecto) => proyecto.id === proyectoId)) {
                return {
                    ...usuario,
                    proyectos: usuario.proyectos.map((proyecto) => (
                        proyecto.id === proyectoId
                            ? { ...normalizarProyecto(proyecto), membersCount: Math.max(1, toNumber(proyecto.membersCount, 1) - 1) }
                            : proyecto
                    ))
                };
            }

            return usuario;
        });

        const sesionActualizada = {
            ...usuarioActual,
            proyectos: (usuarioActual.proyectos || []).filter((proyecto) => proyecto.id !== proyectoId)
        };

        actualizarUsuarios(usuariosActualizados, sesionActualizada);

        try {
            await salirDeGrupoApi(proyectoId, usuarioActual.id);
        } catch {
            // Se conserva el estado local mientras el backend se pone en marcha.
        }

        return { exito: true };
    };

    const quitarMiembro = async (proyectoId, miembroId) => {
        if (!usuarioActual) return { exito: false };

        const usuariosActualizados = usuarios.map((usuario) => {
            if (usuario.id === miembroId) {
                return {
                    ...usuario,
                    proyectos: (usuario.proyectos || []).filter((proyecto) => proyecto.id !== proyectoId)
                };
            }

            if (usuario.proyectos?.some((proyecto) => proyecto.id === proyectoId)) {
                return {
                    ...usuario,
                    proyectos: usuario.proyectos.map((proyecto) => (
                        proyecto.id === proyectoId
                            ? { ...normalizarProyecto(proyecto), membersCount: Math.max(1, toNumber(proyecto.membersCount, 1) - 1) }
                            : proyecto
                    ))
                };
            }

            return usuario;
        });

        const sesionActualizada = usuariosActualizados.find((usuario) => usuario.id === usuarioActual.id) || usuarioActual;
        actualizarUsuarios(usuariosActualizados, sesionActualizada);

        try {
            await quitarMiembroApi(proyectoId, miembroId, usuarioActual.id);
        } catch {
            // El backend se sincronizará cuando esté disponible.
        }

        return { exito: true };
    };

    const cerrarSesion = () => {
        setUsuarioActual(null);
        localStorage.removeItem(USER_SESSION_KEY);
        localStorage.removeItem('token');
    };

    const cerrarSesionAdmin = () => {
        setAdminActual(null);
        localStorage.removeItem(ADMIN_SESSION_KEY);
    };

    const toggleEstadoUsuario = async (idUsuario) => {
        const usuariosActualizados = usuarios.map((usuario) => (
            usuario.id === idUsuario ? { ...usuario, activo: !usuario.activo } : usuario
        ));
        const usuarioModificado = usuariosActualizados.find((usuario) => usuario.id === idUsuario) || null;
        actualizarUsuarios(usuariosActualizados, usuarioActual?.id === idUsuario ? usuarioModificado : null);

        try {
            await toggleEstadoAlumno(idUsuario);
        } catch {
            // respaldo local
        }
    };

    const cambiarContrasenaUsuario = async (idUsuario, nuevaContrasena) => {
        const usuariosActualizados = usuarios.map((usuario) => (
            usuario.id === idUsuario ? { ...usuario, contrasena: nuevaContrasena } : usuario
        ));
        actualizarUsuarios(usuariosActualizados, usuarioActual?.id === idUsuario ? usuariosActualizados.find((usuario) => usuario.id === idUsuario) : null);

        try {
            await cambiarContrasenaAlumno(idUsuario, nuevaContrasena);
        } catch {
            // respaldo local
        }
    };

    const recargarProyectosUsuario = async (idUsuario) => {
        try {
            const proyectosApi = await getProyectosByUsuario(idUsuario);
            return Array.isArray(proyectosApi) ? proyectosApi.map(normalizarProyecto) : [];
        } catch {
            return [];
        }
    };

    return (
        <AuthContext.Provider value={{
            usuarioActual,
            adminActual,
            cargando,
            usuarios,
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
            crearProyectoUsuario,
            actualizarContenidoProyecto,
            unirseGrupoPorCodigo,
            eliminarGrupo,
            salirDeGrupo,
            quitarMiembro,
            recargarProyectosUsuario
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);