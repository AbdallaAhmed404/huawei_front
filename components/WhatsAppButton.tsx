import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // لو بتستخدم react-icons

const WhatsAppButton = () => {
  const phoneNumber = "90600110"; // رقم الموبايل بالكود الدولي بدون أصفار أو +
  const message = ""; // رسالة ترحيبية اختيارية
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25d366',
        color: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '35px',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;