import React, { useState } from 'react';
import VideoGallery from './VideoGallery.jsx';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station6 = ({ position }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { playAudio } = useAudio();

  const triviaData = [
    {
      id: 1,
      question: "¿Cuál es el valor fundamental de Walmart?",
      options: [
        "Excelencia en el servicio al cliente",
        "Innovación tecnológica",
        "Sostenibilidad ambiental",
        "Expansión global"
      ],
      correctAnswer: 0,
      explanation: "Walmart se enfoca en la excelencia del servicio al cliente como su valor fundamental, buscando siempre superar las expectativas de los consumidores."
    },
    {
      id: 2,
      question: "¿Qué caracteriza la cultura de Walmart?",
      options: [
        "Jerarquía estricta y formal",
        "Colaboración y trabajo en equipo",
        "Competencia individual",
        "Autonomía total"
      ],
      correctAnswer: 1,
      explanation: "La cultura de Walmart se caracteriza por la colaboración y el trabajo en equipo, donde cada empleado contribuye al éxito colectivo de la empresa."
    },
    {
      id: 3,
      question: "¿Cuál es la misión principal de Walmart?",
      options: [
        "Ser la empresa más grande del mundo",
        "Ahorrar dinero a las personas para que vivan mejor",
        "Innovar en tecnología retail",
        "Expandirse a todos los países"
      ],
      correctAnswer: 1,
      explanation: "La misión principal de Walmart es ahorrar dinero a las personas para que puedan vivir mejor, ofreciendo productos de calidad a precios accesibles."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === triviaData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Play click sound
    playAudio('click');
  };

  const handleNextQuestion = () => {
    if (currentQuestion < triviaData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed, reset to first question
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setScore(0);
    }
    
    playAudio('click');
  };

  const currentTrivia = triviaData[currentQuestion];
  const isCorrect = selectedAnswer === currentTrivia.correctAnswer;
  
  // Debug logging
  console.log('Station6 Debug:', {
    currentQuestion,
    optionsCount: currentTrivia.options.length,
    options: currentTrivia.options,
    showFeedback,
    selectedAnswer
  });

  return (
    <a-entity id="station-6" position={position} scale="0.1 0.1 0.1">
      {/* Full Background */}
      <a-plane
        position="0 0 0"
        width="20"
        height="20"
        color="#1e3a8a"
        opacity="1"
        material="shader: flat"
      />

      {/* Video Player Container */}
      <a-plane
        position="0 4 0"
        width="18"
        height="14"
        color="#1e3a8a"
        opacity="0.9"
        material="shader: flat"
        radius="0.3"
      />

      {/* Video Gallery */}
      <VideoGallery
        videos={[{ src: "#video", autoplay: false }]}
        position="0 4 0"
        rotation="0 0 0"
        scale="8 8 8"
        width="16"
        height="12"
      />

      {/* Trivia Container */}
      <a-plane
        position="0 -5 0"
        width="18"
        height="3"
        color="#1e3a8a"
        opacity="0.9"
        material="shader: flat"
        radius="0.3"
      />

      {/* Header */}
      <a-text
        value="Trivia Walmart"
        position="0 -3.8 0.01"
        align="center"
        width="16"
        color="#ffffff"
        font="kelsonsans"
        scale="0.6 0.6 1"
      />

      {/* Question Section */}
      {!showFeedback && (
        <a-entity position="0 -4.2 0.01">
          {/* Debug: Show options count */}
          <a-text
            value={`Debug: ${currentTrivia.options.length} options`}
            position="0 0.8 0.01"
            align="center"
            width="16"
            color="#ffff00"
            font="kelsonsans"
            scale="0.3 0.3 1"
          />
          
          {/* Question Text */}
          <a-text
            value={currentTrivia.question}
            position="0 0.2 0.01"
            align="center"
            width="16"
            color="#ffffff"
            font="kelsonsans"
            scale="0.35 0.35 1"
          />

          {/* Answer Options */}
          {currentTrivia.options.map((option, index) => (
            <a-entity key={index} position="0 ${0.1 - index * 0.4} 0.01">
              {/* Debug: Red sphere to show position */}
              <a-sphere
                position="0 0 0.02"
                radius="0.1"
                color="#00ff00"
                material="shader: flat"
              />
              
              {/* Option Background */}
              <a-plane
                position="0 0 0"
                width="16"
                height="0.3"
                color="#ff0000"
                opacity="1"
                material="shader: flat"
                onClick={() => handleAnswerSelect(index)}
                class="clickable"
              />
              
              {/* Option Text */}
              <a-text
                value={option}
                position="0 0 0.01"
                align="center"
                width="15"
                color="#ffffff"
                font="kelsonsans"
                scale="0.25 0.25 1"
              />
            </a-entity>
          ))}
        </a-entity>
      )}

      {/* Feedback Section */}
      {showFeedback && (
        <a-entity position="0 -4.2 0.01">
          {/* Result Text */}
          <a-text
            value={isCorrect ? "¡Correcto!" : "Incorrecto"}
            position="0 0.3 0.01"
            align="center"
            width="16"
            color={isCorrect ? "#10b981" : "#ef4444"}
            font="kelsonsans"
            scale="0.5 0.5 1"
          />

          {/* Explanation */}
          <a-text
            value={currentTrivia.explanation}
            position="0 0 0.01"
            align="center"
            width="16"
            color="#ffffff"
            font="kelsonsans"
            scale="0.3 0.3 1"
          />

          {/* Next Question Button */}
          <a-plane
            position="0 -0.3 0"
            width="6"
            height="0.4"
            color="#ffffff"
            material="shader: flat"
            onClick={handleNextQuestion}
            class="clickable"
          />
          
          <a-text
            value={currentQuestion < triviaData.length - 1 ? "Siguiente pregunta" : "Reiniciar trivia"}
            position="0 -0.3 0.01"
            align="center"
            width="5"
            color="#1e3a8a"
            font="kelsonsans"
            scale="0.35 0.35 1"
          />
        </a-entity>
      )}

      {/* Progress Indicator */}
      <a-text
        value={`Pregunta ${currentQuestion + 1} de ${triviaData.length}`}
        position="0 -6.8 0.01"
        align="center"
        width="16"
        color="#ffffff"
        font="kelsonsans"
        scale="0.3 0.3 1"
      />

      {/* Score Display */}
      <a-text
        value={`Puntuación: ${score}/${triviaData.length}`}
        position="0 -7.1 0.01"
        align="center"
        width="16"
        color="#10b981"
        font="kelsonsans"
        scale="0.3 0.3 1"
      />


    </a-entity>
  );
};

export default Station6;
