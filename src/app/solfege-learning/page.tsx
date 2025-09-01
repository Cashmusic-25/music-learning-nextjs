'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Mode = 'learning' | 'quiz';
type Direction = 'solfege-to-letter' | 'letter-to-solfege';

interface Pair {
  letter: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
  solfege: '도' | '레' | '미' | '파' | '솔' | '라' | '시';
}

interface QuizProblem {
  prompt: string; // 화면에 보여줄 문제 텍스트
  correctAnswer: string;
  options: string[];
}

export default function SolfegeLearningPage() {
  const [mode, setMode] = useState<Mode>('learning');
  const [direction, setDirection] = useState<Direction>('solfege-to-letter');
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState<QuizProblem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pairs: Pair[] = useMemo(
    () => [
      { letter: 'C', solfege: '도' },
      { letter: 'D', solfege: '레' },
      { letter: 'E', solfege: '미' },
      { letter: 'F', solfege: '파' },
      { letter: 'G', solfege: '솔' },
      { letter: 'A', solfege: '라' },
      { letter: 'B', solfege: '시' }
    ],
    []
  );

  const current = pairs[index % pairs.length];

  const next = () => setIndex((prev) => (prev + 1) % pairs.length);
  const prev = () => setIndex((prev) => (prev - 1 + pairs.length) % pairs.length);

  const generateProblem = useCallback(() => {
    const picked = pairs[Math.floor(Math.random() * pairs.length)];
    if (direction === 'solfege-to-letter') {
      // 계이름 → 알파벳
      const correct = picked.letter;
      const pool = pairs.map((p) => p.letter).filter((l) => l !== correct);
      const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
      setProblem({ prompt: `계이름 "${picked.solfege}" 에 맞는 알파벳은?`, correctAnswer: correct, options });
    } else {
      // 알파벳 → 계이름
      const correct = picked.solfege;
      const pool = pairs.map((p) => p.solfege).filter((s) => s !== correct);
      const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
      setProblem({ prompt: `알파벳 "${picked.letter}" 에 맞는 계이름은?`, correctAnswer: correct, options });
    }
    setAnswered(false);
    setFeedback(null);
  }, [direction, pairs]);

  useEffect(() => {
    if (mode === 'quiz') {
      generateProblem();
    }
  }, [mode, direction, generateProblem]);

  const check = (choice: string) => {
    if (!problem || answered) return;
    const ok = choice === problem.correctAnswer;
    setAnswered(true);
    setFeedback(ok ? '정답입니다! 🎉' : `틀렸습니다. 정답은 "${problem.correctAnswer}" 입니다.`);
    setTimeout(() => {
      generateProblem();
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🎼 계이름 ↔ 알파벳 학습</h1>

        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">🏠 홈으로</Link>
        </div>

        {/* 모드 전환 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setMode('learning')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${mode === 'learning' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:text-amber-600'}`}
            >
              📚 학습하기
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${mode === 'quiz' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-orange-600'}`}
            >
              🎯 퀴즈하기
            </button>
          </div>
        </div>

        {/* 퀴즈 방향 전환 (퀴즈 모드에서만) */}
        {mode === 'quiz' && (
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow">
              <button
                onClick={() => setDirection('solfege-to-letter')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${direction === 'solfege-to-letter' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-blue-600'}`}
              >
                계이름 → 알파벳
              </button>
              <button
                onClick={() => setDirection('letter-to-solfege')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${direction === 'letter-to-solfege' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-blue-600'}`}
              >
                알파벳 → 계이름
              </button>
            </div>
          </div>
        )}

        {/* 학습 모드 */}
        {mode === 'learning' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-6xl font-extrabold text-amber-600 tracking-wide mb-3">{current.letter}</div>
              <div className="text-5xl font-extrabold text-gray-800 mb-2">{current.solfege}</div>
              <p className="text-gray-600">알파벳 {current.letter} 는(은) 계이름 &quot;{current.solfege}&quot; 와 매칭됩니다.</p>
            </div>

            <div className="flex justify-center items-center gap-4">
              <button onClick={prev} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold">◀ 이전</button>
              <span className="text-lg font-semibold text-gray-700">{index + 1} / {pairs.length}</span>
              <button onClick={next} className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold">다음 ▶</button>
            </div>
          </div>
        )}

        {/* 퀴즈 모드 */}
        {mode === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">문제</h2>
              <p className="text-lg text-gray-700">{problem?.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
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
        )}

        {/* 학습 팁 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 팁</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• 알파벳은 C D E F G A B 순서이며, 각각 도 레 미 파 솔 라 시에 대응합니다</li>
            <li>• C 다음은 다시 C로 반복되며, 옥타브에 따라 숫자가 붙기도 합니다 (예: C4)</li>
            <li>• 퀴즈 방향을 바꿔 양방향으로 연습해 보세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



