import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import Logo from "../../assets/img/LogoBarrel.png";
import axios from "axios";
import "./NavbarStyle.css";
import { useCartContext } from "../../Context/CartContext";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showTiendaMenu, setShowTiendaMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const userOptionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchButtonClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/productos?nombre_like=${searchQuery}`
      );
      const filteredResults = response.data.filter((producto) => {
        return (
          producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  const toggleMainMenu = () => {
    setShowMainMenu(!showMainMenu);
    setShowMenu(!showMenu);
    setShowUserOptions(false);
  };

  const toggleTiendaMenu = () => {
    setShowTiendaMenu(!showTiendaMenu);
    setShowUserOptions(false);
  };

  const toggleUserOptions = () => {
    setShowUserOptions(!showUserOptions);
    setShowMainMenu(false);
    setShowMenu(false);
    setShowTiendaMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  const { carrito } = useCartContext();
  const [showRedIcon, setShowRedIcon] = useState(false);

  useEffect(() => {
    setShowRedIcon(carrito.length > 0);
  }, [carrito]);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img className="logo-page" src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="menu-toggle" onClick={toggleMainMenu}>
        ☰
      </div>

      <div className={`list-navbar ${showMenu ? "show-menu" : ""}`}>
        <ul className="menu">
          <li className="menu-item">
            <Link to="/">Inicio</Link>
          </li>

          <li className="menu-item">
            <Link to="#" onClick={toggleTiendaMenu}>
              Tienda
            </Link>
          </li>
          {showTiendaMenu && (
            <ul className="tienda-menu">
              <li className="menu-tienda-item">
                <Link className="item-tienda" to="/producto">
                  Barriles
                </Link>
              </li>
              <li className="menu-tienda-item">
                <Link className="item-tienda" to="/accesorios">
                  Accesorios
                </Link>
              </li>
            </ul>
          )}

          <li className="menu-item">
            <Link to="/contacto">Contacto</Link>
          </li>
        </ul>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="¿Qué necesitas encontrar?"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearchButtonClick}>
          <CiSearch className="search-icon" />
        </button>
        {searchResults.length > 0 && (
          <div className="search-results">
            <ul>
              {searchResults.map((result) => (
                <li className="item-list-product" key={result.id}>
                  <Link to={`/vermas/${result.id}`}>
                    {result.nombre.length > 15
                      ? `${result.nombre.slice(0, 15)}...`
                      : result.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="icons-container">
        <div className="container-car">
          <Link to="/carritoCompras">
          {showRedIcon && <div className="red-icon"></div>}
            <CiShoppingCart className="icon-navbar" />
          </Link>
        </div>

        <div
          className="container-user"
          ref={userOptionsRef}
          onClick={toggleUserOptions}
        >
          <CiUser className="icon-navbar" />
          {showUserOptions && (
            <div className="user-options">
              {isLoggedIn ? (
                <div className="container-menu">
                  <ul>
                    <li>
                      <Link className="perfil-usuario" to="/perfilpage">
                        Mi perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="cerrar-Sesion" onClick={handleLogout}>
                        Cerrar Sesión
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : (
                <ul>
                  <li>
                    <Link to="/login">Iniciar Sesión</Link>
                  </li>
                  <li>
                    <Link to="/register">Registrarse</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
