import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Login.css';

const Login = () => {
    const { login } = useAuth();
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
        const resultado = login(datosFormulario.email, datosFormulario.contrasena);
        setCargando(false);
        if (resultado.exito) {
            // Redirige según el tipo de sesión detectado
            if (resultado.tipo === 'admin') {
                navegar('/admin/usuarios');
            } else {
                navegar('/');
            }
        } else {
            setErrorMensaje(resultado.mensaje || 'Correo o contraseña incorrectos.');
        }
    };

    return (
        <div className="login-pagina">
            <div className="login-card">
                <div className="login-logo">
                    <h1>TeamSync</h1>
                    <span>Gestión de proyectos colaborativos</span>
                </div>

                <hr className="login-separador" />

                <p className="login-titulo-form">Iniciar Sesión</p>

                <form className="login-formulario" onSubmit={handleSubmit} id="formulario-login">
                    {errorMensaje && (
                        <div className="mensaje-error" role="alert">
                            {errorMensaje}
                        </div>
                    )}

                    <div className="campo-formulario">
                        <label htmlFor="email-login">Correo electrónico</label>
                        <input
                            id="email-login"
                            type="email"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            value={datosFormulario.email}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                            autoComplete="email"
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="contrasena-login">Contraseña</label>
                        <input
                            id="contrasena-login"
                            type="password"
                            name="contrasena"
                            placeholder="Tu contraseña"
                            value={datosFormulario.contrasena}
                            onChange={handleCambio}
                            className={errorMensaje ? 'campo-error' : ''}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        id="boton-iniciar-sesion"
                        type="submit"
                        className="boton-principal"
                        disabled={cargando}
                    >
                        {cargando ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                <div className="login-enlaces">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="enlace-accion" id="ir-registro">
                            Regístrate aquí
                        </Link>
                    </p>
                    <p>
                        ¿Eres administrador?{' '}
                        <Link to="/admin/login" className="enlace-accion" id="ir-registro-admin">
                            Click aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
