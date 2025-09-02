'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import VexFlowStaff from '@/components/VexFlowStaff';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';

interface Note { x: number; y: number; }
interface Problem { note: Note; correctAnswer: string; options: string[]; }

export default function NoteQuiz2BassPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const lastYRef = useRef<number | null>(null);

  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];

  // 낮은음자리표 나머지음: C2~B2, D4~G4 (C3~C4 구간 제외)
  const staffTop = 100;
  const lineSpacing = 20;

  const generateRandomNotePosition = () => {
    // VexFlowStaff의 yToVexNote(bass)와 정확히 일치하는 좌표만 사용
    const lowerYs = [
      staffTop + 6 * lineSpacing,   // C2
      staffTop + 5.5 * lineSpacing, // D2
      staffTop + 5 * lineSpacing,   // E2
      staffTop + 4.5 * lineSpacing, // F2
      staffTop + 4 * lineSpacing,   // G2
      staffTop + 3.5 * lineSpacing, // A2
      staffTop + 3 * lineSpacing,   // B2
    ];
    const upperYs = [
      staffTop - 3 * lineSpacing,   // G4
      staffTop - 2.5 * lineSpacing, // F4
      staffTop - 2 * lineSpacing,   // E4
      staffTop - 1.5 * lineSpacing, // D4
    ];
    const pool = (Math.random() < 0.5 ? lowerYs : upperYs);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getNoteName = (y: number): string => {
    const mapping = [
      // C2~B2
      { y: staffTop + 6 * lineSpacing, note: 'C' },
      { y: staffTop + 5.5 * lineSpacing, note: 'D' },
      { y: staffTop + 5 * lineSpacing, note: 'E' },
      { y: staffTop + 4.5 * lineSpacing, note: 'F' },
      { y: staffTop + 4 * lineSpacing, note: 'G' },
      { y: staffTop + 3.5 * lineSpacing, note: 'A' },
      { y: staffTop + 3 * lineSpacing, note: 'B' },
      // D4~G4
      { y: staffTop - 1.5 * lineSpacing, note: 'D' },
      { y: staffTop - 2 * lineSpacing, note: 'E' },
      { y: staffTop - 2.5 * lineSpacing, note: 'F' },
      { y: staffTop - 3 * lineSpacing, note: 'G' },
    ];

    let closest = mapping[0];
    let min = Math.abs(y - closest.y);
    for (const m of mapping) {
      const d = Math.abs(y - m.y);
      if (d < min) { min = d; closest = m; }
    }
    return closest.note;
  };

  const getSolfege = (eng: string): string => ({ C: '도', D: '레', E: '미', F: '파', G: '솔', A: '라', B: '시' } as const)[eng] || '도';

  const generateNewProblem = useCallback(() => {
    let noteY = generateRandomNotePosition();
    // 같은 문제가 연속으로 나오지 않도록 보정
    if (lastYRef.current !== null && lastYRef.current === noteY) {
      // 최소 한 번은 다른 값을 시도
      let attempts = 0;
      while (attempts < 5 && lastYRef.current === noteY) {
        noteY = generateRandomNotePosition();
        attempts += 1;
      }
    }
    const correctEng = getNoteName(noteY);
    const correct = getSolfege(correctEng);

    const optionsPool = [...solfegeNotes];
    const options = [correct];
    while (options.length < 4) {
      const r = optionsPool[Math.floor(Math.random() * optionsPool.length)];
      if (!options.includes(r)) options.push(r);
    }

    const shuffled = options.sort(() => Math.random() - 0.5);
    setCurrentProblem({ note: { x: 400, y: noteY }, correctAnswer: correct, options: shuffled });
    setAnswered(false);
    setFeedback({ message: '', type: null });
    lastYRef.current = noteY;
  }, []);

  const checkAnswer = (selected: string) => {
    if (answered || !currentProblem) return;
    setAnswered(true);
    const ok = selected === currentProblem.correctAnswer;
    if (ok) {
      setCorrectCount((v) => v + 1);
      const s = streak + 1; setStreak(s); if (s > bestStreak) setBestStreak(s);
      setFeedback({ message: `정답입니다! 🎉 (연속 ${s}번 정답!)`, type: 'correct' });
    } else {
      setIncorrectCount((v) => v + 1);
      setStreak(0);
      setFeedback({ message: `틀렸습니다. 정답은 "${currentProblem.correctAnswer}" 입니다.`, type: 'incorrect' });
    }
  };

  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  useEffect(() => { generateNewProblem(); }, [generateNewProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-5">
        <header className="text-center mb-6 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <Link href="/" className="bg-white bg-opacity-20 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm md:text-base">🏠 홈으로</Link>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">🎵 나머지음 훈련 (낮은음자리표)</h1>
            <div className="w-20 md:w-24"></div>
          </div>
          <p className="text-base md:text-xl opacity-90 px-4">C2~B2, D4~G4 범위를 훈련해보세요!</p>
        </header>

        <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl mb-6 md:mb-8">
          <ScoreBoard correctCount={correctCount} incorrectCount={incorrectCount} accuracy={accuracy} streak={streak} bestStreak={bestStreak} />

          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">이건 어떤 음인가요?</h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-4xl">
              {currentProblem && (
                <VexFlowStaff
                  currentProblem={{ leftNote: currentProblem.note, rightNote: { x: 0, y: 0 }, correctAnswer: 'left' }}
                  answered={answered}
                  singleNote
                  correctNoteName={currentProblem.correctAnswer}
                  disableAudio
                  clef="bass"
                />
              )}
            </div>
          </div>

          {currentProblem && !answered && (
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              {currentProblem.options.map((opt, i) => (
                <button key={i} onClick={() => checkAnswer(opt)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg text-lg md:text-xl transition-colors duration-200 transform hover:scale-105">{opt}</button>
              ))}
            </div>
          )}

          {answered && (
            <div className="text-center">
              <button onClick={generateNewProblem} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors duration-200">다음 문제 →</button>
            </div>
          )}

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="quiz" />
      </div>
    </div>
  );
}


