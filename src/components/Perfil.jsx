import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {actualizarDisplayNameAccion,actualizarFotoAccion} from '../redux/usuarioDucks'

const Perfil = () => {

    const dispatch = useDispatch()

    const usuario = useSelector(store => store.usuario.user)
    const loading = useSelector(store => store.usuario.loading)

    const [nombreUsuario, setNombreUsuario] = React.useState(usuario.displayName)
    const [editarNombre, setEditarNombre] = React.useState(false)
    const [error, setError] = React.useState(false)

    const botonEditarNombre = () => {
        if(!nombreUsuario.trim()){
            console.log('nombre esta vacio')
            return
        }
        
        dispatch(actualizarDisplayNameAccion(nombreUsuario))
        setEditarNombre(false)

    }

    const seleccionarArchivo = (e) => {
        console.log(e.target.files[0])   
        const imagen = e.target.files[0]
    
        if(imagen === undefined){
            console.log('sin imagen')
            return
        }
    
        if(imagen.type === 'image/jpeg' || imagen.type === 'image/png'){
                dispatch(actualizarFotoAccion(imagen))       
                setError(false) 
            }else{
                console.log('archivo no válido')
                setError(true)
                return
            }
    }

    return (
        <div className="mt-5 text-center">
            <div className="card">
                <div className="card-body">
                    <img src={usuario.photoURL} width="100" alt="" className="img-fluid rounded" />
                    <h5 className="card-title">Nombre: {usuario.displayName}</h5>
                    <p className="card-text">Email: {usuario.email}</p>                    
                </div>  
                <button 
                    className='btn btn-dark' 
                    onClick={() => setEditarNombre(true)}
                >
                    Editar Nombre
                </button>

                <div className="custom-file">
                    {
                        error &&
                        <div className="alert alert-warning">
                            Foto en .png o .jpg
                        </div>
                    }

                    <input type="file" 
                        className="custom-file-input" 
                        id="inputGroupFile01" 
                        style={{display:'none'}}
                        disabled={loading}
                        onChange={e => seleccionarArchivo(e)}
                        />

                    <label className="btn btn-dark mt-2" 
                           htmlFor="inputGroupFile01">
                               Actualizar Imagen
                    </label>
                </div>



                {
                    loading &&
                    <div className="card-body">
                        <div className="d-flex justify-content-center my-2">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>                    
                }
                {
                    editarNombre &&
                     <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-5">
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                          value={nombreUsuario}  
                                        onChange={ e => setNombreUsuario(e.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button" 
                                            onClick={() => botonEditarNombre()}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                }


            </div>
           
        </div>
    )
}

export default Perfil
