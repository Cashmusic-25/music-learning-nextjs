'use client';

import Link from 'next/link';
import EnharmonicQuiz from '@/components/EnharmonicQuiz';

export default function EnharmonicTrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">딴이름 한소리 훈련</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700">홈으로</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">설명</h2>
          <p className="text-gray-700 leading-relaxed">
            딴이름 한소리(enharmonic)는 기보는 다르지만 실제로 같은 소리를 의미합니다. 예를 들어 <strong>C#</strong>과 <strong>Db</strong>는 같은 소리입니다.
            아래 퀴즈에서 제시된 음과 같은 소리를 보기에서 선택해보세요.
          </p>
        </section>

        <EnharmonicQuiz />
      </main>
    </div>
  );
}



