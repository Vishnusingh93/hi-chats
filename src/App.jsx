import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Room from './pages/Room'
import LoginPage from './pages/LoginPage'
import  {AuthProvider}  from './utils/AuthContext'
import Registerpage from './pages/Registerpage'

function App() {
  

  return (
   <Router>
    <AuthProvider>

       <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<Registerpage/>}/>

      <Route element={<PrivateRoute/>}>
      <Route path='/' element={<Room/>}/>
    </Route>
    </Routes>
    
    </AuthProvider>
   </Router>
  )
}

export default App
