'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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

export default function NoteComparisonPage() {
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
    // A3~C6 범위로 제한 (학습에 적합한 음역)
    const staffTop = 100;
    const lineSpacing = 20;
    
    const a3Y = staffTop + 4 * lineSpacing; // A3 위치
    const c6Y = staffTop - 1.5 * lineSpacing; // C6 위치
    
    // A3~C6 범위에서 랜덤 생성
    const minY = a3Y;
    const maxY = c6Y;
    
    return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  };

  const generateNewProblem = useCallback(() => {
    let leftY = generateRandomNotePosition();
    let rightY = generateRandomNotePosition();
    
    // 고정된 최소 높이 차이 설정
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
  }, [staffConfig.leftNoteX, staffConfig.rightNoteX]);

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
  }, [generateNewProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <header className="text-center mb-8 text-white">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/"
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              🏠 홈으로
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              🎵 높은음/낮은음 구분 연습
            </h1>
            <div className="w-24"></div> {/* 균형을 위한 빈 공간 */}
          </div>
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

          <VexFlowStaff currentProblem={currentProblem} answered={answered} disableAudio={true} />

          <GameControls 
            answered={answered}
            onCheckAnswer={checkAnswer}
            onNextProblem={generateNewProblem}
          />

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="comparison" />
      </div>
    </div>
  );
} 