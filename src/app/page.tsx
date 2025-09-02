'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🎵 캐시뮤직 온라인
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              음악 연습 어플 사이트
            </div>
          </div>

          
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            캐시뮤직 온라인
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">
            음악 연습 어플 사이트
          </p>
          <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto px-4">
            온라인에서 언제든지 음악을 연습할 수 있는 플랫폼입니다. 
            다양한 음악 학습 도구를 통해 음악 실력을 향상시켜보세요!
          </p>
        </div>

        {/* 연습 도구 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* 높은음/낮은음 구분 연습 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                높은음/낮은음 구분 연습
              </h3>
              <p className="text-gray-600 mb-6">
                두 개의 음표 중에서 더 높은 음을 선택하는 연습을 통해 
                음의 높낮이를 구분하는 능력을 향상시킬 수 있습니다.
              </p>
              <Link 
                href="/note-comparison"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                연습 시작하기
              </Link>
            </div>
          </div>

          

          {/* 음표 맞추기 퀴즈 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                음표 맞추기 퀴즈
              </h3>
              <p className="text-gray-600 mb-6">
                오선지에 있는 음표를 보고 해당하는 음 이름(도레미파솔라시)을 맞추는 퀴즈를 통해 
                악보 읽기 능력을 향상시킬 수 있습니다.
              </p>
              <Link 
                href="/note-quiz"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                퀴즈 시작하기
              </Link>
            </div>
          </div>

          

          {/* 음표 그리기 퀴즈 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                음표 그리기 퀴즈
              </h3>
              <p className="text-gray-600 mb-6">
                마우스로 오선지에 음표를 직접 그리는 퀴즈를 통해 
                악보 작성 능력을 향상시킬 수 있습니다.
              </p>
              <Link 
                href="/note-drawing"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                그리기 시작하기
              </Link>
            </div>
          </div>

          {/* 나머지음 훈련 퀴즈 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                나머지음 훈련
              </h3>
              <p className="text-gray-600 mb-6">
                높은음(D5~G6)과 낮은음(F3~B3)을 훈련하는 퀴즈를 통해 
                더 넓은 음역의 악보 읽기 능력을 향상시킬 수 있습니다.
              </p>
              <Link 
                href="/note-quiz-2"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
              >
                훈련 시작하기
              </Link>
            </div>
          </div>

          {/* 다중 선택 퀴즈 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                다중 선택 퀴즈
              </h3>
              <p className="text-gray-600 mb-6">
                F3~G6 범위에서 특정 음(도레미파솔라시)의 모든 옥타브를 선택하는 
                다중 선택 퀴즈를 통해 음의 인식 능력을 향상시킬 수 있습니다.
              </p>
              <Link 
                href="/note-quiz-3"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                퀴즈 시작하기
              </Link>
            </div>
          </div>

          {/* 계이름 ↔ 알파벳 학습 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🔤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                계이름 ↔ 알파벳 학습
              </h3>
              <p className="text-gray-600 mb-6">
                도레미파솔라시와 C D E F G A B의 매칭을 학습하고, 양방향 퀴즈로 복습해보세요.
              </p>
              <Link 
                href="/solfege-learning"
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
              >
                학습 & 퀴즈 시작하기
              </Link>
            </div>
          </div>

                  {/* 음표와 쉼표 학습 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              음표와 쉼표 학습
            </h3>
            <p className="text-gray-600 mb-6">
              4분음표, 2분음표, 온음표와 쉼표의 모양과 박자를
              VexFlow를 통해 시각적으로 학습할 수 있습니다.
            </p>
            <Link
              href="/note-learning"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
            >
              학습 & 퀴즈 시작하기
            </Link>
          </div>
        </div>

                  {/* 고급 음표 학습 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <div className="text-4xl mb-4">🎼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              고급 음표 학습
            </h3>
            <p className="text-gray-600 mb-6">
              8분음표, 16분음표, 점 2분음표, 점 8분음표의 모양과 박자를
              VexFlow를 통해 시각적으로 학습할 수 있습니다.
            </p>
            <Link
              href="/note-learning-advanced"
              className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
            >
              고급 학습 & 퀴즈 시작하기
            </Link>
          </div>
        </div>

          {/* 딴이름 한소리 훈련 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">♯♭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                딴이름 한소리 훈련
              </h3>
              <p className="text-gray-600 mb-6">
                C# = Db 처럼, 기보는 다르지만 같은 소리를 빠르게 매칭해보세요.
              </p>
              <Link 
                href="/enharmonic-training"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                시작하기
              </Link>
            </div>
          </div>

          {/* 음표 맞추기 퀴즈 (낮은음자리표) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                음표 맞추기 퀴즈 (낮은음자리표)
              </h3>
              <p className="text-gray-600 mb-6">
                낮은음자리표 C3~C4 범위의 음표를 보고 계이름을 맞춰보세요.
              </p>
              <Link 
                href="/note-quiz-bass"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
              >
                퀴즈 시작하기
              </Link>
            </div>
          </div>

          {/* 음표 그리기 퀴즈 (낮은음자리표) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                음표 그리기 퀴즈 (낮은음자리표)
              </h3>
              <p className="text-gray-600 mb-6">
                낮은음자리표 C3~C4 범위의 목표 음표를 직접 그려보세요.
              </p>
              <Link 
                href="/note-drawing-bass"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200"
              >
                그리기 시작하기
              </Link>
            </div>
          </div>
          {/* 나머지음 훈련 (낮은음자리표) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                나머지음 훈련 (낮은음자리표)
              </h3>
              <p className="text-gray-600 mb-6">
                낮은음자리표 D4~G4, F2~B2 범위를 훈련해보세요.
              </p>
              <Link 
                href="/note-quiz-2-bass"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200"
              >
                훈련 시작하기
              </Link>
            </div>
          </div>

          {/* 다중 선택 퀴즈 (낮은음자리표) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                다중 선택 퀴즈 (낮은음자리표)
              </h3>
              <p className="text-gray-600 mb-6">
                C2~G4 범위에서 특정 음의 모든 옥타브를 선택하세요.
              </p>
              <Link 
                href="/note-quiz-3-bass"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
              >
                퀴즈 시작하기
              </Link>
            </div>
          </div>
        </div>

        

        {/* 특징 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12 md:mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            캐시뮤직의 특징
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">🌐</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">온라인 접근</h4>
              <p className="text-gray-600">
                언제 어디서나 인터넷만 있으면 음악 연습이 가능합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">체계적 학습</h4>
              <p className="text-gray-600">
                단계별로 구성된 연습 프로그램으로 체계적으로 학습할 수 있습니다.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🎤</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">라이브 질의응답</h4>
              <p className="text-gray-600">
                라이브를 통해 강사와 실시간으로 질의응답이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2025 캐시뮤직 온라인. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
}
