import { useState } from 'react'
import './App.css'
import Panel from './components/Panel/Panel'
import EspacioTrabajo from './components/Panel/EspacioTrabajo/EspacioTrabajo'

function App() {
  const [vista, setVista] = useState('proyectos'); // 'proyectos' or 'panel'
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

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
        <EspacioTrabajo onSelectProyecto={handleSelectProyecto} />
      ) : (
        <Panel onVolver={handleVolverProyectos} proyecto={proyectoSeleccionado} />
      )}
    </>
  )
}

export default App
