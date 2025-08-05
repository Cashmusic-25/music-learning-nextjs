'use client';

import { useState, useEffect } from 'react';
import ScoreBoard from '@/components/ScoreBoard';
import VexFlowStaff from '@/components/VexFlowStaff';
import GameControls from '@/components/GameControls';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';

interface Note {
  x: number;
  y: number;
}

interface Problem {
  leftNote: Note;
  rightNote: Note;
  correctAnswer: 'left' | 'right';
}

export default function MusicLearningApp() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const staffConfig = {
    lineSpacing: 20,
    staffTop: 100,
    staffHeight: 80,
    leftNoteX: 200,
    rightNoteX: 600,
    noteSize: 15
  };

  const generateRandomNotePosition = () => {
    // C3~C5 범위로 제한 (학습에 적합한 음역)
    // C3: staffTop + 3 * lineSpacing (네 번째 선)
    // C5: staffTop - 0.5 * lineSpacing (첫 번째 선 위)
    const staffTop = 100;
    const lineSpacing = 20;
    
    const c3Y = staffTop + 3 * lineSpacing; // C3 위치 (네 번째 선)
    const c5Y = staffTop - 0.5 * lineSpacing; // C5 위치 (첫 번째 선 위)
    
    // C3~C5 범위에서 랜덤 생성
    const minY = c3Y;
    const maxY = c5Y;
    
    return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  };

  const generateNewProblem = () => {
    let leftY = generateRandomNotePosition();
    let rightY = generateRandomNotePosition();
    
    // 고정된 최소 높이 차이 설정 (기존 medium 난이도와 동일)
    const minHeightDifference = 20;
    
    // 같은 높이인 경우 다시 생성
    while (Math.abs(leftY - rightY) < minHeightDifference) {
      leftY = generateRandomNotePosition();
      rightY = generateRandomNotePosition();
    }
    
    const newProblem: Problem = {
      leftNote: { x: staffConfig.leftNoteX, y: leftY },
      rightNote: { x: staffConfig.rightNoteX, y: rightY },
      correctAnswer: leftY < rightY ? 'left' : 'right'
    };
    
    setCurrentProblem(newProblem);
    setAnswered(false);
    setFeedback({ message: '', type: null });
  };

  const checkAnswer = (selectedAnswer: 'left' | 'right') => {
    if (answered || !currentProblem) return;
    
    setAnswered(true);
    const isCorrect = selectedAnswer === currentProblem.correctAnswer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setFeedback({ message: `정답입니다! 🎉 (연속 ${newStreak}번 정답!)`, type: 'correct' });
    } else {
      setIncorrectCount(prev => prev + 1);
      setStreak(0);
      setFeedback({ 
        message: `틀렸습니다. 정답은 ${currentProblem.correctAnswer === 'left' ? '왼쪽' : '오른쪽'} 음표가 더 높습니다.`, 
        type: 'incorrect' 
      });
    }
  };

  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  useEffect(() => {
    generateNewProblem();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <header className="text-center mb-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            🎵 음악 학습 - 높은음/낮은음 구분 연습
          </h1>
          <p className="text-xl opacity-90">
            두 개의 음표 중에서 더 높은 음을 선택해보세요!
          </p>
        </header>

        {/* Game Container */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
          <ScoreBoard 
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            accuracy={accuracy}
            streak={streak}
            bestStreak={bestStreak}
          />

          <VexFlowStaff currentProblem={currentProblem} answered={answered} />

          <GameControls 
            answered={answered}
            onCheckAnswer={checkAnswer}
            onNextProblem={generateNewProblem}
          />

          <Feedback feedback={feedback} />
        </div>

        <Instructions />
      </div>
    </div>
  );
}
