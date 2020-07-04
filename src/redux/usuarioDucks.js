import {auth, firebase} from '../firebase'

// state

const dataInicial = {
    loading : false,
    activo : false
}

//types
const LOADING = 'LOADING'
const USER_EXITO = 'USER_EXITO'
const USER_ERROR = 'USER_ERROR'
const CERRAR_SESION = 'CERRAR_SESION'


// reducer
export default function usuarioReducer (state = dataInicial, action){
    switch(action.type){
        case LOADING:
            return {...state, loading: true}
        case USER_ERROR: 
            return {...dataInicial}
        case USER_EXITO: 
            return {...state, loading: false, activo: true, user: action.payload.user}
        case CERRAR_SESION: 
            return {...dataInicial}
        default:
            return {...state}

    }

}

//acciones
export const accederAccion = () => async(dispatch) =>{

    dispatch({
        type: LOADING
    })

    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const res = await auth.signInWithPopup(provider);
        console.log(res)

        dispatch({
            type:USER_EXITO,
            payload: {
                user: {
                    uid: res.user.uid,
                    email: res.user.email
                }
            }
        })
        localStorage.setItem('usuario', JSON.stringify({
            uid : res.user.uid,
            email: res.user.email
        }))
        
    } catch (error) {
        console.log(error);
        dispatch({
            type:USER_ERROR
        })
    }

}

export const leerUsuarioAccion = () => async (dispatch) => {
    if(localStorage.getItem('usuario')){
        dispatch({
            type: USER_EXITO,
            payload: {
                user: JSON.parse(localStorage.getItem('usuario'))
            }
        })
    }
}

export const cerrarSesionAccion = () => (dispatch) => {
    auth.signOut()
    dispatch({
        type: CERRAR_SESION
    })
    localStorage.removeItem('usuario')
}