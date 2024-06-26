import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AgregarProducto.css";
import { FaTimes } from "react-icons/fa";
import api from "../../api/query";

function Register() {
  const navigate = useNavigate();

  const [id, setid] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidadEntrada, setCantidadEntrada] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [CategoriaId, setCategoriaId] = useState(0);
  const [ProveedorId, setProveedorId] = useState(0);
  const [Imagen, setImagen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    try {
      if (
        !nombre ||
        !descripcion ||
        !precio ||
        !cantidadEntrada ||
        !cantidad ||
        !fechaEntrada ||
        !CategoriaId ||
        !ProveedorId
      ) {
        throw new Error("Llenar todos los campos es obligatorio.");
      }

      const response = await api.post("/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.data.id) {
        toast.success("Producto registrado exitosamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/listaproductos");
        }, 2000);
      } else {
        // const errorData = await response.json().catch(() => null);

        // if (errorData && errorData.issues) {
        //   const errorMessage = errorData.issues
        //     .map((issue) => issue.message)
        //     .join("\n");
        //   throw new Error(`Error al registrar producto: ${errorMessage}`);
        // } else {
        throw new Error(`Error al registrar producto.`);
        // }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleClose = () => {
    navigate("/listaproductos"); // Redirige al usuario a la lista de productos al cerrar el formulario
  };

  return (
    <>
      <div className="form-container">
        <ToastContainer />
        <form className="form-producto" id="formulario" onSubmit={handleSubmit}>
          <button className="close-button-producto" onClick={handleClose}>
            <FaTimes />
          </button>{" "}
          {/* Botón de cierre con el icono "X" */}
          <h3>Agregar Producto</h3>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">id</span>
              </label>
              <input
                className="form-control-producto"
                placeholder="Ingrese su nombre"
                required
                type="text"
                id="id"
                name="id"
                value={id}
                onChange={(e) => setid(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="producto-group col ">
                <label className="form-label-productos">
                  <span className="form-label-text">Nombre</span>
                </label>
                <input
                  className="form-control-producto"
                  placeholder="Ingrese su nombre"
                  required
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Descripción</span>
              </label>
              <input
                className="form-control-producto"
                placeholder="Ingresa la descripción del producto"
                required
                type="text"
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Precio</span>
              </label>
              <input
                type="number"
                name="precio"
                placeholder="Ingresa el precio del producto"
                required
                className="form-control-producto"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </div>

            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Cantidad De Entrada</span>
              </label>
              <input
                type="number"
                name="cantidadEntrada"
                placeholder="Ingresa la cantidad de entrada del producto"
                required
                className="form-control-producto"
                value={cantidadEntrada}
                onChange={(e) => setCantidadEntrada(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Cantidad</span>
              </label>
              <input
                type="number"
                name="cantidad"
                placeholder="Ingresa la cantidad del producto"
                required
                className="form-control-producto"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Fecha de Entrada</span>
              </label>
              <input
                type="date"
                name="fechaEntrada"
                placeholder="Ingresa la fecha de entrada del producto"
                required
                className="form-control-producto"
                value={fechaEntrada}
                onChange={(e) => setFechaEntrada(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Categoría</span>
              </label>
              <input
                type="number"
                name="CategoriaId"
                placeholder="Ingresa la CategoriaId del producto"
                required
                className="form-control-producto"
                value={CategoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              />
            </div>
            <div className="producto-group col ">
              <label className="form-label-productos">
                <span className="form-label-text">Proveedor</span>
              </label>
              <input
                type="number"
                name="ProveedorId"
                placeholder="Ingresa la ProveedorId del producto"
                required
                className="form-control-producto"
                value={ProveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
              />
            </div>
          </div>
          <div className="producto-group col">
            <label className="form-label-productos">
              <span className="form-label-text">Imagen</span>
            </label>
            <input
              className="form-control-producto"
              required
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={(e) => setImagen(e.target.value)}
            />
          </div>
          <button type="submit" className="button-agg-producto-guardar">
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
