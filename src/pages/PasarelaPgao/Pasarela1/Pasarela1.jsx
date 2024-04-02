/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./../../../components/Navbar/Navbar";
import { useCartContext } from "../../../Context/CartContext";
import crearDetalleFactura from "../../../services/DetalleFacturaService";
import "./Pasarela1.css";

function Pasarela1() {
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const navigate = useNavigate();
  const { carrito } = useCartContext();
  const ivaPorcentaje = 0.19;

  useEffect(() => {
    fetch("http://localhost:7000/usuarios")
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const user = data[i];
          if (user.correo === localStorage.getItem("correo")) {
            setUsuarioLogeado(user);
            localStorage.setItem("rolUser", user.RolId);
            break;
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, []);

  if (!usuarioLogeado) {
    return <div>Error: No se encontraron datos del usuario.</div>;
  }

  const { nombre, correo, celular, direccion } = usuarioLogeado;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!codigoPostal || !ciudad) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      await Promise.all(
        carrito.map(async (producto) => {
          const subtotal = producto.cantidad * parseFloat(producto.precio);
          await crearDetalleFactura({
            cantidad: producto.cantidad,
            subtotal: subtotal,
            ProductoId: producto.id,
          });
        })
      );

      const fechaHoraActual = new Date();
      const fechaHoraFormateada = fechaHoraActual.toLocaleString();
      localStorage.setItem("fechaHora", fechaHoraFormateada);

      localStorage.setItem("codigopostal", codigoPostal);
      localStorage.setItem("ciudad", ciudad);
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("correo", correo);
      localStorage.setItem("ciudad", ciudad);
      localStorage.setItem("celular", celular);
      localStorage.setItem("direccion", direccion);

      toast.success("¡Detalle de factura creado con éxito!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate("/metpago");
      }, 2000);
    } catch (error) {
      console.error("Error al crear el detalle de factura:", error.message);
      toast.error("Error al crear el detalle de factura.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCodigoPostalChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setCodigoPostal(value);
  };

  const handleCorreoElectronicoChange = (event) => {
    const email = event.target.value;
    setEmailValido(validateEmail(email));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const subtotal = carrito.reduce(
    (total, item) => total + item.cantidad * parseFloat(item.precio),
    0
  );
  const iva = subtotal * ivaPorcentaje;
  const total = subtotal + iva;

  const formattedSubtotal = subtotal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedIva = iva.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedTotal = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="container-tittle-page">
        <h1 className="tittle-page-pasarela">Pasar por Caja</h1>
      </div>
      <div className="body-container-page">
        <form
          className="formulario-pasarela"
          onSubmit={handleSubmit}
          noValidate
        >
          <h1 className="opcion-entrega">Opción de Entrega</h1>
          <div className="opciones-segment-two">
            <input
              className="inputs-segment-two-nombre"
              type="text"
              placeholder="Nombre"
              value={nombre}
              required
              readOnly
            />
          </div>

          <div className="opciones-segment-direccion">
            <input
              className="input-direccion"
              type="text"
              placeholder="Direccion"
              value={direccion}
              required
              readOnly
            />
          </div>

          <div className="opciones-segment-three">
            <input
              className="inputs-segment-three-postal"
              type="text"
              placeholder="Codigo Postal"
              value={codigoPostal}
              onChange={handleCodigoPostalChange}
              required
            />
            <input
              className="inputs-segment"
              type="text"
              placeholder="Ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </div>

          <div className="opciones-segment-fourt">
            <input
              className="inputs-segment-fourt-email"
              type="email"
              placeholder="Correo Electronico"
              value={correo}
              onChange={handleCorreoElectronicoChange}
              required
              readOnly
            />
            {!emailValido && (
              <p className="error-email">Correo electrónico no válido.</p>
            )}
            <input
              className="inputs-segment"
              type="text"
              placeholder="Número de Teléfono"
              value={celular}
              pattern="[0-9]+"
              required
              readOnly
            />
          </div>
          <div className="container-button-pasarela">
            <button className="button-pasarela" type="submit">
              Continuar
            </button>
          </div>
        </form>

        <div className="carrito-container">
          <div className="sale-cart">
            <h3>Tu Carrito</h3>
            <div className="resumen-item">
              <span>Subtotal:</span>
              <span>${formattedSubtotal}</span>
            </div>
            <div className="resumen-item">
              <span>IVA:</span>
              <span>${formattedIva}</span>
            </div>
            <div className="resumen-item-total">
              <span>Total:</span>
              <span>${formattedTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pasarela1;
