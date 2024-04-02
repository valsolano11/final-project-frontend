/* eslint-disable react-hooks/exhaustive-deps */
// components/Contraseña.jsx

import { useState, useRef, useEffect } from "react";
import "./Contraseña.css";
import Navbar from "../../components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecoveryService from "../../services/RecuperacionService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Contraseña = () => {
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef(Array(6).fill(null));
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e, index) => {
      if (e.key === "ArrowRight" && index < verificationCode.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };

    inputRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener("keydown", (e) => handleKeyDown(e, index));
      }
    });

    return () => {
      inputRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener("keydown", (e) => handleKeyDown(e, index));
        }
      });
    };
  }, [verificationCode]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        throw new Error("Por favor, ingresa tu correo electrónico.");
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Por favor, ingresa un correo electrónico válido.");
      }
      setSentCode(true);

      await RecoveryService.enviarCodigoRecuperacion(email);
    } catch (error) {
      toast.error(error.message);
      setSentCode(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const updatedVerificationCode = [...verificationCode];
    updatedVerificationCode[index] = value;
    setVerificationCode(updatedVerificationCode);

    if (value && index < verificationCode.length - 1) {
      inputRefs.current[index + 1].focus();
      inputRefs.current[index + 1].setSelectionRange(0, 0);
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
      inputRefs.current[index - 1].setSelectionRange(2, 2);
    }
  };

  const handleVerificationCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = verificationCode.join("");
      await RecoveryService.validarCodigoRecuperacion(token);
      toast.success("Código de verificación válido.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setShowChangePasswordForm(true);
    } catch (error) {
      toast.error("Código de verificación inválido.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await RecoveryService.actualizarContraseña(newPassword, email);
      toast.success("Contraseña actualizada correctamente.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Ocurrió un error al actualizar la contraseña.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleResendCode = async () => {
    try {
      await RecoveryService.enviarCodigoRecuperacion(email);
      toast.success("Código de recuperación reenviado correctamente.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Ocurrió un error al reenviar el código de recuperación.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="contraseña-container">
        {!sentCode && (
          <div className="recuperacion-contraseña">
            <div className="contraseña-recuperar">
              <h1>¿Olvidaste tu Contraseña?</h1>
              <p>Ingresa tu email y te ayudaremos</p>
              <form
                className="recuperar-contraseña"
                onSubmit={handleEmailSubmit}
              >
                <div className="recu">
                  <input
                    type="email"
                    placeholder="Ingresa tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="button-recuperar"
                  type="submit"
                  disabled={sentCode}
                >
                  Enviar
                </button>

                <Link className="link-login" to="/login">
                  Iniciar Sesión
                </Link>
                <p>
                  ¿Aún No tienes Cuenta?,{" "}
                  <Link className="link-register" to="">
                    Registrarme
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}

        {sentCode && !showChangePasswordForm && (
          <div className="verificacion">
            <div className="verificacion-contraseña">
              <h1>Ingresa el Código</h1>
              <p>Hemos enviado un código a tu correo: {email}</p>
              <form
                className="verificacion-codigo"
                onSubmit={handleVerificationCodeSubmit}
              >
                <div className="codigo-container">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) =>
                        handleVerificationCodeChange(index, e.target.value)
                      }
                      maxLength="1"
                      required
                    />
                  ))}
                </div>
                <button className="boton-verificacion" type="submit">
                  Verificar Cuenta
                </button>
              </form>
              <Link to="/login" className="link-login">
                Iniciar Sesión
              </Link>
              <p>
                ¿Aún No tiene Cuenta?,{" "}
                <Link className="link-register" to="/register">
                  Registrarse
                </Link>
              </p>
              <p>
                ¿No recibiste el código?{" "}
                <Link onClick={handleResendCode} className="link-register">
                  Reenviar Código
                </Link>
              </p>
            </div>
          </div>
        )}

        {showChangePasswordForm && (
          <div className="cambio-contraseña">
            <h1>Cambiar Contraseña</h1>
            <form
              className="cambio-contraseña-form"
              onSubmit={handleChangePasswordSubmit}
            >
              <input
                className="input-cambiar-contra"
                type="password"
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button className="button-cambiar-contraseña" type="submit">
                Cambiar Contraseña
              </button>
            </form>
            <div className="links-contra">
              <Link to="/login" className="link-login">
                Iniciar Sesión
              </Link>
              <p>
                ¿Aún No tiene Cuenta?,{" "}
                <Link className="link-register" to="/register">
                  Registrarse
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contraseña;
