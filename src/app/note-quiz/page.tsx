'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import VexFlowStaff from '@/components/VexFlowStaff';

interface Note { x: number; y: number; }
interface Problem { note: Note; correctAnswer: string; options: string[]; }

export default function NoteQuizPage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // 도레미파솔라시도
  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  // C4~C5 범위 (C4, D4, E4, F4, G4, A4, B4, C5)
  const englishNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C5'];

  const staffTop = 100;
  const lineSpacing = 20;

  const getNoteY = (english: string): number => {
    // VexFlowStaff의 yToVexNote 매핑과 정확히 일치하도록 좌표 지정
    const map: Record<string, number> = {
      'C': staffTop + 5 * lineSpacing,     // C4
      'D': staffTop + 4.5 * lineSpacing,   // D4
      'E': staffTop + 4 * lineSpacing,     // E4
      'F': staffTop + 3.5 * lineSpacing,   // F4
      'G': staffTop + 3 * lineSpacing,     // G4
      'A': staffTop + 2.5 * lineSpacing,   // A4
      'B': staffTop + 2 * lineSpacing,     // B4
      'C5': staffTop + 1.5 * lineSpacing   // C5
    };
    return map[english];
  };

  const getSolfege = (english: string): string => {
    const map: Record<string, string> = { C: '도', D: '레', E: '미', F: '파', G: '솔', A: '라', B: '시', C5: '도' };
    return map[english];
  };

  const generateProblem = useCallback(() => {
    const idx = Math.floor(Math.random() * englishNotes.length);
    const targetEng = englishNotes[idx];
    const targetY = getNoteY(targetEng);
    const correct = getSolfege(targetEng);

    // 4지선다: 정답 + 오답 3개
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
    setFeedback(ok ? '정답입니다! 🎉' : `틀렸습니다. 정답은 "${problem.correctAnswer}" 입니다.`);
    setTimeout(() => {
      generateProblem();
    }, 1600);
  };

  useEffect(() => { generateProblem(); }, [generateProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🎯 음표 맞추기 퀴즈</h1>

        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">🏠 홈으로</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          {problem && (
            <VexFlowStaff
              currentProblem={{ leftNote: problem.note, rightNote: { x: 0, y: 0 }, correctAnswer: 'left' }}
              answered={answered}
              singleNote
              correctNoteName={problem.correctAnswer}
              disableAudio
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            {problem?.options.map((opt, i) => (
              <button key={i} onClick={() => check(opt)} className={`py-3 px-4 rounded-lg font-semibold transition-all ${answered ? 'cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>{opt}</button>
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