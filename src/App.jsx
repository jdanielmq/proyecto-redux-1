import React from 'react';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Login from './components/Login';
import Navbar from './components/Navbar';
import Pokemones from './components/Pokemones';

import {auth} from './firebase'



function App() {

  const [firebaseUser, setFirebaseUser] = React.useState(false)

  React.useEffect(() => {
   const fetchData = () => {
        auth.onAuthStateChanged(user => {
          console.log(user)
          if(user){
              setFirebaseUser(user)
          }else{
              setFirebaseUser(null)
          }
        })
    }

    fetchData()

}, [])

 // LocalStorage
 const RutaProtegida = ({component, path, ...rest}) => {
  if(localStorage.getItem('usuario')){
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario'))
    if(usuarioStorage.uid === firebaseUser.uid){
      console.log('son iguales')
      return <Route component={component} path={path} {...rest} />
    }else{
      console.log('no exite')
      return <Redirect to="/login" {...rest} />
    }
  }else{
    return <Redirect to="/login" {...rest} />
  }
}

  return firebaseUser !== false ? (
      <Router>
        <div className="container mt-3">
          <Navbar />
          <Switch>
            <RutaProtegida component={Pokemones} path="/" exact/>
            <Route component={Login} path="/login" exact/>
          </Switch>
        </div>
      </Router>

  ):(<div>Cargando...</div>);
}

export default App;
