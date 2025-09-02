'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';
import VexFlowDrawingStaff from '@/components/VexFlowDrawingStaff';

interface Note { x: number; y: number; }
interface Problem { targetNote: string; targetY: number; }

export default function NoteDrawingBassPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [drawnNote, setDrawnNote] = useState<Note | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const englishNotes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

  const getNoteY = (noteName: string): number => {
    const staffFirstLine = isMobile ? 150 : 180;
    const lineSpacing = 20;
    const map: Record<string, number> = {
      'C4': staffFirstLine - 5 * lineSpacing,   // 위 보조선
      'B3': staffFirstLine - 4.5 * lineSpacing, // 상단선 위 공간
      'A3': staffFirstLine - 4 * lineSpacing,   // 상단선
      'G3': staffFirstLine - 3.5 * lineSpacing,
      'F3': staffFirstLine - 3 * lineSpacing,
      'E3': staffFirstLine - 2.5 * lineSpacing,
      'D3': staffFirstLine - 2 * lineSpacing,   // 중앙선
      'C3': staffFirstLine - 1.5 * lineSpacing,
    };
    return map[noteName];
  };

  const getSolfegeNoteName = (englishNote: string): string => {
    const noteMap: Record<string, string> = {
      'C3': '낮은 도', 'D3': '레', 'E3': '미', 'F3': '파', 'G3': '솔', 'A3': '라', 'B3': '시', 'C4': '높은 도'
    };
    return noteMap[englishNote];
  };

  const generateNewProblem = useCallback(() => {
    const randomNote = englishNotes[Math.floor(Math.random() * englishNotes.length)];
    const targetY = getNoteY(randomNote);
    const targetSolfege = getSolfegeNoteName(randomNote);
    setCurrentProblem({ targetNote: targetSolfege, targetY });
    setAnswered(false);
    setFeedback({ message: '', type: null });
    setDrawnNote(null);
  }, [isMobile]);

  const handleNoteDrawn = (note: Note) => setDrawnNote(note);

  const checkAnswer = () => {
    if (answered || !currentProblem || !drawnNote) return;
    setAnswered(true);

    const yToVexNote = (y: number): string => {
      const staffFirstLine = isMobile ? 150 : 180;
      const lineSpacing = 20;
      const mapping = [
        { y: staffFirstLine - 5 * lineSpacing, note: 'c/4' },
        { y: staffFirstLine - 4.5 * lineSpacing, note: 'b/3' },
        { y: staffFirstLine - 4 * lineSpacing, note: 'a/3' },
        { y: staffFirstLine - 3.5 * lineSpacing, note: 'g/3' },
        { y: staffFirstLine - 3 * lineSpacing, note: 'f/3' },
        { y: staffFirstLine - 2.5 * lineSpacing, note: 'e/3' },
        { y: staffFirstLine - 2 * lineSpacing, note: 'd/3' },
        { y: staffFirstLine - 1.5 * lineSpacing, note: 'c/3' },
      ];
      let closest = mapping[0];
      let minDist = Math.abs(y - closest.y);
      for (const m of mapping) {
        const d = Math.abs(y - m.y);
        if (d < minDist) { minDist = d; closest = m; }
      }
      return closest.note;
    };

    const drawnNoteName = yToVexNote(drawnNote.y);
    const targetNoteName = yToVexNote(currentProblem.targetY);
    const isCorrect = drawnNoteName === targetNoteName;
    if (isCorrect) {
      setCorrectCount((v) => v + 1);
      const s = streak + 1; setStreak(s); if (s > bestStreak) setBestStreak(s);
      setFeedback({ message: `정답입니다! 🎉 (연속 ${s}번 정답!)`, type: 'correct' });
    } else {
      setIncorrectCount((v) => v + 1);
      setStreak(0);
      setFeedback({ message: `틀렸습니다. 정답은 "${currentProblem.targetNote}" 입니다.`, type: 'incorrect' });
    }
  };

  const clearNote = () => setDrawnNote(null);

  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { generateNewProblem(); }, [generateNewProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-3 md:p-5">
        <header className="text-center mb-6 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <Link href="/" className="bg-white bg-opacity-20 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm md:text-base">🏠 홈으로</Link>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">🎨 음표 그리기 퀴즈 (낮은음자리표)</h1>
            <div className="w-20 md:w-24"></div>
          </div>
          <p className="text-base md:text-xl opacity-90 px-4">낮은음자리표 C3~C4 범위를 그려보세요!</p>
        </header>

        <div className="bg-white rounded-3xl p-3 md:p-8 shadow-2xl mb-4 md:mb-8">
          <ScoreBoard correctCount={correctCount} incorrectCount={incorrectCount} accuracy={accuracy} streak={streak} bestStreak={bestStreak} />

          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              {currentProblem ? `${currentProblem.targetNote}를 그리세요!` : '음표를 그리세요!'}
            </h2>
          </div>

          <div className="flex justify-center mb-4 md:mb-6">
            {currentProblem && (
              <VexFlowDrawingStaff
                targetNote={currentProblem.targetNote}
                targetY={currentProblem.targetY}
                drawnNote={drawnNote}
                onNoteDrawn={handleNoteDrawn}
                answered={answered}
                isMobile={isMobile}
                clef="bass"
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            {!answered && drawnNote && (
              <button onClick={checkAnswer} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-sm md:text-lg transition-colors duration-200">정답 확인</button>
            )}
            {!answered && (
              <button onClick={clearNote} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg text-sm md:text-lg transition-colors duration-200">지우기</button>
            )}
            {answered && (
              <button onClick={generateNewProblem} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-lg text-sm md:text-lg transition-colors duration-200">다음 문제 →</button>
            )}
          </div>

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="drawing" />
      </div>
    </div>
  );
}


