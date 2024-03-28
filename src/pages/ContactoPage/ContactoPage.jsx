import React, { useState, useRef } from 'react';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { TbClockHour6 } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';
import './Contacto.css';

function ContactoPage() {
  const form = useRef();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Verificar si algún campo está vacío
    if (!formData.user_name || !formData.user_email || !formData.message) {
      toast.error('Por favor, completa todos los campos antes de enviar el formulario.');
      return;
    }

    emailjs
      .sendForm('service_lji9t6d', 'template_j9q7z54', form.current, {
        publicKey: '5_7nNs3LjvBITT5ly',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          toast.success('¡Email enviado correctamente!');
          setFormData({ user_name: '', user_email: '', message: '' }); // Limpiar los campos después de enviar
        },
        (error) => {
          console.log('FAILED...', error.text);
          toast.error('Error al enviar el email. Por favor, inténtalo de nuevo.');
        },
      );
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container-contacto">
        <div className="contact-form">
          <h2>Contacta con nosotros</h2>
          <p>Siéntase libre de contactarnos en cualquier momento. Nos comunicaremos con usted tan pronto como podamos.</p>
          <form ref={form} onSubmit={sendEmail}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" name="user_name" value={formData.user_name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="user_email" value={formData.user_email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea name="message" rows="2" value={formData.message} onChange={handleInputChange}></textarea>
            </div>
            <input className="boton-contacto" type="submit" />
          </form>
          <div className="info-container-contacto">
            <h3>Información</h3>
            <ul>
              <li><Link to="mailto:barrelglow@gmail.com"><MdOutlineMailOutline className="icono-correo" />barrelglow@gmail.com</Link></li>
              <li><Link to="tel:+6041234567"><FiPhone className="icono-telefono" /> +604 1234567</Link></li>
              <li><TbClockHour6 className="icono-hora" />7:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactoPage;
