import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AgregarProveedores.css";
import { FaTimes } from "react-icons/fa";

function AgregarProveedores() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !phone || !address) {
        throw new Error("Llenar todos los campos es obligatorio.");
      }

      const response = await fetch("http://localhost:7000/proveedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          nombre: name,
          celular: phone,
          direccion: address,
        }),
      });

      if (response.ok) {
        toast.success("Proveedor registrado exitosamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/listaproveedores");
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => null);

        if (errorData && errorData.message) {
          throw new Error(`Error al registrar proveedor: ${errorData.message}`);
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
    navigate("/listaproveedores"); // Redirige al usuario a la lista de productos al cerrar el formulario
  };

  return (
    <>
      <div className="form-container">
        <ToastContainer />
        <form className="form-producto" id="formulario">
          <button className="close-button-producto" onClick={handleClose}>
            <FaTimes />
          </button>{" "}
          <h3>Agregar Nuevo Proveedor</h3>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-usuario">
                <span className="form-label-text">Id</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ingrese el ID"
                required
                className="form-control-producto"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="producto-group col ">
              <label className="form-label-usuario">
                <span className="form-label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ingrese el nombre del proveedor"
                required
                className="form-control-producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="producto-group col ">
              <label className="form-label-usuario">
                <span className="form-label-text">Celular</span>
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Ingrese el celular del proveedor"
                required
                className="form-control-producto"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="producto-group col ">
              <label className="form-label-usuario">
                <span className="form-label-text">Dirección</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Ingrese la dirección del proveedor"
                required
                className="form-control-producto"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="container-buttons-agregar-proveedores">
            <button
              type="button"
              className="button-agg-producto-guardar"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AgregarProveedores;
