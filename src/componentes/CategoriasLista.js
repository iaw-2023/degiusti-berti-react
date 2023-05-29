import React, { Component } from 'react';
import Categoria from "./entidades/Categoria"
import Buscador from './Buscador'
import Pagination from 'react-js-pagination';
import CircularProgress from '@mui/material/CircularProgress';
import toast, { Toaster } from 'react-hot-toast';

class CategoriasLista extends Component {

  constructor(props) {
      super(props);
      this.state = {
          categorias: [],
          currentPage: 1,
          itemsPerPage: 9,
          busqueda: false,
		      cargando: true,
          keyBuscador: 0, // Esto funciona para borrar el value del buscador al momento de limpiar la busqueda.
      };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  componentDidMount() { // Ejecuta cuando se abre la pagina
    this.obtenerCategorias();
  }
  
  datosBusqueda = (termino) => {
    if(termino === "") {
      this.obtenerCategorias();
      this.setState({ busqueda: false });
    }
    else {
      let URL = "http://127.0.0.1:8000/rest/categorias/buscar/"+termino;
      fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => {this.setState({ categorias: resultado, busqueda: true })
        if (resultado.length > 0) {
          toast('Búsqueda exitosa', {
            duration: 2000,
            position: 'bottom-right',
            type: 'success'
          });
        } else {
          toast('No se encontraron resultados', {
            duration: 2000,
            position: 'bottom-right',
            type: 'error'
          });
        }
        })
        .catch(error => console.log(error));
      }
      
  };

  obtenerCategorias = () => {
    let URL = "http://127.0.0.1:8000/rest/categorias";
    
    fetch(URL)
      .then(respuesta => respuesta.json())
      .then(resultado => this.setState({ categorias: resultado, cargando:false }))
      .catch(error => console.log(error));
  }
  

  limpiarBusqueda = () => {
    this.setState({
      busqueda: false, 
      categorias: [], 
    });
    this.setState((prevState) => ({
      keyBuscador: prevState.keyBuscador + 1 
    }));
    this.obtenerCategorias();
  };

  render() {
    const { categorias, currentPage, itemsPerPage } = this.state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const categoriasPaginadas = categorias.slice(startIndex, endIndex);

    return (
      <div>
        <div className="mt-2 d-flex justify-content-end">
        {this.state.categorias.length > 0 && this.state.busqueda === true &&
              <button onClick={this.limpiarBusqueda} className="btn mx-1 btn-sm btn-danger">Limpiar busqueda</button>
        }   {this.state.categorias.length > 0 &&
          <Buscador 
            datosBusqueda={this.datosBusqueda} 
            key={this.state.keyBuscador} />
         // pendiente. que no se muestre el buscador si no hay categorias.
        }
        
          
        </div>
        <div className="container text-center">
          
		  {this.state.cargando === true ? 
      <div>
        <div className="mt-2"><CircularProgress /></div>
      </div> :
          categorias.length === 0 ? ( <div><h1 className="display-4">Lista de categorias</h1>
            <div className="mt-2">No se encontraron categorias.<br></br>
            <button onClick={this.limpiarBusqueda} className="btn mb-2 mx-1 btn-sm btn-danger">Limpiar busqueda</button>
            </div></div>
          ) : (
            <div>
              <h1 className="display-4">Lista de categorias</h1>
              <div className="row justify-content-center mt-2">
                {categoriasPaginadas.map((categoria) => (
                  <Categoria
                    key={categoria.id}
                    id={categoria.id}
                    nombre={categoria.nombre}
                    descripcion={categoria.descripcion}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="container ">
            <div className="pagination">
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={categorias.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            </div>
        </div>
        <Toaster />
      </div>
    );
  }
}

export default CategoriasLista;
