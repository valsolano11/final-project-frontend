import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AgregarUsuario.css";

import { FaTimes } from "react-icons/fa";


function AgregarUsuario() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!name || !lastName || !email || !phone || !password || !address) {
        throw new Error("Llenar todos los campos es obligatorio.");
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Ingresa una dirección de correo electrónico válida.");
      }
  
      const response = await fetch("http://localhost:7000/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          correo: email,
          celular: phone,
          password: password,
          direccion: address,
        }),
      });
  
      if (response.ok) {
        toast.success("Usuario registrado exitosamente.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        setTimeout(() => {
          navigate("/listausuarios");
        }, 2000);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
  
        if (errorData && errorData.message) {
          if (errorData.message.toLowerCase().includes("obligatorio")) {
            throw new Error(errorData.message);
          } else if (errorData.message.toLowerCase().includes("correo electrónico ya está registrado")) {
            throw new Error("El correo electrónico ya está registrado. Utiliza otro correo.");
          } else {
            throw new Error(`Error al registrar usuario: ${errorData.message}`);
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
      navigate("/listausuarios"); 
    };

  return (
    <>
      <div className="form-container-user">
        <ToastContainer />
        <form className="form-producto" id="formulario">
          <button className="close-button-user" onClick={handleClose}>
            <FaTimes />
          </button>
          <h3>Agregar Nuevo Usuario</h3>
          <div className="form-row">
            <div className="user-group col">
              <label className="form-label-usuario">
                <span className="form-label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ingresa tu nombre"
                required
                className="form-control-usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="user-group col ">
              <label className="form-label-usuario">
                <span className="form-label-text">Apellido</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Ingresa tu apellido"
                required
                className="form-control-usuario"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="user-group col">
              <label className="form-label-usuario">
                <span className="form-label-text">Direccion</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Ingresa tu dirección"
                required
                className="form-control-usuario"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="user-group col">
              <label className="form-label-usuario">
                <span className="form-label-text">Celular</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Ingresa tu celular"
                required
                className="form-control-usuario"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="user-group col">
              <label className="form-label-usuario">
                <span className="form-label-text">Correo</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Ingresa tu email"
                required
                className="form-control-usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="user-group col">
              <label className="form-label-usuario">
                <span className="form-label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                required
                className="form-control-usuario"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="button-agg-producto-guardar"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </form>
      </div>
    </>
  );
}

export default AgregarUsuario;
