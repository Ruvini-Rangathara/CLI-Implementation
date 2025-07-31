"use client";

import React, { useState, useEffect, useRef } from 'react';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Type "start" to begin the game!']);
  const [gameState, setGameState] = useState<'idle' | 'started' | 'name' | 'color' | 'won'>('idle');
  const [name, setName] = useState('');
  const [selectedOption, setSelectedOption] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { id: 1, name: 'Red', color: '#ff5f56' },
    { id: 2, name: 'Blue', color: '#8be9fd' },
    { id: 3, name: 'Green', color: '#50fa7b' },
    { id: 4, name: 'Yellow', color: '#f1fa8c' }
  ];

  useEffect(() => {
    if (gameState === 'color') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedOption(prev => (prev > 1 ? prev - 1 : 4));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedOption(prev => (prev < 4 ? prev + 1 : 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleColorSelect(selectedOption.toString());
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState, selectedOption]);

  const handleColorSelect = (option: string) => {
    const newOutput = [...output, `user@browser:-$ ${option}`];
    newOutput.push('Checking answer...');
    
    if (option === '2') {
      newOutput.push(`Correct! ${name}, you chose Blue.`);
      newOutput.push(`Congrats ${name}!`);
      setGameState('won');
    } else {
      newOutput.push(`Wrong! Game over. The correct answer was Blue.`);
      newOutput.push('Type "start" to play again.');
      setGameState('idle');
      setName('');
    }
    
    setOutput(newOutput);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOutput = [...output, `user@browser:-$ ${input}`];
    
    switch (gameState) {
      case 'idle':
        if (input.toLowerCase() === 'start') {
          newOutput.push(
            'Welcome to the Browser CLI App!',
            '**Browser CLI App**',
            'How to play: I am a process in your browser. If you get any question wrong, the game will end.',
            'What is your name? (Type your name and press Enter)'
          );
          setGameState('name');
        } else {
          newOutput.push('Type "start" to begin the game!');
        }
        break;
      
      case 'name':
        setName(input);
        newOutput.push(`Welcome ${input}!`);
        newOutput.push(
          `What is ${input}'s favorite color? (Use arrow keys or type number)`,
          '[1] Red',
          '[2] Blue',
          '[3] Green',
          '[4] Yellow'
        );
        setGameState('color');
        setSelectedOption(1);
        break;
      
      case 'color':
        handleColorSelect(input);
        return;
      
      case 'won':
        newOutput.push('Game already completed. Type "start" to play again.');
        break;
    }

    setOutput(newOutput);
    setInput('');
  };

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      width: '800px',
      height: '500px',
      backgroundColor: '#1e1e1e',
      color: '#f0f0f0',
      borderRadius: '8px',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Terminal Header */}
      <div style={{
        backgroundColor: '#3a3a3a',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', cursor: 'pointer' }} title="Close" />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', cursor: 'pointer' }} title="Minimize" />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', cursor: 'pointer' }} title="Maximize" />
        </div>
        <div style={{ fontSize: '14px' }}>Browser Terminal - bash</div>
        <div style={{ width: '60px' }}></div>
      </div>
      
      {/* Terminal Body */}
      <div style={{ 
        padding: '16px', 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {output.map((line, i) => (
          <div key={i} style={{ 
            marginBottom: '4px', 
            whiteSpace: 'pre-wrap',
            color: line.includes('user@browser:-$') ? '#4af626' : '#f0f0f0'
          }}>
            {line.startsWith('[') && line.includes('YOU WIN!') ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '8px', 
                margin: '20px 0',
                alignItems: 'center'
              }}>
                {[...Array(2)].map((_, i) => (
                  <div key={`left-${i}`} style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '1px solid #4af626',
                    opacity: 0.7
                  }}></div>
                ))}
                <div style={{ 
                  padding: '0 12px', 
                  fontWeight: 'bold', 
                  color: '#4af626',
                  fontSize: '1.2rem'
                }}>YOU WIN!</div>
                {[...Array(2)].map((_, i) => (
                  <div key={`right-${i}`} style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '1px solid #4af626',
                    opacity: 0.7
                  }}></div>
                ))}
              </div>
            ) : (
              line
            )}
          </div>
        ))}
        
        {gameState === 'color' && (
          <div style={{
            margin: '16px 0',
            padding: '12px',
            borderLeft: '4px solid #4af626',
            backgroundColor: 'rgba(74, 246, 38, 0.05)'
          }}>
            <div style={{ marginBottom: '8px' }}>Use arrow keys or type number:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {colors.map(color => (
                <div 
                  key={color.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: selectedOption === color.id ? '#3a3a3a' : '#2a2a2a',
                    borderRadius: '4px',
                    border: selectedOption === color.id ? '1px solid #4af626' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleColorSelect(color.id.toString())}
                >
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: color.color,
                    borderRadius: '4px',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#1e1e1e'
                  }}>{color.id}</div>
                  <div>{color.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div style={{
            margin: '20px 0',
            padding: '16px',
            backgroundColor: 'rgba(74, 246, 38, 0.1)',
            border: '1px solid #4af626',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ff79c6',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Congrats {name}!
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          marginTop: 'auto',
          paddingTop: '16px'
        }}>
          <span style={{ 
            color: '#4af626', 
            marginRight: '8px',
            fontWeight: 'bold'
          }}>user@browser:-$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#f0f0f0',
              outline: 'none',
              fontFamily: "'Courier New', monospace",
              fontSize: '1rem',
              caretColor: '#4af626'
            }}
            autoFocus
            disabled={gameState === 'color'} // Disable input during color selection
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;