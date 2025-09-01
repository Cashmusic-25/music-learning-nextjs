'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type NoteName =
  | 'C' | 'C#' | 'Db'
  | 'D' | 'D#' | 'Eb'
  | 'E' | 'Fb'
  | 'F' | 'E#'
  | 'F#' | 'Gb'
  | 'G' | 'G#' | 'Ab'
  | 'A' | 'A#' | 'Bb'
  | 'B' | 'Cb' | 'B#';

interface Question {
  prompt: string; // 예: "C#은 무엇과 같은가?"
  correctAnswers: string[]; // 예: ['Db']
  options: string[]; // 보기
}

const ENHARMONIC_EQUIVS: Record<NoteName, NoteName[]> = {
  C: ['B#'],
  'C#': ['Db'],
  Db: ['C#'],
  D: [],
  'D#': ['Eb'],
  Eb: ['D#'],
  E: ['Fb'],
  F: ['E#'],
  'F#': ['Gb'],
  Gb: ['F#'],
  G: [],
  'G#': ['Ab'],
  Ab: ['G#'],
  A: [],
  'A#': ['Bb'],
  Bb: ['A#'],
  B: ['Cb']
} as any;

// 보기로 사용할 기본 음명 집합 (양키 표기)
const ALL_NOTE_NAMES: NoteName[] = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'F', 'E#', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#'
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function EnharmonicQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const questions: Question[] = useMemo(() => {
    // 대표적으로 변음이 있는 항목들 위주로 출제
    const bases: NoteName[] = ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'B', 'Cb', 'C', 'E', 'F'];

    return bases.map((base) => {
      const corrects = ENHARMONIC_EQUIVS[base] || [];
      const prompt = `${base} 은(는) 무엇과 같은가?`;
      // 오답 보기 생성
      const wrongs = shuffle(
        ALL_NOTE_NAMES.filter((n) => n !== base && !corrects.includes(n))
      ).slice(0, 3);
      const options = shuffle([...corrects, ...wrongs]);
      return { prompt, correctAnswers: corrects, options };
    });
  }, []);

  const current = questions[currentIndex % questions.length];

  const handleSubmit = () => {
    if (!selected) return;
    const ok = current.correctAnswers.includes(selected);
    setIsCorrect(ok);
    setShowFeedback(true);
    setTotal((t) => t + 1);
    if (ok) setScore((s) => s + 1);

    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      setIsCorrect(null);
      setCurrentIndex((i) => i + 1);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">딴이름 한소리 퀴즈</h2>
        <p className="text-gray-600">예: C# = Db 처럼, 같은 소리를 고르세요.</p>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-500 mt-3">
          <span>정답: {score}</span>
          <span>진행: {total}</span>
          <span>정답률: {total > 0 ? Math.round((score / total) * 100) : 0}%</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-xl md:text-2xl font-semibold text-gray-900">
          {current.prompt}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(opt)}
            className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 text-lg ${
              selected === opt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!selected || showFeedback}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
            selected && !showFeedback ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          정답 확인
        </button>
      </div>

      {showFeedback && (
        <div className={`text-center mt-6 p-4 rounded-lg ${
          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="text-2xl mb-2">{isCorrect ? '🎉 정답!' : '❌ 오답'}</div>
          {!isCorrect && (
            <div className="text-sm">정답: {current.correctAnswers.join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
}


