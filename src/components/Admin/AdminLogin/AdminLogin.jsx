import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const { iniciarSesionAdmin } = useAuth();
    const navegar = useNavigate();

    const [datosFormulario, setDatosFormulario] = useState({
        email: '',
        contrasena: ''
    });
    const [errorMensaje, setErrorMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleCambio = (e) => {
        setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
        setErrorMensaje('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!datosFormulario.email || !datosFormulario.contrasena) {
            setErrorMensaje('Por favor completa todos los campos.');
            return;
        }
        setCargando(true);
        await new Promise(r => setTimeout(r, 400));
        const resultado = iniciarSesionAdmin(datosFormulario.email, datosFormulario.contrasena);
        setCargando(false);
        if (resultado.exito) {
            navegar('/admin/usuarios');
        } else {
            setErrorMensaje(resultado.mensaje);
        }
    };

    return (
        <div className="admin-login-pagina">
            <div className="admin-login-card">
                {/* Ícono escudo */}
                <div className="admin-login-icono" aria-hidden="true">
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>

                <div className="admin-login-logo">
                    <h1>TeamSync</h1>
                    <span>Panel de Administración</span>
                </div>

                <hr className="admin-login-separador" />

                <p className="admin-login-titulo-form">Acceso Administrador</p>

                <form className="admin-login-formulario" onSubmit={handleSubmit} id="formulario-admin-login">
                    {errorMensaje && (
                        <div className="mensaje-error" role="alert">{errorMensaje}</div>
                    )}

                    <div className="campo-formulario">
                        <label htmlFor="email-admin">Correo de administrador</label>
                        <input
                            id="email-admin"
                            type="email"
                            name="email"
                            placeholder="admin@teamsync.com"
                            value={datosFormulario.email}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                            autoComplete="email"
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="contrasena-admin">Contraseña</label>
                        <input
                            id="contrasena-admin"
                            type="password"
                            name="contrasena"
                            placeholder="Contraseña de administrador"
                            value={datosFormulario.contrasena}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        id="boton-entrar-admin"
                        type="submit"
                        className="boton-principal-admin"
                        disabled={cargando}
                    >
                        {cargando ? 'Verificando...' : 'Entrar al panel'}
                    </button>
                </form>

                <div className="admin-login-volver">
                    <Link to="/login" className="enlace-volver" id="ir-login-usuario">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
