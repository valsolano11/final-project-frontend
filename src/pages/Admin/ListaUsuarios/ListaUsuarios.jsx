import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./ListaUsuarios.css";
import { /* FaEye, */ FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Users from "../../../services/UsuariosService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import MenuLateral from "../../../components/Admin/MenuLateral/MenuLateral";
import api from "../../../api/query";
import { jsPDF } from "jspdf";

import * as XLSX from "xlsx"; 
import { saveAs } from "file-saver";

function ListaUsuarios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    id: null,
    nombre: "",
    apellido: "",
    direccion: "",
    celular: "",
    correo: "",
    createdAt: "",
    RolId: null,
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          const usersData = await response.data;
          setUsuarios(usersData);
        } else {
          throw new Error("Error al obtener usuarios: " + response.statusText);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        toast.error("Error al obtener usuarios: " + error.message, {
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

    loadUsers();
  }, []);



  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteUser = async (id) => {
    try {
      await Users.deleteUser(id);
      const updatedUsers = usuarios.filter((user) => user.id !== id);
      setUsuarios(updatedUsers);
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      toast.error("Error al eliminar el usuario");
    }
  };
  const handleEditUser = (user) => {
    setEditMode(true);
    setEditedUser(user);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedUser({
      id: null,
      nombre: "",
      apellido: "",
      direccion: "",
      celular: "",
      correo: "",
      createdAt: "",
      RolId: null,
    });
  };

const handleSaveEdit = async () => {
  try {
    await Users.updateUser(
      editedUser.id,
      editedUser,
      localStorage.getItem("token")
    );
    setEditMode(false);
    const updatedUsers = usuarios.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setUsuarios(updatedUsers);
    toast.success("Cambios guardados correctamente");
  } catch (error) {
    console.error("Error al guardar la edición del usuario:", error);
    toast.error("Error al guardar los cambios");
  }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = usuarios
    .filter((usuario) =>
      Object.values(usuario).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(usuarios.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const getRolName = (RolId) => {
    if (RolId === 1) {
      return "Admin";
    } else if (RolId === 2) {
      return "User";
    }
    return "";
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

 const exportToExcel = () => {
   const usuariosFiltrados = usuarios.map(
     ({ nombre, apellido, direccion, celular }) => ({
       nombre,
       apellido,
       direccion,
       celular,
     })
   );
   const worksheet = XLSX.utils.json_to_sheet(usuariosFiltrados);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
   const excelBuffer = XLSX.write(workbook, {
     bookType: "xlsx",
     type: "array",
   });
   const data = new Blob([excelBuffer], {
     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   });
   saveAs(data, "usuarios.xlsx");
 };


  return (
    <>
      <MenuLateral />
      <ToastContainer />
      <div className="UsuariosContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Usuarios"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearchInputChange}>
            <CiSearch className="search-icon" />
          </button>
        </div>

        <div className="buttons-agg-user">
          <button
            className="Agregar-usuario" /* onClick={handleToggleAddUserForm} */
          >
            <Link to="/agregarUser">
              <FaPlus />
            </Link>
          </button>
        </div>

        <table className="table-usuarios">
          <thead>
            <tr className="header-table-usuarios">
              <th scope="col" className="header-usuarios-table">
                ID
              </th>
              <th scope="col" className="header-usuarios-table">
                Nombre
              </th>
              <th scope="col" className="header-usuarios-table">
                Apellido
              </th>
              <th scope="col" className="header-usuarios-table">
                Direccion
              </th>
              <th scope="col" className="header-usuarios-table">
                Celular
              </th>
              <th scope="col" className="header-usuarios-table">
                Correo
              </th>
              <th scope="col" className="header-usuarios-table">
                Fecha de creación
              </th>
              <th scope="col" className="header-usuarios-table">
                Rol
              </th>
              <th scope="col">
             
                <button className="export" onClick={exportToExcel}>
                  Exportar a Excel{" "}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.direccion}</td>
                <td>{usuario.celular}</td>
                <td>{usuario.correo}</td>
                <td>{formatDate(usuario.createdAt)}</td>
                <td>{getRolName(usuario.RolId)}</td>
                <td>
                  <div className="buttons-users">
                  
                    {!editMode && (
                      <>
                        <button
                          className="Editar-usuario"
                          onClick={() => handleEditUser(usuario)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Eliminar-usuario"
                          onClick={() => handleDeleteUser(usuario.id)}
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
          <div>
            <ToastContainer />
            <form className="form-producto-user" id="formulario">
              <h1>Editar Usuario</h1>
              <div className="form-row">
                <div className="user-group col">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Nombre</span>
                  </label>
                  <input
                    className="form-control-usuario"
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={editedUser.nombre}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="user-group col">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Apellido</span>
                  </label>
                  <input
                    className="form-control-usuario"
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={editedUser.apellido}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, apellido: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="user-group col">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Direccion</span>
                  </label>
                  <input
                    className="form-control-usuario"
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={editedUser.direccion}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        direccion: e.target.value,
                      })
                    }
                  />
                </div>
                
                <div className="user-group col">
                  <label className="form-label-usuario">
                    <span className="form-label-text">Celular</span>
                  </label>
                  <input
                    className="form-control-usuario"
                    type="text"
                    id="celular"
                    name="celular"
                    value={editedUser.celular}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, celular: e.target.value })
                    }
                  />
                </div>
              </div>
               <div className="user-group col">
                <label className="form-label-usuario">
                  <span className="form-label-text">Correo</span>
                </label>
                <input
                  className="form-control-usuarios"
                  type="text"
                  id="correo"
                  name="correo"
                  value={editedUser.correo}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, correo: e.target.value })
                  }
                />
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
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default ListaUsuarios;
