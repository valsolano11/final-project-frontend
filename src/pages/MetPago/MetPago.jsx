import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useCartContext } from "./../../Context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MetPago.css";

function MetPago() {
  const { carrito } = useCartContext();
  const ivaPorcentaje = 0.19;
  const [metodoPago, setMetodoPago] = useState("");

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

  const handlePagar = () => {
    if (!metodoPago) {
      toast.error("Por favor, selecciona un método de pago.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      if (metodoPago === "efectivo") {
        window.open("https://web.whatsapp.com/send?phone=573228694101", "_blank");
      } else {
        // Aquí iría el código para procesar el pago con otro método (por ejemplo, MercadoPago)
        // Por ahora solo muestro una alerta
        toast.success("Pago procesado con éxito.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="body-container-page">
        <div className="metodo-pago-container">
          <h1>Seleccionar método de pago</h1>
          <form className="metodo-pago-form">
            <label className="label-metpago">
              <input
                type="radio"
                name="metodoPago"
                value="efectivo"
                onChange={() => setMetodoPago("efectivo")}
              />
              Efectivo
            </label>
            <label className="label-metpago">
              <input
                type="radio"
                name="metodoPago"
                value="tarjeta"
                onChange={() => setMetodoPago("tarjeta")}
              />
              Tarjeta de débito o crédito
            </label>
          </form>
          <div className="container-button-metpago">
            <button className="pagar-btn" onClick={handlePagar}>
              Pagar
            </button>
          </div>
        </div>

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

export default MetPago;
