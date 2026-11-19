import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './components/Home'
import Archivo from './pages/Archivo'
import BarrioView from './pages/BarrioView'
import LetraView from './pages/LetraView'
import CategoriaView from './pages/CategoriaView'
import { UploadForm } from './components/UploadForm'
import { ModerationPanel } from './components/ModerationPanel'
import { mockWords } from './data/mockWords'

export default function App() {
  return (
    <BrowserRouter basename="/sustantivos-publicos/">
      <Routes>
        <Route path="/" element={<Home words={mockWords} />} />
        <Route path="/todos" element={<Archivo initialCriterion="todos" />} />
        <Route path="/ubicacion" element={<Archivo initialCriterion="barrio" />} />
        <Route path="/a-z" element={<Archivo initialCriterion="alfabeto" />} />
        <Route path="/a-z/:letra" element={<LetraView />} />
        <Route path="/aspecto" element={<Archivo initialCriterion="visual" />} />
        <Route path="/aspecto/:categoria" element={<CategoriaView />} />
        <Route path="/cargar" element={<UploadForm />} />
        <Route path="/moderar" element={<ModerationPanel />} />
        <Route path="/ubicacion/:barrio" element={<BarrioView />} />
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
