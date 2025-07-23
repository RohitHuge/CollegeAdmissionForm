import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormPage from './pages/FormPage'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FormPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
