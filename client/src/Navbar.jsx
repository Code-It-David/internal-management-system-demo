import React, { useState, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ onLogout, onGoHome, onGoEmployees, onGoProfile, hasUnreadMessages }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 300); 
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #d0e7ff, #e2f0ff)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>DummyCorp.</div>

      <div
        style={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ position: 'relative', fontSize: '1.5rem', cursor: 'pointer' }}>
  ☰
  {hasUnreadMessages && (
    <span className="notif-dot" />
  )}
</div>


        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'opacity 0.3s ease',
              zIndex: 1001
            }}
          >
            <div style={menuItemStyle} onClick={onGoHome}>Home</div>
           <div style={{ ...menuItemStyle, position: 'relative', paddingLeft: hasUnreadMessages ? '1.5rem' : '1.5rem' }} onClick={onGoProfile}>
  {hasUnreadMessages && (
    <span
      className="notif-dot"
      style={{
        top: '42%',
        left: '0.5rem',
        transform: 'translateY(-50%)'
      }}
    />
  )}
  Profile
</div>


            <div style={menuItemStyle} onClick={onGoEmployees}>Employees</div>
            <div
              style={{ ...menuItemStyle, borderTop: '1px solid #eee' }}
              onClick={onLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const menuItemStyle = {
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  transition: 'background 0.2s',
  whiteSpace: 'nowrap',
  fontSize: '0.95rem',
};

export default Navbar;
