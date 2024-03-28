/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Error en el CartContext Context");
  }

  return context;
};

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem("carrito")) || []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const actualizarCarrito = () => {
    let dataCarrito = JSON.parse(localStorage.getItem("carrito"));
    setCarrito(dataCarrito);
  };

  const addItemsToCart = (producto) => {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = carrito.findIndex((item) => item.id === producto.id);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, solo actualiza la cantidad
      const updatedCart = [...carrito]; 
      updatedCart[existingProductIndex].cantidad += 1; // Incrementar la cantidad en 1
      setCarrito(updatedCart);
    } else {
      // Si el producto no está en el carrito, agrega el producto con cantidad 1
      setCarrito((prevCart) => [...prevCart, { ...producto, cantidad: 1 }]);
    }
  };

  const deleteItemsToCart = (id) => {
    const nuevaData = carrito.filter((data) => data.id !== id);
    setCarrito(nuevaData);
  };
  
  const actualizarCantidad = (id, cantidad) => {
    let cantidadInt = parseInt(cantidad)
    const productoUpt = carrito.map(producto => {
      if(producto.id === id){
        return {
          ...producto,
          cantidad: cantidadInt
        }
      }
      return producto;
    })
    setCarrito(productoUpt);
  }
  
  return (
    <CartContext.Provider
      value={{ carrito, addItemsToCart, deleteItemsToCart, actualizarCarrito, actualizarCantidad }}
    >
      {children}
    </CartContext.Provider>
  );
};
