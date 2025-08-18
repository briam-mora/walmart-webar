import React, { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station7 = () => {
  const [feedback1, setFeedback1] = useState(null);
  const [feedback2, setFeedback2] = useState(null);
  const [name, setName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { playAudio } = useAudio();

  // Play intro audio when component mounts
  useEffect(() => {
    playAudio('feedback_begin');
  }, [playAudio]);

  const handleFeedbackSelect = (questionNumber, value) => {
    if (questionNumber === 1) {
      setFeedback1(value);
    } else {
      setFeedback2(value);
    }
    playAudio('click');
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateGoogleSheet = async (data) => {
    try {
      setIsUpdating(true);
      
      // Your Google Apps Script endpoint
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbz5cAndrRvlRaVDuOmBS6-BJwCFeIKaCr8fQX650-vaWjfI2U6CqqwX6a9frWqjATbn/exec';
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        // Remove Content-Type header to avoid CORS issues in production
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Excel updated successfully in Google Drive!');
        return true;
      } else {
        console.error('Server error:', result.error);
        throw new Error(result.error || 'Failed to update Excel');
      }
      
    } catch (error) {
      console.error('Error updating Google Sheet:', error);
      setErrorMessage('Error al enviar datos. Se descargará un archivo local como respaldo.');
      // Fallback to local download if cloud update fails
      downloadLocalExcel(data);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadLocalExcel = (data) => {
    // Fallback function to download Excel locally if cloud update fails
    const excelData = [
      ['Name', 'Badge Number', 'Onboarding Experience', 'Training Motivation', 'Submission Time'],
      [
        data.name,
        data.badgeNumber,
        data.onboardingExperience === 'good' ? 'Sí' : data.onboardingExperience === 'mid' ? 'Más o menos' : 'No',
        data.trainingMotivation === 'good' ? 'Sí' : data.trainingMotivation === 'mid' ? 'Más o menos' : 'No',
        new Date().toLocaleString('es-ES')
      ]
    ];

    const csvContent = excelData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-${data.name}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback1 !== null && feedback2 !== null && name.trim() && badgeNumber.trim()) {
      setSubmitted(true);
      playAudio('feedback_end');
      
      const formData = {
        onboardingExperience: feedback1,
        trainingMotivation: feedback2,
        name: name.trim(),
        badgeNumber: badgeNumber.trim()
      };
      
      // Update Google Sheet
      await updateGoogleSheet(formData);
      
      // Here you could send the data to your backend
      console.log('Feedback submitted:', formData);
    }
  };

  const handleReset = () => {
    // Refresh the page to start over
    window.location.reload();
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
            <h2 className="feedback-title">¡Feedback enviado satisfactoriamente!</h2>
          </div>
          
          <div className="feedback-summary">
            <p>Has completado el proceso de onboarding. Tus respuestas se han guardado en Google Drive.</p>
            <p>Ya puedes cerrar la aplicación o volver a iniciar el proceso de onboarding.</p>
          </div>
          
          <button className="reset-button" onClick={handleReset}>
            Volver a iniciar
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
            disabled={!feedback1 || !feedback2 || !name.trim() || !badgeNumber.trim() || isUpdating}
          >
            {isUpdating ? 'Enviando...' : 'Enviar'}
          </button>
          
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Station7;
