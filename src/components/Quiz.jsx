import { useState, useEffect } from "react";
import { questions } from "../data/songs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faArrowRight, 
  faRedo, 
  faHome, 
  faChartBar, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import './Quiz.css';

// Hàm xáo trộn mảng
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Quiz({ onBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    // Xáo trộn câu hỏi và đáp án khi component mount
    const processedQuestions = questions.map(q => {
      // Tạo mảng các chỉ số đáp án
      const answerIndices = q.options.map((_, i) => i);
      // Xáo trộn các chỉ số
      const shuffledIndices = shuffleArray(answerIndices);
      
      // Lưu lại vị trí đúng mới
      const newCorrectIndex = shuffledIndices.indexOf(q.answer);
      
      // Tạo mảng đáp án mới đã xáo trộn
      const shuffledOptions = shuffledIndices.map(idx => q.options[idx]);
      
      return {
        ...q,
        options: shuffledOptions,
        answer: newCorrectIndex,
        originalAnswer: q.answer // Lưu lại đáp án gốc để đối chiếu nếu cần
      };
    });
    
    // Xáo trộn thứ tự các câu hỏi
    const randomizedQuestions = shuffleArray(processedQuestions);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledQuestions(randomizedQuestions);
    setIsLoading(false);
    
    return () => {
      // Cleanup nếu cần
    };
  }, []);

  // Add a safety check for the current question
  const question = shuffledQuestions.length > 0 && shuffledQuestions[current] ? shuffledQuestions[current] : null;
  
  // If no question is found, show an error message
  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2 className="quiz-title">Đang tải câu hỏi...</h2>
        </div>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2 className="quiz-title">Lỗi tải câu hỏi</h2>
        </div>
        <div className="results-container">
          <p>Không thể tải câu hỏi. Vui lòng thử lại sau.</p>
          <button className="btn btn-primary mt-3" onClick={onBack}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (idx) => {
    if (answered) return;

    const correct = idx === question.answer;
    if (correct) setScore(score + 1);

    const newUserAnswers = [...userAnswers];
    newUserAnswers[current] = idx;
    setUserAnswers(newUserAnswers);

    setAnswered(true);
  };

  const nextQuestion = () => {
    if (!answered) {
      alert("Vui lòng chọn đáp án!");
      return;
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setAnswered(false);
    } else {
      // Don't finish automatically, just show the "Xem kết quả" button
      setAnswered(true);
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswered(true);
    }
  };

  if (showResults || isFinished) {
    return (
      <div className="quiz-container">
        <div className="results-container">
          <h2>Kết quả hiện tại</h2>
          <div className="results-score">
            {score} / {shuffledQuestions.length}
          </div>
          <p className="results-message">
            {shuffledQuestions.length > 0 && score >= Math.ceil(shuffledQuestions.length / 2) 
              ? 'Chúc mừng bạn đã làm rất tốt!' 
              : 'Cố gắng hơn nữa nhé!'}
          </p>
          <div className="d-flex flex-column gap-2 w-100">
            {!isFinished && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowResults(false)}
              >
                <FontAwesomeIcon icon={faArrowRight} className="me-2" />Tiếp tục làm bài
              </button>
            )}
            <div className="d-flex gap-2">
              <button 
                className="btn btn-warning flex-grow-1" 
                onClick={() => {
                  setCurrent(0);
                  setScore(0);
                  setUserAnswers([]);
                  setAnswered(false);
                  setShowResults(false);
                  setIsFinished(false);
                }}
              >
                <FontAwesomeIcon icon={faRedo} className="me-2" />Làm lại từ đầu
              </button>
              <button 
                className="btn btn-outline-light flex-grow-1" 
                onClick={onBack}
              >
                <FontAwesomeIcon icon={faHome} className="me-2" />Về menu chính
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Check if questions is not an array or is empty
  if (!Array.isArray(shuffledQuestions) || shuffledQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2 className="quiz-title">Câu Hỏi Trắc Nghiệm</h2>
        </div>
        <div className="results-container">
          <p>Chưa có câu hỏi nào trong hệ thống.</p>
          <button className="btn btn-primary mt-3" onClick={onBack}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="position-absolute top-0 start-0 m-3">
        <button 
          onClick={onBack}
          className="btn btn-outline-light d-flex align-items-center"
          style={{
            padding: '8px 15px',
            borderRadius: '20px',
            border: '2px solid white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          <span>Quay lại</span>
        </button>
      </div>
      <div className="quiz-header">
        <h2 className="quiz-title">Câu Hỏi Trắc Nghiệm</h2>
        <div className="quiz-progress">
          Câu {current + 1}/{shuffledQuestions.length}
        </div>
      </div>

      {!isFinished ? (
        <>
          <h3 className="question-text">{question.question}</h3>

          <div className="options-container">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.answer;
              const isSelected = userAnswers[current] === idx;

              let btnClass = "option-btn";
              if (answered) {
                if (isCorrect) btnClass += " correct";
                else if (isSelected) btnClass += " incorrect";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                  disabled={answered}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              );
            })}
          </div>

          <div className="navigation-buttons">
            <div className="d-flex justify-content-between w-100">
              <button 
                className="btn btn-outline-light" 
                onClick={prevQuestion}
                disabled={current === 0}
              >
                ⬅ Câu trước
              </button>
              
              <button 
                className="btn btn-info text-white" 
                onClick={() => setShowResults(true)}
              >
                <FontAwesomeIcon icon={faChartBar} className="me-2" />Xem kết quả
              </button>
              
              {current < shuffledQuestions.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={nextQuestion}
                  disabled={!answered}
                >
                  Câu tiếp theo ➡
                </button>
              ) : (
                <button 
                  className="btn btn-success" 
                  onClick={() => setShowResults(true)}
                  disabled={!answered}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />Kết thúc
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="results-container">
          <h2>Kết quả hiện tại</h2>
          <div className="results-score">
            {score} / {shuffledQuestions.length}
          </div>
          <p className="results-message">
            {shuffledQuestions.length > 0 && score >= Math.ceil(shuffledQuestions.length / 2) 
              ? 'Chúc mừng bạn đã làm rất tốt!' 
              : 'Cố gắng hơn nữa nhé!'}
          </p>
          <div className="d-flex flex-column gap-2 w-100">
            {!isFinished && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowResults(false)}
              >
                <FontAwesomeIcon icon={faArrowRight} className="me-2" />Tiếp tục làm bài
              </button>
            )}
            <div className="d-flex gap-2">
              <button 
                className="btn btn-warning flex-grow-1" 
                onClick={() => {
                  setCurrent(0);
                  setScore(0);
                  setUserAnswers([]);
                  setAnswered(false);
                  setShowResults(false);
                }}
              >
                <FontAwesomeIcon icon={faRedo} className="me-2" />Làm lại từ đầu
              </button>
              <button 
                className="btn btn-outline-light flex-grow-1" 
                onClick={onBack}
              >
                <FontAwesomeIcon icon={faHome} className="me-2" />Về menu chính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
