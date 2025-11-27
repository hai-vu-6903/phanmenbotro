import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            className="d-none d-md-block header-logo"
          />
          <h1 className="museum-title">
            PHÒNG CHỐNG TỐT - CHIẾN ĐẤU GIỎI
          </h1>
          <img 
            src="/img/logo3.png" 
            alt="Logo 2" 
            className="d-none d-md-block header-logo"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Container className="h-100 d-flex align-items-center">
          <Row className="justify-content-center w-100">
            <Col xs={12} md={10} lg={8} className="text-center">
              <div className="content-box">
              <h1 className="text-white fw-bold mb-4">
                MỘT SỐ NỘI DUNG BỔ TRỢ
                <br />
                CHO HẠ SĨ QUAN, BINH SĨ
              </h1>
              <p className="mb-4" style={{
                fontSize: '1rem',
                color: 'white',
                textShadow: '0 0 8px rgba(0, 0, 0, 0.8)',
                fontWeight: '500',
                padding: '8px 20px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '30px',
                display: 'inline-block'
              }}>Tác giả: Nguyễn Minh Trí</p>
              {/* <br /> */}
              <Button 
                variant="primary" 
                onClick={onStart}
                className="btn-start"
              >
                <FontAwesomeIcon icon={faPlay} className="me-2" /> Bắt đầu
              </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
