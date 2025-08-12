'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VexFlowQuiz from '@/components/VexFlowQuiz';

export default function NoteQuizPage() {
  const [currentLesson, setCurrentLesson] = useState<'notes' | 'rests'>('notes');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const notes = [
    { name: '4분음표', duration: '4', description: '1박자' },
    { name: '2분음표', duration: '2', description: '2박자' },
    { name: '온음표', duration: '1', description: '4박자' }
  ];

  const rests = [
    { name: '4분쉼표', duration: '4', description: '1박자' },
    { name: '2분쉼표', duration: '2', description: '2박자' },
    { name: '온쉼표', duration: '1', description: '4박자' }
  ];

  const currentItems = currentLesson === 'notes' ? notes : rests;

  const switchLesson = (lesson: 'notes' | 'rests') => {
    setCurrentLesson(lesson);
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
  };

  const handleQuizComplete = (finalScore: number, total: number) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎯 음표와 쉼표 퀴즈
        </h1>
        
        {/* 홈으로 돌아가기 버튼 */}
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>

        {/* 학습하기 링크 */}
        <div className="flex justify-center mb-8">
          <Link
            href="/note-learning"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            📚 학습하기로 돌아가기
          </Link>
        </div>
        
        {/* 레슨 선택 탭 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => switchLesson('notes')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'notes'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🎼 음표 퀴즈
            </button>
            <button
              onClick={() => switchLesson('rests')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'rests'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🔇 쉼표 퀴즈
            </button>
          </div>
        </div>

        {/* 퀴즈 결과 표시 */}
        {showResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🎉 퀴즈 완료!
            </h2>
            <div className="text-6xl mb-4">
              {score === totalQuestions ? '🎯' : score >= totalQuestions * 0.7 ? '👍' : '💪'}
            </div>
            <p className="text-xl text-gray-600 mb-4">
              점수: <span className="font-bold text-blue-600">{score}</span> / <span className="font-bold text-gray-600">{totalQuestions}</span>
            </p>
            <p className="text-lg text-gray-700 mb-6">
              {score === totalQuestions 
                ? '완벽합니다! 모든 문제를 맞췄어요! 🎊'
                : score >= totalQuestions * 0.7 
                ? '잘했어요! 조금만 더 노력하면 완벽할 거예요! 💪'
                : '괜찮아요! 다시 한번 학습해보세요! 📚'
              }
            </p>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
            >
              다시 도전하기
            </button>
          </div>
        )}

        {/* 퀴즈 컴포넌트 */}
        {!showResult && (
          <VexFlowQuiz
            lessonType={currentLesson}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {/* 학습 팁 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            💡 퀴즈 팁
          </h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• 음표/쉼표의 모양을 자세히 관찰하세요</li>
            <li>• 박자 수를 세어보세요 (4분음표=1박자, 2분음표=2박자, 온음표=4박자)</li>
            <li>• 쉼표는 소리를 내지 않는 휴식 시간입니다</li>
            <li>• 틀려도 괜찮아요! 학습의 일부입니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 