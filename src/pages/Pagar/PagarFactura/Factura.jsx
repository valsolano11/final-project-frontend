import { useState, useEffect } from "react";
import "./Factura.css";
import Navbar from "../../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const Factura = () => {
  const [facturaInfo, setFacturaInfo] = useState({
    direccion: localStorage.getItem("direccion") || "",
    fechaHora: localStorage.getItem("fechaHora") || "",
    nombreDestinatario: localStorage.getItem("nombre") || "",
    codigoDestinatario: localStorage.getItem("codigopostal") || "",
    ciudadDestinatario: localStorage.getItem("ciudad") || "",
    correoDestinatario: localStorage.getItem("correo") || "",
    telefonoDestinario: localStorage.getItem("celular") || "",
    metodoDestinatario: localStorage.getItem("metodoPago") || "",
    estado: "Pagado",
    productos: [],
  });

  const handleDescargarFactura = () => {
    //   la logica
  };

  return (
    <>
      <Navbar />
      <div className="factura">
        <h1 className="titulo">Factura</h1>
        <hr />
        <div className="informacion">
          <p>Fecha de Emisión: {facturaInfo.fechaHora}</p>
          <p>Nombre Destinatario: {facturaInfo.nombreDestinatario} </p>
          <p>
            Correo Electronico Destinatario: {facturaInfo.correoDestinatario}
          </p>
          <p>Telefono Destinatario: {facturaInfo.telefonoDestinario}</p>
          <p>
            Dirección: {facturaInfo.direccion} | Ciudad:{" "}
            {facturaInfo.ciudadDestinatario} | Codigo Postal:{" "}
            {facturaInfo.codigoDestinatario}{" "}
          </p>
          <p>Método de Pago: {facturaInfo.metodoDestinatario}</p>
          <p>Estado: {facturaInfo.estado}</p>
        </div>
        <hr />
        <div className="productos">
          {/* Aquí puedes mapear los productos y mostrar la información */}
        </div>
        <hr />
        <div className="total">
          <p>Total: {/* Aquí calcula el total de los productos */}</p>
        </div>
        <button onClick={handleDescargarFactura}>Descargar Factura</button>
        <Link to="/">
          <button className="facturita">Salir</button>
        </Link>
      </div>
    </>
  );
};

export default Factura;
