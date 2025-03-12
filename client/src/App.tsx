
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import WelcomePage from './components/WelcomePage'
import Home from './components/Home'
import RightMenu from './components/RightMenu'
import Profile from './components/Profile'
import Loading from './components/Loading'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<WelcomePage/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/loading' element={<Loading/>}/>
            <Route path='/right' element={<RightMenu/>}/>
            <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
