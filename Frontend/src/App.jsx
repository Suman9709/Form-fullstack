import LoginForm from './Components/LoginForm'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from './Components/RegistrationForm'
import AdminLogin from './Components/AdminLogin';
import AdminRegistrationForm from './Components/AdminRegistration';
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/Studentsignup' element={<RegistrationForm />} />
        <Route path='/AdminLogin' element={<AdminLogin />} />
        <Route path='/AdminSignup' element={<AdminRegistrationForm />} />
      </Routes>
    </Router>
  )
}

export default App
