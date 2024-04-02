import api from "../api/query";
const BASE_URL = "/usuarios";

const Users = {
  getUsers: async (token) => {
    try {
      const response = await api(BASE_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const usersData = await response.data;
        return Array.isArray(usersData) ? usersData : [];
      } else {
        throw new Error("Error al obtener usuarios: Respuesta no exitosa");
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getUserById: async (id, token) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.json();
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  addUser: async (UserData, token) => {
    try {
      const response = await api(BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(UserData),
      });

      if (response.ok) {
        const newUser = await response.data;
        return newUser;
      } else {
        const errorData = await response.data;
        throw new Error(errorData ? errorData.message : "Error al agregar usuario");
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  },

  updateUser: async (id, UserData, token) => {
    try {
      const response = await api(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en los encabezados
          "Content-Type": "application/json",
        },
        body: JSON.stringify(UserData),
      });

      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id, token) => {
    try {
      const response = await api(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en los encabezados
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },
};

export default Users;
