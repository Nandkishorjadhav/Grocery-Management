import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, onSearch }) => {
  return (
    <div className="layout-wrapper">
      <Navbar onSearch={onSearch} />
      <main className="main-content fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
