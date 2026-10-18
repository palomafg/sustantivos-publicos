import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import Archivo from './pages/Archivo'
import { UploadForm } from './components/UploadForm'
import { ModerationPanel } from './components/ModerationPanel'
import { WordDetail } from './components/WordDetail'
import { mockWords } from './data/mockWords'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home words={mockWords} />} />
        <Route path="/archivo" element={<Archivo />} />
        <Route path="/cargar" element={<UploadForm />} />
        <Route path="/moderar" element={<ModerationPanel />} />
        <Route path="/palabra/:id" element={<WordDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
