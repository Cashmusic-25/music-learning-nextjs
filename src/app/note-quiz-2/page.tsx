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

export default function NoteQuiz2Page() {
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
    const staffTop = 100;
    const lineSpacing = 20;
    
    // VexFlowStaff의 확장된 yToVexNote 매핑에 맞춰 조정
    // C4~C5 범위 제외하고 F3~B3 (낮은음)과 D5~G6 (높은음) 범위만 사용
    
    // 높은 부분: D5~G6 (가선 위)
    const d5Y = staffTop + lineSpacing; // D5 위치 (120)
    const g6Y = staffTop - 4 * lineSpacing; // G6 위치 (20)
    
    // 낮은 부분: F3~B3 (가선 아래)
    const f3Y = staffTop + 7 * lineSpacing; // F3 위치 (240)
    const b3Y = staffTop + 5.5 * lineSpacing; // B3 위치 (210)
    
    // 두 범위 중 하나를 랜덤 선택
    const useLowRange = Math.random() < 0.5;
    
    if (useLowRange) {
      // 낮은 부분 (F3~B3)
      return Math.floor(Math.random() * (f3Y - b3Y + 1)) + b3Y;
    } else {
      // 높은 부분 (D5~G6)
      return Math.floor(Math.random() * (d5Y - g6Y + 1)) + g6Y;
    }
  };

  const getNoteName = (y: number): string => {
    // VexFlowStaff의 확장된 yToVexNote 매핑과 정확히 일치하도록 수정
    // C4~C5 범위 제외하고 F3~B3 (낮은음)과 D5~G6 (높은음) 범위만 포함
    const staffTop = 100;
    const lineSpacing = 20;
    
    const noteMapping = [
      // 높은 부분: D5~G6 (가선 위)
      { y: staffTop - 4 * lineSpacing, note: 'G' },        // G6 (g/6)
      { y: staffTop - 3.5 * lineSpacing, note: 'F' },      // F6 (f/6)
      { y: staffTop - 3 * lineSpacing, note: 'E' },        // E6 (e/6)
      { y: staffTop - 2.5 * lineSpacing, note: 'D' },      // D6 (d/6)
      { y: staffTop - 2 * lineSpacing, note: 'C' },        // C6 (c/6)
      { y: staffTop - 1.5 * lineSpacing, note: 'B' },      // B5 (b/5)
      { y: staffTop - 1 * lineSpacing, note: 'A' },        // A5 (a/5)
      { y: staffTop - 0.5 * lineSpacing, note: 'G' },      // G5 (g/5)
      { y: staffTop, note: 'F' },                          // F5 (f/5)
      { y: staffTop + 0.5 * lineSpacing, note: 'E' },      // E5 (e/5)
      { y: staffTop + lineSpacing, note: 'D' },            // D5 (d/5)
      
      // 낮은 부분: F3~B3 (가선 아래)
      { y: staffTop + 5.5 * lineSpacing, note: 'B' },      // B3 (b/3)
      { y: staffTop + 6 * lineSpacing, note: 'A' },        // A3 (a/3)
      { y: staffTop + 6.5 * lineSpacing, note: 'G' },      // G3 (g/3)
      { y: staffTop + 7 * lineSpacing, note: 'F' },        // F3 (f/3)
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
              🎵 나머지음 훈련
            </h1>
            <div className="w-20 md:w-24"></div> {/* 균형을 위한 빈 공간 */}
          </div>
          <p className="text-base md:text-xl opacity-90 px-4">
            높은음(D5~G6)과 낮은음(F3~B3)을 훈련해보세요!
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
                  correctNoteName={currentProblem.correctAnswer} // 정답 정보 전달
                  disableAudio={true}
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
