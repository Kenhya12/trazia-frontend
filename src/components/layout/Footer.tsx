import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner py-4 px-6">
      <div className="container mx-auto text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Trazia. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;