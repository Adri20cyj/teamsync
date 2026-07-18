import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Registro.css';

const Registro = () => {
    const { registrarUsuario } = useAuth();
    const navegar = useNavigate();

    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        confirmarContrasena: ''
    });
    const [errorMensaje, setErrorMensaje] = useState('');
    const [exitoMensaje, setExitoMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleCambio = (e) => {
        setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
        setErrorMensaje('');
    };

    const validar = () => {
        const { nombre, apellido, email, contrasena, confirmarContrasena } = datosFormulario;
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !contrasena || !confirmarContrasena) {
            return 'Por favor completa todos los campos.';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'El correo electrónico no es válido.';
        }
        if (contrasena.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres.';
        }
        if (contrasena !== confirmarContrasena) {
            return 'Las contraseñas no coinciden.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorValidacion = validar();
        if (errorValidacion) {
            setErrorMensaje(errorValidacion);
            return;
        }
        setCargando(true);
        await new Promise(r => setTimeout(r, 400));

        const storedMiembros = localStorage.getItem("miembros");
        const miembrosActuales = JSON.parse(storedMiembros) || [];

        const nuevoMiembro = {
            id: miembrosActuales.length ? Math.max(...miembrosActuales.map(m => m.id)) + 1 : 1,
            email: datosFormulario.email
        };

        if (!miembrosActuales.some(m => m.email === nuevoMiembro.email)) {
            const updatedMiembros = [...miembrosActuales, nuevoMiembro];
            localStorage.setItem("miembros", JSON.stringify(updatedMiembros));
        }

        localStorage.setItem("usuarioActivo", datosFormulario.email);

        const resultado = await registrarUsuario(datosFormulario);
        setCargando(false);

        if (resultado.exito) {
            setExitoMensaje('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => navegar('/login'), 1500);
        } else {
            setErrorMensaje(resultado.mensaje);
        }
    };

    return (
        <div className="registro-pagina">
            <div className="registro-card">
                <div className="registro-logo">
                    <h1>TeamSync</h1>
                    <span>Crea tu cuenta y comienza a colaborar</span>
                </div>

                <hr className="registro-separador" />

                <p className="registro-titulo-form">Crea tu Cuenta</p>

                <form className="registro-formulario" onSubmit={handleSubmit} id="formulario-registro">
                    {errorMensaje && (
                        <div className="mensaje-error" role="alert">{errorMensaje}</div>
                    )}
                    {exitoMensaje && (
                        <div className="mensaje-exito" role="status">{exitoMensaje}</div>
                    )}

                    <div className="fila-doble">
                        <div className="campo-formulario">
                            <label htmlFor="nombre-registro">Nombre</label>
                            <input
                                id="nombre-registro"
                                type="text"
                                name="nombre"
                                placeholder="Tu nombre"
                                value={datosFormulario.nombre}
                                onChange={handleCambio}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="campo-formulario">
                            <label htmlFor="apellido-registro">Apellido</label>
                            <input
                                id="apellido-registro"
                                type="text"
                                name="apellido"
                                placeholder="Tu apellido"
                                value={datosFormulario.apellido}
                                onChange={handleCambio}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="email-registro">Correo electrónico</label>
                        <input
                            id="email-registro"
                            type="email"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            value={datosFormulario.email}
                            onChange={handleCambio}
                            autoComplete="email"
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="contrasena-registro">Contraseña</label>
                        <input
                            id="contrasena-registro"
                            type="password"
                            name="contrasena"
                            placeholder="Mínimo 6 caracteres"
                            value={datosFormulario.contrasena}
                            onChange={handleCambio}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="confirmar-contrasena-registro">Confirmar contraseña</label>
                        <input
                            id="confirmar-contrasena-registro"
                            type="password"
                            name="confirmarContrasena"
                            placeholder="Repite tu contraseña"
                            value={datosFormulario.confirmarContrasena}
                            onChange={handleCambio}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        id="boton-registrarse"
                        type="submit"
                        className="boton-principal"
                        disabled={cargando || !!exitoMensaje}
                    >
                        {cargando ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <div className="registro-enlaces">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="enlace-accion" id="ir-login">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registro;