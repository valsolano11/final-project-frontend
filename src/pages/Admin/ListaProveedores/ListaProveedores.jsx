import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import "./ListaProveedores.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Proveedores from "../../../services/ProveedoresService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuLateral from "../../../components/Admin/MenuLateral/MenuLateral";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ListaProveedores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [editMode, setEditMode] = useState(false);
  const [editedProveedor, setEditedProveedor] = useState({
    id: null,
    nombre: "",
    direccion: "",
    celular: "",
  });

  useEffect(() => {
    const loadProveedores = async () => {
      try {
        const proveedoresData = await Proveedores.getProveedores();
        if (Array.isArray(proveedoresData)) {
          const sortedProveedores = [...proveedoresData].sort(
            (a, b) => a.id - b.id
          );
          setProveedores(sortedProveedores);
        } else {
          console.error(
            "Los datos de proveedores no son un arreglo:",
            proveedoresData
          );
        }
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    loadProveedores();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteProveedor = async (id) => {
    try {
      await Proveedores.deleteProveedor(id);
      const updatedProveedores = proveedores.filter((prov) => prov.id !== id);
      setProveedores(updatedProveedores);
      toast.success("Proveedor eliminado correctamente");
    } catch (error) {
      console.error(`Error al eliminar proveedor con ID ${id}:`, error);
      toast.error("Error al eliminar el proveedor");
    }
  };

  const handleEditProveedor = (prov) => {
    setEditMode(true);
    setEditedProveedor(prov);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedProveedor({
      id: null,
      nombre: "",
      direccion: "",
      celular: "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await Proveedores.updateProveedor(editedProveedor.id, editedProveedor);
      setEditMode(false);
      const updatedProveedores = await Proveedores.getProveedores();
      updatedProveedores.sort((a, b) => a.id - b.id);
      setProveedores(updatedProveedores);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error(`Error al guardar la edición del proveedor:`, error);
      toast.error("Error al guardar los cambios");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = proveedores
    .filter((prov) =>
      Object.values(prov).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(proveedores.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(proveedores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proveedores");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "proveedores.xlsx");
  };
  return (
    <>
      <MenuLateral />
      <ToastContainer />
      <div className="ProveedoresContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Proveedores"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearchInputChange}>
            <CiSearch className="search-icon" />
          </button>
        </div>

        <div className="buttons-agg-proveedor">
          <button className="Agregar-proveedor">
            <Link to="/agregarproveedores">
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
              <th scope="col" className="header-table-proveedores">
                Dirección
              </th>
              <th scope="col" className="header-table-proveedores">
                Celular
              </th>
              <th scope="col">
                <button className="export" onClick={exportToExcel}>
                  Exportar a Excel{" "}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProveedores.map((prov) => (
              <tr key={prov.id}>
                <td>{prov.id}</td>
                <td>{prov.nombre}</td>
                <td>{prov.direccion}</td>
                <td>{prov.celular}</td>
                <td>
                  <div className="buttons-proveedores">
                    {!editMode && (
                      <>
                        <button
                          className="Editar-proveedor"
                          onClick={() => handleEditProveedor(prov)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Eliminar-proveedor"
                          onClick={() => handleDeleteProveedor(prov.id)}
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
          <div className="form-container">
            <form className="form-producto" id="formulario">
              <h3>Editar Proveedor</h3>
              <div className="form-row">
                <div className="producto-group col ">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Id</span>
                  </label>
                  <input
                    className="form-control-producto"
                    type="text"
                    id="id"
                    name="id"
                    value={editedProveedor.id} 
                    onChange={(e) =>
                      setEditedProveedor({
                        ...editedProveedor,
                        id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="producto-group col ">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Nombre</span>
                  </label>
                  <input
                    className="form-control-producto"
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={editedProveedor.nombre}
                    onChange={(e) =>
                      setEditedProveedor({
                        ...editedProveedor,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="producto-group col ">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Dirección</span>
                  </label>
                  <input
                    className="form-control-producto"
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={editedProveedor.direccion}
                    onChange={(e) =>
                      setEditedProveedor({
                        ...editedProveedor,
                        direccion: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="producto-group col ">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Celular</span>
                  </label>
                  <input
                    className="form-control-producto"
                    type="text"
                    id="celular"
                    name="celular"
                    value={editedProveedor.celular}
                    onChange={(e) =>
                      setEditedProveedor({
                        ...editedProveedor,
                        celular: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="container-button-form-edit-user">
                <button
                  type="button"
                  className="button-guardar-edit-user"
                  onClick={handleSaveEdit}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="button-cancelar-edit-user"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              </div>
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

export default ListaProveedores;
