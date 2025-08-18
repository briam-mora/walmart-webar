import React, { useState, useEffect } from 'react';
import content from '../content.json';
import { useAudio } from '../contexts/AudioContext.jsx';

const Station4 = ({ position }) => {
  const { playAudio } = useAudio();
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [visibleWinImages, setVisibleWinImages] = useState([]);

  // Play intro sound when component mounts
  useEffect(() => {
    playAudio('intro_station_4');
  }, [playAudio]);

  // Create pairs of cards (6 pairs = 12 cards total)
  const createCardPairs = () => {
    const pairs = [];
    content.memory.forEach((card, index) => {
      // Add two cards for each memory card to create pairs
      pairs.push({ id: `${card.id}_1`, src: card.src, pairId: card.id, isFlipped: false });
      pairs.push({ id: `${card.id}_2`, src: card.src, pairId: card.id, isFlipped: false });
    });
    return pairs;
  };

  // Randomize card positions
  const shuffleCards = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [cards, setCards] = useState(() => {
    const cardPairs = createCardPairs();
    return shuffleCards(cardPairs);
  });

  // Handle card click
  const handleCardClick = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    
    // Don't allow clicking on already flipped or matched cards
    if (card.isFlipped || matchedPairs.includes(card.pairId)) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    
    // Play flip sound
    playAudio('audio_flip');

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Check for match if we have 2 flipped cards
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = updatedCards.find(c => c.id === firstId);
      const secondCard = updatedCards.find(c => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        setFlippedCards([]);
        
        // Play pair found sound for the specific card
        const cardData = content.memory.find(card => card.id === firstCard.pairId);
        if (cardData && cardData.sound_id) {
          playAudio(cardData.sound_id);
        }
        
        // Show win image for this pair
        setVisibleWinImages(prev => [...prev, firstCard.pairId]);
        
        // Check if game is won
        if (matchedPairs.length + 1 === content.memory.length) {
          // Play game won sound
          playAudio('audio_win');
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Reset game
  const resetGame = () => {
    const cardPairs = createCardPairs();
    const shuffledCards = shuffleCards(cardPairs);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameWon(false);
    setVisibleWinImages([]);
  };

  // Grid layout: 4 rows x 3 columns (12 cards total - 6 pairs)
  const getCardPosition = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const spacing = 0.8;
    return {
      x: (col - 1) * spacing,
      y: (1.5 - row) * spacing,
      z: 0
    };
  };

  return (
    <a-entity id="station-4" position={position}>
      {/* Game Title */}
      <a-text
        value="Juego de Memoria"
        position="0 2.5 0"
        color="#000080"
        font="kelsonsans"
        align="center"
        width="4"
        scale="0.8 0.8 1"
      />

      {/* Memory Cards Grid */}
      {cards.map((card, index) => {
        const pos = getCardPosition(index);
        const isFlipped = card.isFlipped || matchedPairs.includes(card.pairId);
        
        return (
          <a-entity key={card.id} position={`${pos.x} ${pos.y} ${pos.z}`}>
            {/* Card Back (only visible when not flipped) */}
            {!isFlipped && (
              <a-plane
                src="#cardback"
                position="0 0 0"
                width="0.6"
                height="0.8"
                class="clickable"
                onClick={() => handleCardClick(card.id)}
                material="shader: flat"
                transparent="true"
              />
            )}
            
            {/* Card Front (only visible when flipped) */}
            {isFlipped && (
              <a-plane
                src={`#${card.pairId}`}
                position="0 0 0.01"
                width="0.6"
                height="0.8"
                material="shader: flat"
                transparent="true"
              />
            )}
          </a-entity>
        );
      })}

      {/* Win Images for Matched Pairs */}
      {visibleWinImages.map((pairId) => (
        <a-entity key={`win-${pairId}`} position="0 0 1">
          <a-plane
            src={`#${pairId}_win`}
            position="0 0 0"
            scale="0.6 0.6 0.6"
            width="2"
            height="2.5"
            class="clickable"
            onClick={() => {
              setVisibleWinImages(prev => prev.filter(id => id !== pairId));
            }}
            material="shader: flat"
            transparent="true"
          />
        </a-entity>
      ))}

    </a-entity>
  );
};

export default Station4;
