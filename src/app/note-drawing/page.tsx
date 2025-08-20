'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';
import VexFlowDrawingStaff from '@/components/VexFlowDrawingStaff';

interface Note {
  x: number;
  y: number;
}

interface Problem {
  targetNote: string;
  targetY: number;
}

export default function NoteDrawingPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [drawnNote, setDrawnNote] = useState<Note | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    // 초기값을 즉시 계산하여 설정
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // 도레미파솔라시도 음계
  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  
  // 영어 음계 (C, D, E, F, G, A, B, C5)
  const englishNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];

  const getNoteY = (noteName: string): number => {
    // yToVexNote와 동일한 로직 사용하여 일관성 확보
    const staffFirstLine = isMobile ? 150 : 180;
    const lineSpacing = 20;
    
    const noteMapping: { [key: string]: number } = {
      'C': staffFirstLine + lineSpacing,           // C4 (낮은 도) - 첫 번째 선 아래 1칸
      'D': staffFirstLine + 0.5 * lineSpacing,     // D4 - 첫 번째 선 아래 0.5칸
      'E': staffFirstLine,                         // E4 - 첫 번째 선 위
      'F': staffFirstLine - 0.5 * lineSpacing,     // F4 - 첫 번째 선 위 0.5칸
      'G': staffFirstLine - lineSpacing,           // G4 - 첫 번째 선 위 1칸
      'A': staffFirstLine - 1.5 * lineSpacing,     // A4 - 첫 번째 선 위 1.5칸
      'B': staffFirstLine - 2 * lineSpacing,       // B4 - 첫 번째 선 위 2칸
      'C5': staffFirstLine - 2.5 * lineSpacing,    // C5 (높은 도) - 첫 번째 선 위 2.5칸
    };
    
    // 디버깅을 위한 로그 추가
    console.log('getNoteY 입력:', noteName);
    console.log('getNoteY staffFirstLine:', staffFirstLine);
    console.log('getNoteY 결과 Y:', noteMapping[noteName] || staffFirstLine);
    
    return noteMapping[noteName] || staffFirstLine;
  };

  // 정답 확인용 음표 위치 해석 함수 (getNoteY와 동일한 로직 사용)
  const yToVexNote = (y: number): string => {
    const staffFirstLine = isMobile ? 150 : 180;
    const lineSpacing = 20;
    
    const noteMapping = [
      { y: staffFirstLine - 2.5 * lineSpacing, note: 'c/5' },      // C5 (높은 도) - 첫 번째 선 위 2.5칸
      { y: staffFirstLine - 2 * lineSpacing, note: 'b/4' },        // B4 (시) - 첫 번째 선 위 2칸
      { y: staffFirstLine - 1.5 * lineSpacing, note: 'a/4' },      // A4 (라) - 첫 번째 선 위 1.5칸
      { y: staffFirstLine - lineSpacing, note: 'g/4' },            // G4 (솔) - 첫 번째 선 위 1칸
      { y: staffFirstLine - 0.5 * lineSpacing, note: 'f/4' },      // F4 (파) - 첫 번째 선 위 0.5칸
      { y: staffFirstLine, note: 'e/4' },                          // E4 (미) - 첫 번째 선 위
      { y: staffFirstLine + 0.5 * lineSpacing, note: 'd/4' },      // D4 (레) - 첫 번째 선 아래 0.5칸
      { y: staffFirstLine + lineSpacing, note: 'c/4' },            // C4 (낮은 도) - 첫 번째 선 아래 1칸
    ];
    
    // 디버깅을 위한 로그 추가
    console.log('yToVexNote 입력 Y:', y);
    console.log('staffFirstLine:', staffFirstLine);
    console.log('lineSpacing:', lineSpacing);
    console.log('가능한 음표 위치들:', noteMapping.map(n => `${n.note}: ${n.y}`));
    
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
    
    console.log('선택된 음표:', closestNote.note, 'Y 위치:', closestNote.y, '거리:', minDistance);
    
    return closestNote.note;
  };

  const getSolfegeNoteName = (englishNote: string): string => {
    const noteMap: { [key: string]: string } = {
      'C': '낮은 도', 'D': '레', 'E': '미', 'F': '파', 'G': '솔', 'A': '라', 'B': '시', 'C5': '높은 도'
    };
    return noteMap[englishNote] || '도';
  };

  const generateNewProblem = useCallback(() => {
    const randomNote = englishNotes[Math.floor(Math.random() * englishNotes.length)];
    
    // 디버깅을 위한 로그 추가
    console.log('=== generateNewProblem 디버깅 ===');
    console.log('선택된 음표:', randomNote);
    console.log('현재 isMobile 상태:', isMobile);
    console.log('현재 window.innerWidth:', typeof window !== 'undefined' ? window.innerWidth : 'undefined');
    
    const targetY = getNoteY(randomNote);
    const targetSolfege = getSolfegeNoteName(randomNote);
    
    console.log('getNoteY 결과:', targetY);
    console.log('targetSolfege:', targetSolfege);
    console.log('=============================');
    
    const newProblem: Problem = {
      targetNote: targetSolfege,
      targetY: targetY
    };
    
    setCurrentProblem(newProblem);
    setAnswered(false);
    setFeedback({ message: '', type: null });
    setDrawnNote(null);
  }, [isMobile]);

  const handleNoteDrawn = (note: Note) => {
    setDrawnNote(note);
  };

  const checkAnswer = () => {
    if (answered || !currentProblem || !drawnNote) return;
    
    setAnswered(true);
    
    const drawnNoteName = yToVexNote(drawnNote.y);
    const targetNoteName = yToVexNote(currentProblem.targetY);
    
    // 디버깅을 위한 로그 추가
    console.log('=== 음표 그리기 디버깅 ===');
    console.log('그려진 음표 Y 위치:', drawnNote.y);
    console.log('그려진 음표 해석:', drawnNoteName);
    console.log('정답 Y 위치:', currentProblem.targetY);
    console.log('정답 해석:', targetNoteName);
    console.log('정답 여부:', drawnNoteName === targetNoteName);
    console.log('========================');
    
    // 음표 이름으로 정확히 비교
    const isCorrect = drawnNoteName === targetNoteName;
    
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
        message: `틀렸습니다. 정답은 "${currentProblem.targetNote}" 입니다.`, 
        type: 'incorrect' 
      });
    }
  };

  const clearNote = () => {
    setDrawnNote(null);
  };

  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      const prevMobile = isMobile;
      
      console.log('checkMobile 호출:', { 
        windowWidth: window.innerWidth, 
        mobile, 
        prevMobile, 
        changed: mobile !== prevMobile 
      });
      
      setIsMobile(mobile);
      
      // isMobile 상태가 변경되었을 때만 문제 재생성
      if (mobile !== prevMobile) {
        console.log('isMobile 상태 변경됨, 문제 재생성');
        generateNewProblem();
      }
    };
    
    // 초기 체크 및 이벤트 리스너 등록
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, generateNewProblem]);

  // 초기 문제 생성을 위한 useEffect 제거 (위에서 처리)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-3 md:p-5">
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
              🎨 음표 그리기 퀴즈
            </h1>
            <div className="w-20 md:w-24"></div>
          </div>
          <p className="text-base md:text-xl opacity-90 px-4">
            마우스로 오선지에 음표를 그려보세요!
          </p>
        </header>

        {/* Game Container */}
        <div className="bg-white rounded-3xl p-3 md:p-8 shadow-2xl mb-4 md:mb-8">
          <ScoreBoard 
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            accuracy={accuracy}
            streak={streak}
            bestStreak={bestStreak}
          />

          {/* Question */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              {currentProblem ? `${currentProblem.targetNote}를 그리세요!` : '음표를 그리세요!'}
            </h2>
          </div>

                    {/* VexFlow Staff */}
          <div className="flex justify-center mb-4 md:mb-6">
            {currentProblem && (
              <VexFlowDrawingStaff
                targetNote={currentProblem.targetNote}
                targetY={currentProblem.targetY}
                drawnNote={drawnNote}
                onNoteDrawn={handleNoteDrawn}
                answered={answered}
                isMobile={isMobile}
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            {!answered && drawnNote && (
              <button
                onClick={checkAnswer}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-sm md:text-lg transition-colors duration-200"
              >
                정답 확인
              </button>
            )}
            {!answered && (
              <button
                onClick={clearNote}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-sm md:text-lg transition-colors duration-200"
              >
                지우기
              </button>
            )}
            {answered && (
              <button
                onClick={generateNewProblem}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-lg text-sm md:text-lg transition-colors duration-200"
              >
                다음 문제 →
              </button>
            )}
          </div>

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="drawing" />
      </div>
    </div>
  );
} 