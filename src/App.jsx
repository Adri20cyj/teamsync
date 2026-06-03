import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import './App.css'
import Panel from './components/Panel/Panel'
import EspacioTrabajo from './components/Panel/EspacioTrabajo/EspacioTrabajo'
import { useAuth } from './context/AuthContext'

function App() {
  const { usuarioActual, cargando } = useAuth();
  const [vista, setVista] = useState('proyectos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // Mientras se comprueba la sesión guardada
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#05010d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        color: '#8c86a6',
        fontSize: '0.95rem'
      }}>
        Cargando...
      </div>
    );
  }

  // Si no hay sesión, redirigir al login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectProyecto = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setVista('panel');
  };

  const handleVolverProyectos = () => {
    setVista('proyectos');
    setProyectoSeleccionado(null);
  };

  return (
    <>
      {vista === 'proyectos' ? (
        <EspacioTrabajo onSelectProyecto={handleSelectProyecto} usuarioActual={usuarioActual} />
      ) : (
        <Panel onVolver={handleVolverProyectos} proyecto={proyectoSeleccionado} />
      )}
    </>
  )
}

export default App
