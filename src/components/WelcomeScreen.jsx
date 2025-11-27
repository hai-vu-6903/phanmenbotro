import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      {/* Header with logo and title */}
      <div className="museum-header">
        <div className="header-content">
          <img 
            src="/img/logo.png" 
            alt="Logo 1" 
            className="header-logo"
          />
          <h1 className="museum-title">
            PHÒNG CHỐNG TỐT - CHIẾN ĐẤU GIỎI
          </h1>
          <img 
            src="/img/logo3.png" 
            alt="Logo 2" 
            className="header-logo"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="content-container">
          <div className="content-box">
            <h1 className="content-title">
              MỘT SỐ NỘI DUNG BỔ TRỢ
              <br />
              CHO HẠ SĨ QUAN, BINH SĨ
            </h1>
            <p className="author">
              Tác giả: Nguyễn Minh Trí
            </p>
            <button 
              onClick={onStart}
              className="start-button"
            >
              <FontAwesomeIcon icon={faPlay} className="play-icon" /> Bắt đầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
