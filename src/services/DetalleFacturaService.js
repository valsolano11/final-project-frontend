const BASE_URL = "http://localhost:7000/detalleFactura";

const crearDetalleFactura = async (detalleFacturaData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detalleFacturaData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el detalle de factura.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear el detalle de factura:", error.message);
    throw error;
  }
};

export default crearDetalleFactura;
