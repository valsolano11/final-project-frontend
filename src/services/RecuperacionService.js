const BASE_URL = "http://localhost:7000";

const RecoveryService = {
  enviarCodigoRecuperacion: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/crear-codigo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email }),
      });

      if (response.ok) {
        const datos = await response.json();
        if (datos.recuperacion) {
          localStorage.setItem("datosRecuperacion", datos.recuperacion);
        }
        return { ok: true };
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData
            ? errorData.message
            : "Error al enviar el código de recuperación"
        );
      }
    } catch (error) {
      console.error("Error al enviar el código de recuperación:", error);
      throw error;
    }
  },

  validarCodigoRecuperacion: async (token) => {
    try {
      const recuperacionHeader = localStorage.getItem('datosRecuperacion') != '' ? localStorage.getItem('datosRecuperacion'): ''
      const response = await fetch(`${BASE_URL}/validar-codigo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "recuperacion": recuperacionHeader,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const datos = await response.json();
        if (datos.tokenvalidate) {
          localStorage.setItem("datosRecuperacion", datos.tokenvalidate);
        }
        return { ok: true };
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData ? errorData.message : "Código de verificación inválido");
      }
    } catch (error) {
      console.log(error);
    }
  },

  actualizarContraseña: async (password, correo) => {
    try {
      const validarToken = localStorage.getItem('datosRecuperacion') != '' ? localStorage.getItem('datosRecuperacion'): ''

      const response = await fetch(`${BASE_URL}/nuevo-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "tokenvalidate" : validarToken
        },
        body: JSON.stringify({ password, correo }),
      });

      if (response.ok) {
/*         const myResonse = await response.json(); */
        localStorage.removeItem('datosRecuperacion')
/*         console.log(myResonse) */
        return { ok: true };
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData ? errorData.message : "Error al actualizar la contraseña"
        );
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      // throw new Error(error.message)
    }
  },
};

export default RecoveryService;
