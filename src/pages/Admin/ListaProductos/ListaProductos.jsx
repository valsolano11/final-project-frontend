import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./ListaProductos.css";
import { /*  FaEye, */ FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Products from "../../../services/ProductsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuLateral from "../../../components/Admin/MenuLateral/MenuLateral";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MOSTRAR_FILE } from "../../../api/variables";
import  jsPDF  from "jspdf";
/* const categoryNames = {
  1: "Barriles",
  2: "Cantidad de Accesorios",
}; */

function ListaProductos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: 0,
    cantidadEntrada: 0,
    cantidad: 0,
    fechaEntrada: "",
    CategoriaId: 0,
    ProveedorId: 0,
  });
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await Products.getProducts();
        if (Array.isArray(productsData)) {
          productsData.sort((a, b) => a.id - b.id);
          setProductos(productsData);
        } else {
          console.error(
            "Los datos de productos no son un array:",
            productsData
          );
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    loadProducts();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await Products.deleteProduct(id);
      const updatedProducts = productos.filter((product) => product.id !== id);
      setProductos(updatedProducts);
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error(`Error al eliminar producto con ID ${id}:`, error);
      toast.error("Error al eliminar el producto");
    }
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setEditedProduct(product);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedProduct({
      id: null,
      nombre: "",
      descripcion: "",
      precio: 0,
      cantidadEntrada: 0,
      cantidad: 0,
      fechaEntrada: "",
      CategoriaId: 0,
      ProveedorId: 0,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData(); 
      Object.entries(editedProduct).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await Products.updateProduct(editedProduct.id, formData); 
      setEditMode(false);
      const updatedProducts = await Products.getProducts();
      if (Array.isArray(updatedProducts)) {
        updatedProducts.sort((a, b) => a.id - b.id);
        setProductos(updatedProducts);
      } else {
        console.error(
          "Los datos de productos no son un array:",
          updatedProducts
        );
      }
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar la edición del producto:", error);
      toast.error("Error al guardar los cambios");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = productos
    .filter((product) =>
      Object.values(product).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(productos.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "productos.xlsx");
  };

  //la constante para pdf
  const generarPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    let page = 1;
    const lineHeight = 10;

    productos.forEach((productos, index) => {
      const { id, nombre, descripcion, precio, cantidadEntrada, cantidad,fechaEntrada,CategoriaId,Imagen,ProveedorId} = productos;

     const data = [
    `ID: ${id}`,
        `Nombre: ${nombre}`,
        `Descripcion: ${descripcion}`,
        `Precio: ${ precio}`,
        `Cantidad Entrada: ${cantidadEntrada}`,
         `Celular: ${ cantidad}`,
         `fechaEntrada: ${  fechaEntrada}`,
          `CategoriaId: ${  CategoriaId}`,
          `Imagen: ${ Imagen}`,
          `ProveedorId: ${  ProveedorId}`,
        
   
      ];

      const maxLineLength = data.reduce(
        (max, line) => Math.max(max, doc.getStringUnitWidth(line)),
        0
      );

      if (yPos + lineHeight * data.length > 280) {
        doc.addPage();
        yPos = 20;
        page++;
        doc.text("Tabla de usuarios (página " + page + ")", 95, 10);
      }

      data.forEach((line, i) => {
        const lineYPos = yPos + lineHeight * i;
        doc.text(line, 10, lineYPos);
      });

      yPos += lineHeight * (data.length + 1);
    });

    doc.save("productos.pdf");
  };
  return (
    <>
      <MenuLateral />
      <ToastContainer />
      <div className="ProductosContainer">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Productos"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearchInputChange}>
            <CiSearch className="search-icon" />
          </button>
        </div>

        <div className="buttons-agg">
          <button
            className="Agregar-producto"
            /* onClick={handleToggleAddProductForm} */
          >
            <Link to="/agregarProducto">
              <FaPlus />
            </Link>
          </button>
        </div>

        <table className="table-productos">
          <thead>
            <tr className="header-table-products">
              <th scope="col" className="header-product-table">
                ID
              </th>
              <th scope="col" className="header-product-table">
                Nombre
              </th>
              <th scope="col" className="header-product-table">
                Descripción
              </th>
              <th scope="col" className="header-product-table">
                Precio
              </th>
              <th scope="col" className="header-product-table">
                Cantidad Entrada
              </th>
              <th scope="col" className="header-product-table">
                Cantidad
              </th>
              <th scope="col" className="header-product-table">
                Fecha Entrada
              </th>
              <th scope="col" className="header-product-table">
                Imagen
              </th>
              <th scope="col" className="header-product-table">
                Categoría
              </th>
              <th scope="col" className="header-product-table">
                Proveedor
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
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                <td>{product.descripcion}</td>
                <td>{product.precio}</td>
                <td>{product.cantidadEntrada}</td>
                <td>{product.cantidad}</td>
                <td>{new Date(product.fechaEntrada).toLocaleDateString()}</td>
                <td>
                  <img
                    src={MOSTRAR_FILE(product.image)}
                    alt={product.nombre}
                    width="100"
                    height="100 "
                  />
                </td>
                <td>{product.CategoriaId}</td>
                <td>{product.ProveedorId}</td>
                <td>
                  <div className="buttons-products">
                    {/*                     <button className="button-producto-especifico">
                      <Link to={`/productoEspecifico/${product.id}`}>
                        <FaEye />
                      </Link>
                    </button> */}
                    {!editMode && (
                      <>
                        <button
                          className="Editar-producto"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="Eliminar-producto"
                          onClick={() => handleDeleteProduct(product.id)}
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
          <div className="edit-product-form">
            <h3>Editar Producto</h3>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="nombre" className="campos-form-edit-product">
                Nombre:
              </label>
              <input
                className="inputs-form-edit-product"
                type="text"
                id="nombre"
                name="nombre"
                value={editedProduct.nombre}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, nombre: e.target.value })
                }
              />

              <label htmlFor="descripcion" className="campos-form-edit-product">
                Descripción:
              </label>
              <input
                className="inputs-form-edit-product"
                type="text"
                id="descripcion"
                name="descripcion"
                value={editedProduct.descripcion}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    descripcion: e.target.value,
                  })
                }
              />

              <label htmlFor="precio" className="campos-form-edit-product">
                Precio:
              </label>
              <input
                className="inputs-form-edit-product"
                type="number" // Cambiado a tipo number
                id="precio"
                name="precio"
                value={editedProduct.precio}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, precio: e.target.value })
                }
              />

              <label
                htmlFor="cantidadEntrada"
                className="campos-form-edit-product"
              >
                Cantidad Entrada:
              </label>
              <input
                className="inputs-form-edit-product"
                type="number" // Cambiado a tipo number
                id="cantidadEntrada"
                name="cantidadEntrada"
                value={editedProduct.cantidadEntrada}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    cantidadEntrada: e.target.value,
                  })
                }
              />

              <label htmlFor="cantidad" className="campos-form-edit-product">
                Cantidad:
              </label>
              <input
                className="inputs-form-edit-product"
                type="number" // Cambiado a tipo number
                id="cantidad"
                name="cantidad"
                value={editedProduct.cantidad}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    cantidad: e.target.value,
                  })
                }
              />

              <label
                htmlFor="fechaEntrada"
                className="campos-form-edit-product"
              >
                Fecha Entrada:
              </label>
              <input
                className="inputs-form-edit-product"
                type="date" // Cambiado a tipo date
                id="fechaEntrada"
                name="fechaEntrada"
                value={editedProduct.fechaEntrada}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    fechaEntrada: e.target.value,
                  })
                }
              />
              <label htmlFor="imagen" className="campos-form-edit-product">
                Imagen:
              </label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    imagen: e.target.files[0], // Guardamos el archivo seleccionado en el estado
                  })
                }
              />

              <label htmlFor="CategoriaId" className="campos-form-edit-product">
                Categoría ID:
              </label>
              <input
                className="inputs-form-edit-product"
                type="number" // Cambiado a tipo number
                id="CategoriaId"
                name="CategoriaId"
                value={editedProduct.CategoriaId}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    CategoriaId: e.target.value,
                  })
                }
              />

              <label htmlFor="ProveedorId" className="campos-form-edit-product">
                Proveedor ID:
              </label>
              <input
                className="inputs-form-edit-product"
                type="number" // Cambiado a tipo number
                id="ProveedorId"
                name="ProveedorId"
                value={editedProduct.ProveedorId}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    ProveedorId: e.target.value,
                  })
                }
              />

              <div className="container-button-form-edit-product">
                <button type="submit" className="button-guardar-edit-product">
                  Guardar
                </button>
                <button
                  type="button"
                  className="button-cancelar-edit-product"
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

export default ListaProductos;
