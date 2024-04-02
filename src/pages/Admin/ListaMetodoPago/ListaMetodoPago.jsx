import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./ListaMetodoPago.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuLateral from "../../../components/Admin/MenuLateral/MenuLateral";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MetodoPagoService from "../../../services/MetodoPagoService";
import { jsPDF } from "jspdf";

function ListaMetodoPago() {
  const [searchQuery, setSearchQuery] = useState("");
  const [MetodosPago, setMetodoPago] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [editMode, setEditMode] = useState(false);
  const [editedMetodoPago, setEditedMetodoPago] = useState({
    id: null,
    nombre: "",
  });

  useEffect(() => {
    const loadMetodoPago = async () => {
      try {
        const metodoPagoData = await MetodoPagoService.getMetodosPago();
        if (Array.isArray(metodoPagoData)) {
          const sortedMetodoPago = [...metodoPagoData].sort(
            (a, b) => a.id - b.id
          );
          setMetodoPago(sortedMetodoPago);
        } else {
          console.error(
            "Los datos del metodo de pago no son un arreglo:",
            metodoPagoData
          );
        }
      } catch (error) {
        console.error("Error al obtener metodo de pago:", error);
      }
    };

    loadMetodoPago();
  });

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteMetodoPago = async (id) => {
    try {
      await MetodoPagoService.deleteMetodoPago(id);
      const updatedMetodoPago = MetodosPago.filter(
        (metodo) => metodo.id !== id
      );
      setMetodoPago(updatedMetodoPago);
      toast.success("El metodo eliminado correctamente");
    } catch (error) {
      console.error(`Error al eliminar metodo con ID ${id}:`, error);
      toast.error("Error al eliminar el metodo");
    }
  };

  const handleEditMetodoPago = (metodo) => {
    setEditMode(true);
    setEditedMetodoPago(metodo);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedMetodoPago({
      id: null,
      nombre: "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await MetodoPagoService.updateMetodoPago(
        editedMetodoPago.id,
        editedMetodoPago
      );
      setEditMode(false);
      const updatedMetodoPago = await MetodoPagoService.getMetodosPago();
      updatedMetodoPago.sort((a, b) => a.id - b.id);
      setMetodoPago(updatedMetodoPago);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMetodo = MetodosPago.filter((metodo) =>
    Object.values(metodo).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(MetodoPagoService.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(MetodoPagoService);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MetodoPago");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "metodoPago.xlsx");
  };

const generarPDF = () => {
  const doc = new jsPDF();
  let yPos = 20;
  let page = 1;
  const lineHeight = 10;

  MetodosPago.forEach((metodospago, index) => {
    const { id, nombre } = metodospago;

    const data = [`ID: ${id}`, `Nombre: ${nombre}`];

    const maxLineLength = data.reduce(
      (max, line) => Math.max(max, doc.getStringUnitWidth(line)),
      0
    );

    if (yPos + lineHeight * data.length > 280) {
      doc.addPage();
      yPos = 20;
      page++;
      doc.text("Tabla de metodopago (página " + page + ")", 95, 10);
    }

    data.forEach((line, i) => {
      const lineYPos = yPos + lineHeight * i;
      doc.text(line, 10, lineYPos);
    });

    yPos += lineHeight * (data.length + 1);
  });

  doc.save("metodopago.pdf");
};
  return (
    <>
      <MenuLateral />
      <ToastContainer />
      <div className="ProveedoresContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Metodo pago"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearchInputChange}>
            <CiSearch className="search-icon" />
          </button>
        </div>

        <div className="buttons-agg-metodo">
          <button className="Agregar-metodopago">
            <Link to="/agregarMetodo">
              <FaPlus />
            </Link>
          </button>
        </div>

        <table className="table-proveedores">
          <thead>
            <tr>
              <th scope="col" className="header-table-proveedores">
                ID
              </th>
              <th scope="col" className="header-table-proveedores">
                Nombre
              </th>
              <th scope="col">
                <button className="export" onClick={exportToExcel}>
                  Exportar a Excel{" "}
                </button>
              </th>
              <th scope="col">
                <button className="export" onClick={generarPDF}>
                  Exportar a PDF
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentMetodo.map((metodo) => (
              <tr key={metodo.id}>
                <td>{metodo.id}</td>
                <td>{metodo.nombre}</td>
                <td>
                  <div className="buttons-proveedores">
                    {!editMode && (
                      <>
                        <button
                          className="Editar-proveedor"
                          onClick={() => handleEditMetodoPago(metodo)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Eliminar-proveedor"
                          onClick={() => handleDeleteMetodoPago(metodo.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editMode && (
          <div className="edit-proveedor-form">
            <h3>Editar Proveedor</h3>
            <form>
              <label className="campos-form-proveedor">Nombre:</label>
              <input
                className="inputs-form-proveedor"
                type="text"
                id="nombre"
                name="nombre"
                value={editedMetodoPago.nombre}
                onChange={(e) =>
                  setEditedMetodoPago({
                    ...editedMetodoPago,
                    nombre: e.target.value,
                  })
                }
              />

              <button
                type="button"
                className="Guardar-edit"
                onClick={handleSaveEdit}
              >
                Guardar
              </button>
              <button
                type="button"
                className="Cancelar-edit"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        <div className="pagination-container">
          {pageNumbers.map((number) => (
            <span
              key={number}
              className={`pagination-number ${
                number === currentPage ? "active" : ""
              }`}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default ListaMetodoPago;
