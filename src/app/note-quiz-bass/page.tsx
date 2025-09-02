'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import VexFlowStaff from '@/components/VexFlowStaff';

interface Note { x: number; y: number; }
interface Problem { note: Note; correctAnswer: string; options: string[]; }

export default function NoteQuizBassPage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const deckRef = useRef<string[]>([]);

  // 낮은음자리표: 도레미파솔라시도 (C3~C4 중심)
  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  // C3~C4 범위 (C3, D3, E3, F3, G3, A3, B3, C4)
  const englishNotes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

  const staffTop = 100;
  const lineSpacing = 20;

  const getNoteY = (eng: string): number => {
    // VexFlowStaff의 bass 매핑과 동일한 좌표 사용
    const map: Record<string, number> = {
      'C4': staffTop - 1 * lineSpacing,   // 위 보조선
      'B3': staffTop - 0.5 * lineSpacing, // 상단선 위 공간
      'A3': staffTop,                     // 상단선
      'G3': staffTop + 0.5 * lineSpacing,
      'F3': staffTop + 1 * lineSpacing,
      'E3': staffTop + 1.5 * lineSpacing,
      'D3': staffTop + 2 * lineSpacing,   // 중앙선
      'C3': staffTop + 2.5 * lineSpacing,
    };
    return map[eng];
  };

  const getSolfege = (eng: string): string => {
    const map: Record<string, string> = {
      'C3': '도', 'D3': '레', 'E3': '미', 'F3': '파', 'G3': '솔', 'A3': '라', 'B3': '시', 'C4': '도'
    };
    return map[eng];
  };

  const shuffle = (arr: string[]) => arr.slice().sort(() => Math.random() - 0.5);

  const refillDeck = () => {
    deckRef.current = shuffle(englishNotes);
  };

  const generateProblem = useCallback(() => {
    if (deckRef.current.length === 0) {
      refillDeck();
    }
    const targetEng = deckRef.current.shift() as string;
    const targetY = getNoteY(targetEng);
    const correct = getSolfege(targetEng);

    const pool = [...solfegeNotes.filter((n) => n !== correct)];
    const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);

    setProblem({ note: { x: 400, y: targetY }, correctAnswer: correct, options });
    setAnswered(false);
    setFeedback(null);
  }, []);

  const check = (choice: string) => {
    if (!problem || answered) return;
    const ok = choice === problem.correctAnswer;
    setAnswered(true);
    setTotalAttempts((v) => v + 1);
    if (ok) setCorrectCount((v) => v + 1);
    setFeedback(ok ? '정답입니다! 🎉' : `틀렸습니다. 정답은 "${problem.correctAnswer}" 입니다.`);
    setTimeout(() => {
      generateProblem();
    }, 1600);
  };

  useEffect(() => { refillDeck(); generateProblem(); }, [generateProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">🎯 음표 맞추기 퀴즈 (낮은음자리표)</h1>
        <p className="text-center text-gray-600 mb-6">C3~C4 범위</p>

        <div className="flex justify-center mb-6 gap-2">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">🏠 홈으로</Link>
          <Link href="/note-quiz" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">🎼 높은음자리표 버전</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <ScoreBoard
            correctCount={correctCount}
            incorrectCount={Math.max(0, totalAttempts - correctCount)}
            accuracy={totalAttempts === 0 ? 0 : Math.round((correctCount / totalAttempts) * 100)}
          />
          {problem && (
            <VexFlowStaff
              currentProblem={{ leftNote: problem.note, rightNote: { x: 0, y: 0 }, correctAnswer: 'left' }}
              answered={answered}
              singleNote
              correctNoteName={problem.correctAnswer}
              disableAudio
              clef="bass"
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            {problem?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => check(opt)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${answered ? 'cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="text-center mt-4 p-3 rounded-lg bg-yellow-50 text-yellow-800 font-medium">{feedback}</div>
          )}
        </div>
      </div>
    </div>
  );
}


