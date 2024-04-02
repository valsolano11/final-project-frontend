import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AgregarMetodo.css";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

function agregarMetodo() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!nombre) {
        throw new Error("El nombre es obligatorio.");
      }

      const response = await fetch("http://localhost:7000/metodopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  
          nombre: nombre,
        }),
      });

      if (response.ok) {
        toast.success("Metodo agregada exitosamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/listametodopago");
        }, 2000);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);

        if (errorData && errorData.message) {
          if (errorData.message.toLowerCase().includes("obligatorio")) {
            throw new Error(errorData.message);
          } else {
            throw new Error(`Error el metodo de pago: ${errorData.message}`);
          }
        }
      } else {
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.message) {
          throw new Error(`Error: ${errorData.message}`);
        }
      }
    } catch (error) {
      toast.error(error.message, {
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
     navigate("/listametodopago"); // Redirige al usuario a la lista de productos al cerrar el formulario
   };


  return (
    <>
      <div className="form-container">
        <ToastContainer />
        <form className="form-producto">
          <button className="close-button-producto" onClick={handleClose}>
            <FaTimes />
          </button>{" "}
          <h3>Agregar Nuevo Metodo de Pago</h3>
          <div className="form-row">
            <div className="metodo-group">
              <label className="form-label-text">Id</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ingresa el ID"
                required
                className="form-control-metodo"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>
          <div className="categoria-group">
            <label className="form-label-text">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresa el nombre"
              required
              className="form-control-categoria"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="container-buttons-agregar-categorias">
            <div className="container-button-metodo">
              <button
                className="button-guardar-metodo"
                type="button"
                onClick={handleSubmit}
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default agregarMetodo;
