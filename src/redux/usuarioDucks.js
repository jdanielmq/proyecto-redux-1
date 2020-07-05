import {auth, firebase, db, storage} from '../firebase'

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
        
        const usuarioAux = {
            uid : res.user.uid,
            email: res.user.email,
            photoURL: res.user.photoURL,
            displayName: res.user.displayName
        } 

        const usuarioDB = await db.collection('usuarios').doc(res.user.email).get()
        if(usuarioDB.exists){
            console.log(usuarioDB.data())
            dispatch({
                type: USER_EXITO,
                payload: usuarioDB.data()
            })

            localStorage.setItem('usuario', JSON.stringify(usuarioDB.data()))

        }else{
            console.log('no existe')
            await db.collection('usuarios').doc(res.user.email).set(usuarioAux)
            dispatch({
                type: USER_EXITO,
                payload: usuarioAux
            })

            localStorage.setItem('usuario', JSON.stringify(usuarioAux))
        }

        dispatch({
            type:USER_EXITO,
            payload: {
                user: usuarioAux
            }
        })
        localStorage.setItem('usuario', JSON.stringify(usuarioAux))
        
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

export const actualizarDisplayNameAccion = (nuevoNombre) => async(dispatch, getState) => {

    dispatch({
        type:LOADING
    })

    const {user} = getState().usuario

    try {
            await db.collection('usuarios').doc(user.email).update({
                displayName: nuevoNombre
            })

            const usuario = {
                ...user,
                displayName: nuevoNombre
            }

            console.log(usuario)
            console.log(nuevoNombre)

            dispatch({
                type:USER_EXITO,
                payload: {
                    user: usuario
                }
            })

            localStorage.setItem('usuario', JSON.stringify(usuario))

    } catch (error) {
        console.log(error)
    }

}

export const actualizarFotoAccion = (imagen) => async(dispatch, getState) => {

    dispatch({
        type:LOADING
    })

    const {user} = getState().usuario

    try {
        const refImagen = await storage.ref().child(user.email).child('foto perfil')
        await refImagen.put(imagen)
        const urlDescarga = await refImagen.getDownloadURL()
    
        await db.collection('usuarios').doc(user.email).update({
            photoURL: urlDescarga
        })

        const usuarioEditado = {
            ...user,
            photoURL: urlDescarga
        }
        dispatch({
            type:USER_EXITO,
            payload: {
                user: usuarioEditado
            }
        })

        localStorage.setItem('usuario', JSON.stringify(usuarioEditado))

        
    } catch (error) {
        console.log(error)
    }

}
