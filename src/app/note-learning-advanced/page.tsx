'use client';

import { useState } from 'react';
import Link from 'next/link';
import VexFlowNoteLearning from '@/components/VexFlowNoteLearning';
import VexFlowQuiz from '@/components/VexFlowQuiz';

export default function NoteLearningAdvancedPage() {
  const [currentMode, setCurrentMode] = useState<'learning' | 'quiz'>('learning');
  const [currentLesson, setCurrentLesson] = useState<'notes' | 'dotted' | 'rests' | 'dottedRests'>('notes');
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const notes = [
    { name: '8분음표 (1개)', duration: '8', description: '0.5박자', symbol: '♪' },
    { name: '8분음표 (2개)', duration: '8-8', description: '0.5박자 × 2', symbol: '♫' },
    { name: '8분음표 (4개)', duration: '8-4', description: '0.5박자 × 4', symbol: '♫♫' },
    { name: '16분음표 (1개)', duration: '16', description: '0.25박자', symbol: '𝅘𝅥𝅯' },
    { name: '16분음표 (2개)', duration: '16-16', description: '0.25박자 × 2', symbol: '𝅘𝅥𝅯𝅘𝅥𝅯' },
    { name: '16분음표 (4개)', duration: '16-4', description: '0.25박자 × 4', symbol: '𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯' }
  ];

  const dotted = [
    { name: '점 4분음표', duration: '4.', description: '1.5박자', symbol: '♩.' },
    { name: '점 2분음표', duration: '2.', description: '3박자', symbol: '𝅗𝅥.' },
    { name: '점 8분음표', duration: '8.', description: '0.75박자', symbol: '♪.' }
  ];

  const rests = [
    { name: '8분쉼표', duration: '8', description: '0.5박자', symbol: '𝄽' },
    { name: '16분쉼표', duration: '16', description: '0.25박자', symbol: '𝄾' }
  ];

  const dottedRests = [
    { name: '점 4분쉼표', duration: '4.', description: '1.5박자', symbol: '𝄽.' },
    { name: '점 2분쉼표', duration: '2.', description: '3박자', symbol: '𝄾.' },
    { name: '점 8분쉼표', duration: '8.', description: '0.75박자', symbol: '𝄼.' }
  ];

  const currentItems = currentLesson === 'notes' ? notes : currentLesson === 'dotted' ? dotted : currentLesson === 'dottedRests' ? dottedRests : rests;
  const currentItem = currentItems[currentNoteIndex];

  const nextItem = () => {
    setCurrentNoteIndex((prev) => (prev + 1) % currentItems.length);
  };

  const prevItem = () => {
    setCurrentNoteIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
  };

  const switchLesson = (lesson: 'notes' | 'dotted' | 'rests' | 'dottedRests') => {
    setCurrentLesson(lesson);
    setCurrentNoteIndex(0);
  };

  const switchMode = (mode: 'learning' | 'quiz') => {
    setCurrentMode(mode);
    setCurrentNoteIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎵 고급 음표 학습하기
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

        {/* 기본 음표 학습 페이지 이동 버튼 제거 */}

        {/* 학습/퀴즈 모드 선택 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => switchMode('learning')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                currentMode === 'learning'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              📚 학습하기
            </button>
            <button
              onClick={() => switchMode('quiz')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                currentMode === 'quiz'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              🎯 퀴즈하기
            </button>
          </div>
        </div>
        
        {/* 레슨 선택 탭 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => switchLesson('notes')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'notes'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              🎼 짧은 음표
            </button>
            <button
              onClick={() => switchLesson('dotted')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'dotted'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              🔴 점 음표
            </button>
            <button
              onClick={() => switchLesson('rests')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'rests'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              🔇 쉼표
            </button>
            <button
              onClick={() => switchLesson('dottedRests')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'dottedRests'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              🟠 점 쉼표
            </button>
          </div>
        </div>

        {/* 학습 모드 */}
        {currentMode === 'learning' && (
          <>
            {/* 현재 학습 항목 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentItem.name}
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  {currentItem.description}
                </p>
                <div className="text-6xl text-purple-500 mb-4">
                  {/* VexFlow로 음표 기호를 표시할 예정 */}
                </div>
              </div>

              {/* VexFlow로 음표/점 음표 표시 */}
              <VexFlowNoteLearning
                lessonType={currentLesson === 'notes' ? 'notes' : currentLesson === 'dotted' ? 'dotted' : currentLesson === 'dottedRests' ? 'dottedRests' : 'rests'}
                noteIndex={currentNoteIndex}
                duration={currentItem.duration}
              />

              {/* 설명 */}
              <div className="mt-6 text-center">
                <div className="bg-purple-50 rounded-lg p-4 inline-block">
                  <p className="text-gray-700 font-medium">
                    {currentLesson === 'notes' 
                      ? `이 음표는 ${currentItem.description} 동안 소리를 내는 짧은 음표입니다.`
                      : currentLesson === 'dotted'
                      ? `이 점 음표는 ${currentItem.description} 동안 소리를 내는 점이 붙은 음표입니다.`
                      : `이 쉼표는 ${currentItem.description} 동안 소리를 내지 않는 쉼표입니다.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={prevItem}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                ◀ 이전
              </button>
              
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-700">
                  {currentNoteIndex + 1} / {currentItems.length}
                </span>
              </div>
              
              <button
                onClick={nextItem}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
              >
                다음 ▶
              </button>
            </div>
          </>
        )}

        {/* 퀴즈 모드 */}
        {currentMode === 'quiz' && (
          <VexFlowQuiz
            lessonType={currentLesson === 'notes' ? 'notes' : currentLesson === 'dotted' ? 'dotted' : currentLesson === 'dottedRests' ? 'dottedRests' : 'rests'}
            variant="advanced"
            onQuizComplete={() => {}}
          />
        )}

        {/* 학습 팁 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            💡 {currentMode === 'learning' ? '학습' : '퀴즈'} 팁
          </h3>
              <ul className="text-yellow-700 space-y-1">
                {currentMode === 'learning' ? (
                  currentLesson === 'notes' ? (
                    <>
                      <li>• 8분음표 (1개)는 깃발이 있는 형태로 0.5박자입니다</li>
                      <li>• 8분음표 (2개·4개)는 빔으로 연결되어 보이며 각각 0.5박자입니다</li>
                      <li>• 16분음표 (1개)는 깃발이 2개인 형태로 0.25박자입니다</li>
                      <li>• 16분음표 (2개·4개)는 빔으로 연결되어 보이며 각각 0.25박자입니다</li>
                      <li>• 남은 박자를 채울 때는 “짧은 쉼표가 먼저” 나오고, 남는 구간은 4분쉼표로 채웁니다</li>
                    </>
                  ) : currentLesson === 'dotted' ? (
                    <>
                      <li>• 점 4분음표 = 4분음표 × 1.5 = 1.5박자입니다</li>
                      <li>• 점 2분음표 = 2분음표 × 1.5 = 3박자입니다</li>
                      <li>• 점 8분음표 = 8분음표 × 1.5 = 0.75박자입니다</li>
                      <li>• 점 음표 뒤의 쉼표는 “짧은 쉼표 먼저 → 남은 구간을 4분쉼표” 순서로 채웁니다</li>
                    </>
                  ) : currentLesson === 'rests' ? (
                <>
                  <li>• 8분쉼표는 0.5박자 동안 소리를 내지 않는 쉼표입니다</li>
                  <li>• 16분쉼표는 0.25박자 동안 소리를 내지 않는 쉼표입니다</li>
                </>
              ) : (
                <>
                      <li>• 8분/16분음표는 개수가 2개 이상이면 빔으로 연결되어 보입니다</li>
                      <li>• 남는 박자는 “짧은 쉼표 먼저 → 4분쉼표”로 채웁니다</li>
                      <li>• 점 4분/2분/8분음표는 각각 원래 길이의 1.5배입니다</li>
                </>
              )
            ) : (
              <>
                <li>• 음표의 모양과 점의 위치를 자세히 관찰하세요</li>
                <li>• 점이 붙으면 원래 음표 길이의 1.5배가 됩니다</li>
                <li>• 8분음표는 깃털이 1개, 16분음표는 깃털이 2개입니다</li>
                <li>• 8분음표는 각각 0.5박자, 16분음표는 각각 0.25박자이고, 여러 개 있을 때는 각각 깃털이 있습니다</li>
                <li>• 점 음표는 리듬감을 만드는 중요한 요소입니다</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
