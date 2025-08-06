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
  note: Note;
  correctAnswer: string;
  options: string[];
}

export default function NoteQuizPage() {
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
    noteX: 400,
    noteSize: 15
  };

  // 도레미파솔라시도 음계
  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  
  // 영어 음계 (C, D, E, F, G, A, B)
  const englishNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const generateRandomNotePosition = () => {
    // C4~B5 범위로 제한 (학습에 적합한 음역)
    const staffTop = 100;
    const lineSpacing = 20;
    
    const c4Y = staffTop + 3 * lineSpacing; // C4 위치 (첫 번째 가선 아래)
    const b5Y = staffTop - 0.5 * lineSpacing; // B5 위치 (위쪽 가선 위)
    
    // C4~B5 범위에서 랜덤 생성
    const minY = c4Y;
    const maxY = b5Y;
    
    return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
  };

  const getNoteName = (y: number): string => {
    // 오선지의 정확한 위치에 맞는 음표 매핑
    const staffTop = 100;
    const lineSpacing = 20;
    
    const noteMapping = [
      { y: staffTop - 0.5 * lineSpacing, note: 'C' },      // C5
      { y: staffTop, note: 'B' },
      { y: staffTop + 0.5 * lineSpacing, note: 'A' },
      { y: staffTop + lineSpacing, note: 'G' },
      { y: staffTop + 1.5 * lineSpacing, note: 'F' },
      { y: staffTop + 2 * lineSpacing, note: 'E' },
      { y: staffTop + 2.5 * lineSpacing, note: 'D' },
      { y: staffTop + 3 * lineSpacing, note: 'C' },
      { y: staffTop + 3.5 * lineSpacing, note: 'B' },
      { y: staffTop + 4 * lineSpacing, note: 'A' },
      { y: staffTop + 4.5 * lineSpacing, note: 'G' },
      { y: staffTop + 5 * lineSpacing, note: 'F' },
      { y: staffTop + 5.5 * lineSpacing, note: 'E' },
      { y: staffTop + 6 * lineSpacing, note: 'D' },
      { y: staffTop + 6.5 * lineSpacing, note: 'C' }
    ];
    
    // 가장 가까운 음표 찾기
    let closestNote = noteMapping[0];
    let minDistance = Math.abs(y - closestNote.y);
    
    for (const note of noteMapping) {
      const distance = Math.abs(y - note.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestNote = note;
      }
    }
    
    return closestNote.note;
  };

  const getSolfegeNoteName = (englishNote: string): string => {
    const noteMap: { [key: string]: string } = {
      'C': '도', 'D': '레', 'E': '미', 'F': '파', 'G': '솔', 'A': '라', 'B': '시'
    };
    return noteMap[englishNote] || '도';
  };

  const generateNewProblem = useCallback(() => {
    const noteY = generateRandomNotePosition();
    const correctEnglishNote = getNoteName(noteY);
    const correctSolfegeNote = getSolfegeNoteName(correctEnglishNote);
    
    // 정답을 포함한 4개의 옵션 생성
    const allOptions = [...solfegeNotes];
    const options = [correctSolfegeNote];
    
    // 정답이 아닌 다른 옵션 3개 추가
    while (options.length < 4) {
      const randomOption = allOptions[Math.floor(Math.random() * allOptions.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    // 옵션 순서 섞기
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    const newProblem: Problem = {
      note: { x: staffConfig.noteX, y: noteY },
      correctAnswer: correctSolfegeNote,
      options: shuffledOptions
    };
    
    setCurrentProblem(newProblem);
    setAnswered(false);
    setFeedback({ message: '', type: null });
  }, [staffConfig.noteX]);

  const checkAnswer = (selectedAnswer: string) => {
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
        message: `틀렸습니다. 정답은 "${currentProblem.correctAnswer}" 입니다.`, 
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-5">
        {/* Header */}
        <header className="text-center mb-6 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <Link 
              href="/"
              className="bg-white bg-opacity-20 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm md:text-base"
            >
              🏠 홈으로
            </Link>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
              🎵 음표 맞추기 퀴즈
            </h1>
            <div className="w-20 md:w-24"></div> {/* 균형을 위한 빈 공간 */}
          </div>
          <p className="text-base md:text-xl opacity-90 px-4">
            오선지에 있는 음표가 어떤 음인지 맞춰보세요!
          </p>
        </header>

        {/* Game Container */}
        <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl mb-6 md:mb-8">
          <ScoreBoard 
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            accuracy={accuracy}
            streak={streak}
            bestStreak={bestStreak}
          />

                  {/* Question */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            이건 어떤 음인가요?
          </h2>
        </div>

          {/* Staff Display */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-4xl">
              {currentProblem && (
                <VexFlowStaff 
                  currentProblem={{
                    leftNote: currentProblem.note,
                    rightNote: { x: 0, y: 0 }, // 사용하지 않음
                    correctAnswer: 'left' // 사용하지 않음
                  }} 
                  answered={answered}
                  singleNote={true}
                />
              )}
            </div>
          </div>

          {/* Answer Options */}
          {currentProblem && !answered && (
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              {currentProblem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => checkAnswer(option)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg text-lg md:text-xl transition-colors duration-200 transform hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Next Problem Button */}
          {answered && (
            <div className="text-center">
              <button
                onClick={generateNewProblem}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors duration-200"
              >
                다음 문제 →
              </button>
            </div>
          )}

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="quiz" />
      </div>
    </div>
  );
} 