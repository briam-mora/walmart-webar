import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext.jsx';
import content from '../content.json';

const Station6 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { playAudio } = useAudio();

  const triviaData = content.trivia;

  // Play trivia initial sound when component mounts
  useEffect(() => {
    playAudio('trivia_initial_sound');
    
    // Play trivia 1 sound after initial sound
    const timer = setTimeout(() => {
      playAudio('trivia_1_sound');
    }, 3000); // Wait 2 seconds after initial sound
    
    return () => clearTimeout(timer);
  }, [playAudio]);

  const handleAnswerSelect = (answerIndex) => {
    if (answered) return; // Prevent changing answer after submission
    
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    
    const currentTrivia = triviaData[currentQuestion];
    const isCorrect = selectedAnswer === currentTrivia.correct_option;
    
    // Play win or lose sound
    if (isCorrect) {
      playAudio('audio_win');
    }
    
    // Show feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(true);
      // Always play correct answer sound when feedback appears (regardless of user's answer)
      playAudio(currentTrivia.correct_audio_id);
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < triviaData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnswered(false);
      
      // Play next question audio
      const nextTrivia = triviaData[currentQuestion + 1];
      playAudio(nextTrivia.audio_id);
    }
  };

  const currentTrivia = triviaData[currentQuestion];
  const isCorrect = selectedAnswer === currentTrivia.correct_option;
  const isLastQuestion = currentQuestion === triviaData.length - 1;

  if (!currentTrivia) return null;

  return (
    <div className="station-6">
      <div className="trivia-container">
                  {/* Video Player */}
          <div className="video-section">
            <video 
              className="video-player"
              controls
              autoPlay={false}
              muted
              playsInline
              onError={(e) => console.error('Video error:', e)}
            >
              <source src={currentTrivia.video_src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </div>
        
        {/* Question or Feedback */}
        <div className="text-section">
          {!showFeedback ? (
            <>
              <h3 className="question-text">{currentTrivia.question}</h3>
              
              {/* Options */}
              <div className="options-container">
                {currentTrivia.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`option-item ${selectedAnswer === index ? 'selected' : ''} ${
                      answered && index === currentTrivia.correct_option ? 'correct' : ''
                    } ${answered && selectedAnswer === index && index !== currentTrivia.correct_option ? 'incorrect' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className={`checkbox ${selectedAnswer === index ? 'checked' : ''}`}>
                      {selectedAnswer === index && <span className="checkmark">✓</span>}
                    </div>
                    <span className="option-text">{option}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Feedback Text */}
              <div className="feedback-text">
                {currentTrivia.correct_option_text.split('\n').map((line, index) => (
                  <p key={index} className={index === 0 ? 'feedback-title' : 'feedback-body'}>
                    {line}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Answer Button - Outside the text container */}
        {!showFeedback && !answered && (
          <button 
            className="answer-button"
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Contestar
          </button>
        )}
        
        {/* Next Question Button - Outside the text container */}
        {showFeedback && !isLastQuestion && (
          <button 
            className="next-button"
            onClick={handleNextQuestion}
          >
            Siguiente pregunta
          </button>
        )}
      </div>
    </div>
  );
};

export default Station6;
