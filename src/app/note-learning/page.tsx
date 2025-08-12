'use client';

import { useState } from 'react';
import Link from 'next/link';
import VexFlowNoteLearning from '@/components/VexFlowNoteLearning';
import VexFlowQuiz from '@/components/VexFlowQuiz';

export default function NoteLearningPage() {
  const [currentMode, setCurrentMode] = useState<'learning' | 'quiz'>('learning');
  const [currentLesson, setCurrentLesson] = useState<'notes' | 'rests'>('notes');
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const notes = [
    { name: '4분음표', duration: '4', description: '1박자', symbol: '♩' },
    { name: '2분음표', duration: '2', description: '2박자', symbol: '𝅗𝅥' },
    { name: '온음표', duration: '1', description: '4박자', symbol: '𝅝' }
  ];

  const rests = [
    { name: '4분쉼표', duration: '4', description: '1박자', symbol: '𝄽' },
    { name: '2분쉼표', duration: '2', description: '2박자', symbol: '𝄾' },
    { name: '온쉼표', duration: '1', description: '4박자', symbol: '𝄽𝄽' }
  ];

  const currentItems = currentLesson === 'notes' ? notes : rests;
  const currentItem = currentItems[currentNoteIndex];

  const nextItem = () => {
    setCurrentNoteIndex((prev) => (prev + 1) % currentItems.length);
  };

  const prevItem = () => {
    setCurrentNoteIndex((prev) => (prev - 1 + currentItems.length) % currentItems.length);
  };

  const switchLesson = (lesson: 'notes' | 'rests') => {
    setCurrentLesson(lesson);
    setCurrentNoteIndex(0);
  };

  const switchMode = (mode: 'learning' | 'quiz') => {
    setCurrentMode(mode);
    setCurrentNoteIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎵 음표와 쉼표 학습하기
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

        {/* 학습/퀴즈 모드 선택 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => switchMode('learning')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                currentMode === 'learning'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              📚 학습하기
            </button>
            <button
              onClick={() => switchMode('quiz')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                currentMode === 'quiz'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-500'
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
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🎼 음표
            </button>
            <button
              onClick={() => switchLesson('rests')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                currentLesson === 'rests'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🔇 쉼표
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
                <div className="text-6xl text-blue-500 mb-4">
                  {/* VexFlow로 음표 기호를 표시할 예정 */}
                </div>
              </div>

              {/* VexFlow로 음표/쉼표 표시 */}
              <VexFlowNoteLearning
                lessonType={currentLesson}
                noteIndex={currentNoteIndex}
                duration={currentItem.duration}
              />

              {/* 설명 */}
              <div className="mt-6 text-center">
                <div className="bg-blue-50 rounded-lg p-4 inline-block">
                  <p className="text-gray-700 font-medium">
                    {currentLesson === 'notes' 
                      ? `이 음표는 ${currentItem.description} 동안 소리를 내는 음표입니다.`
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
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                다음 ▶
              </button>
            </div>
          </>
        )}

        {/* 퀴즈 모드 */}
        {currentMode === 'quiz' && (
                      <VexFlowQuiz
              lessonType={currentLesson}
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
              <>
                <li>• 4분음표는 가장 기본이 되는 음표입니다</li>
                <li>• 2분음표는 4분음표 2개와 같습니다</li>
                <li>• 온음표는 4분음표 4개와 같습니다</li>
                <li>• 쉼표는 소리를 내지 않는 휴식 시간을 나타냅니다</li>
              </>
            ) : (
              <>
                <li>• 음표/쉼표의 모양을 자세히 관찰하세요</li>
                <li>• 박자 수를 세어보세요 (4분음표=1박자, 2분음표=2박자, 온음표=4박자)</li>
                <li>• 쉼표는 소리를 내지 않는 휴식 시간입니다</li>
                <li>• 틀려도 괜찮아요! 학습의 일부입니다</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
