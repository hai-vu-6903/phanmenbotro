import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './VRPage.css';

const VRPage = ({ onBack }) => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        backgroundColor: '#8b0000',
        color: 'white',
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1000,
        borderBottom: '3px solid gold'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <span style={{ color: 'gold' }}>★</span>
          BẢO TÀNG QUÂN SỰ VIỆT NAM
          <span style={{ color: 'gold' }}>★</span>
        </h1>
      </div>
      
      {/* Main content area with iframe and back button */}
      <div style={{ position: 'relative', flex: 1 }}>
        <button 
          onClick={onBack} 
          style={{
            position: 'fixed',
            top: '90px',
            left: '20px',
            zIndex: 1000,
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: '2px solid white',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <FaArrowLeft style={{ fontSize: '14px' }} /> Quay lại
        </button>
        
        <iframe
          src="https://vr360.yoolife.vn/bao-tang-lich-su-quan-su-viet-nam-zmuseumc118u26724"
          style={{
            width: '100%',
            height: 'calc(100vh - 60px)',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          allow="vr; xr; fullscreen"
          title="Bảo tàng Quân sự Việt Nam"
        />
      </div>
    </div>
  );
};

export default VRPage;
