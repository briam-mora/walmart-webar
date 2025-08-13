import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station7 = ({ position }) => {
  const [feedback1, setFeedback1] = useState(null);
  const [feedback2, setFeedback2] = useState(null);
  const [name, setName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { playAudioFile } = useAudio();

  const handleFeedbackSelect = (questionNumber, value) => {
    if (questionNumber === 1) {
      setFeedback1(value);
    } else {
      setFeedback2(value);
    }
    playAudioFile('click.wav');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback1 !== null && feedback2 !== null && name.trim() && badgeNumber.trim()) {
      setSubmitted(true);
      playAudioFile('click.wav');
      
      // Here you could send the data to your backend
      console.log('Feedback submitted:', {
        onboardingExperience: feedback1,
        trainingMotivation: feedback2,
        name: name.trim(),
        badgeNumber: badgeNumber.trim()
      });
    }
  };

  const handleReset = () => {
    setFeedback1(null);
    setFeedback2(null);
    setName('');
    setBadgeNumber('');
    setSubmitted(false);
    playAudioFile('click.wav');
  };

  const getFeedbackLabel = (value) => {
    switch (value) {
      case 'good': return 'Sí';
      case 'mid': return 'Más o menos';
      case 'bad': return 'No';
      default: return '';
    }
  };

  const FeedbackOption = ({ value, selected, onClick, questionNumber }) => (
    <div 
      className={`feedback-option ${selected ? 'selected' : ''}`}
      onClick={() => onClick(questionNumber, value)}
    >
      <img 
        src={`${value}.svg`} 
        alt={getFeedbackLabel(value)}
        className="feedback-icon"
      />
      <span className="feedback-label">{getFeedbackLabel(value)}</span>
    </div>
  );

  if (submitted) {
    return (
      <div className="station-7">
        <div className="feedback-form-container">
          <div className="feedback-header">
            <img id="banner" src="banner.svg" alt="Banner" className="banner" />
            <h2 className="feedback-title">¡Gracias por tu feedback!</h2>
          </div>
          
          <div className="feedback-summary">
            <p><strong>Experiencia de onboarding:</strong> {getFeedbackLabel(feedback1)}</p>
            <p><strong>Motivación con la capacitación:</strong> {getFeedbackLabel(feedback2)}</p>
            <p><strong>Nombre:</strong> {name}</p>
            <p><strong>Número de gafete:</strong> {badgeNumber}</p>
          </div>
          
          <button className="reset-button" onClick={handleReset}>
            Enviar otro feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="station-7">
      <div className="feedback-form-container">
        <div className="feedback-header">
          <img src="banner.svg" alt="Banner" className="banner" />
          <h2 className="feedback-title">¡Cuéntanos!</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          {/* First Question */}
          <div className="feedback-question">
            <h3>¿Te gustó la experiencia de onboarding?</h3>
            <div className="feedback-options">
              <FeedbackOption 
                value="good" 
                selected={feedback1 === 'good'} 
                onClick={handleFeedbackSelect}
                questionNumber={1}
              />
              <FeedbackOption 
                value="mid" 
                selected={feedback1 === 'mid'} 
                onClick={handleFeedbackSelect}
                questionNumber={1}
              />
              <FeedbackOption 
                value="bad" 
                selected={feedback1 === 'bad'} 
                onClick={handleFeedbackSelect}
                questionNumber={1}
              />
            </div>
          </div>
          
          {/* Second Question */}
          <div className="feedback-question">
            <h3>¿Te sentiste motivado con la capacitación?</h3>
            <div className="feedback-options">
              <FeedbackOption 
                value="good" 
                selected={feedback2 === 'good'} 
                onClick={handleFeedbackSelect}
                questionNumber={2}
              />
              <FeedbackOption 
                value="mid" 
                selected={feedback2 === 'mid'} 
                onClick={handleFeedbackSelect}
                questionNumber={2}
              />
              <FeedbackOption 
                value="bad" 
                selected={feedback2 === 'bad'} 
                onClick={handleFeedbackSelect}
                questionNumber={2}
              />
            </div>
          </div>
          
          {/* Input Fields */}
          <div className="input-group">
            <label htmlFor="name">Escribe tu nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="feedback-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="badgeNumber">Escribe tu número de gafete</label>
            <input
              type="text"
              id="badgeNumber"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              required
              className="feedback-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!feedback1 || !feedback2 || !name.trim() || !badgeNumber.trim()}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Station7;
