import './MenuScreen.css';

export default function MenuScreen({ onSelect }) {
  return (
    <div className="menu-screen-wrapper">
      <div className="museum-header">
        <h1 className="museum-title">Phòng Chống Tốt - Chiến Đấu Giỏi</h1>
      </div>
      <div className="menu-images">
        <img src="/src/assets/img/picture4.png" alt="Hình ảnh 4" className="img-fluid" />
        <img src="/src/assets/img/picture5.png" alt="Hình ảnh 5" className="img-fluid" />
        <img src="/src/assets/img/picture6.png" alt="Hình ảnh 6" className="img-fluid" />
      </div>
      <div className="menu-screen">
        <h2 className="menu-title">NỘI DUNG</h2>
        
        <div className="menu-grid">
          <button 
            className="menu-button" 
            onClick={() => onSelect("nghiLe")}
          >
            <span style={{ color: 'gold', marginRight: '8px' }}>★</span> I. Nhạc Nghi Lễ <span style={{ color: 'gold', marginLeft: '8px' }}>★</span>
          </button>

          <button 
            className="menu-button" 
            onClick={() => onSelect("baiHat")}
          >
            <span style={{ color: 'gold', marginRight: '8px' }}>★</span> II. Bài Hát Quy Định <span style={{ color: 'gold', marginLeft: '8px' }}>★</span>
          </button>

          <button 
            className="menu-button" 
            onClick={() => onSelect("dieuVu")}
          >
            <span style={{ color: 'gold', marginRight: '8px' }}>★</span> III. 05 Điệu Vũ <span style={{ color: 'gold', marginLeft: '8px' }}>★</span>
          </button>

          <button 
            className="menu-button"
            onClick={() => onSelect("quiz")}
          >
            <span style={{ color: 'gold', marginRight: '8px' }}>★</span> IV. Câu Hỏi Trắc Nghiệm <span style={{ color: 'gold', marginLeft: '8px' }}>★</span>
          </button>

        </div>
      </div>
      
      {/* Bảo Tàng Quân Sự button at bottom center */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <button 
          onClick={() => onSelect("vrMuseum")}
          style={{
            width: '100%',
            padding: '12px 24px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(145deg, #0d6efd, #0b5ed7)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '25px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}
        >
          <span style={{ color: 'gold', margin: '0 10px' }}>★</span>
          BẢO TÀNG QUÂN SỰ
          <span style={{ color: 'gold', margin: '0 10px' }}>★</span>
        </button>
      </div>
    </div>
  );
}
