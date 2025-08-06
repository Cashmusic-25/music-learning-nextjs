interface InstructionsProps {
  type?: 'comparison' | 'quiz' | 'drawing';
}

export default function Instructions({ type = 'comparison' }: InstructionsProps) {
  if (type === 'drawing') {
    return (
      <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl">
        <h3 className="text-gray-800 text-xl md:text-2xl mb-4 md:mb-5 font-bold">📖 음표 그리기 퀴즈 사용법</h3>
        <ul className="space-y-2 md:space-y-3">
          <li className="flex items-center p-2 md:p-3 border-b border-gray-200 text-gray-600 text-base md:text-lg">
            <span className="mr-2 md:mr-3">🎨</span>
            화면에 표시된 음표 이름(도레미파솔라시)을 확인하세요
          </li>
          <li className="flex items-center p-2 md:p-3 border-b border-gray-200 text-gray-600 text-base md:text-lg">
            <span className="mr-2 md:mr-3">🎨</span>
            마우스로 오선지 위를 클릭하여 해당 음표를 그리세요
          </li>
          <li className="flex items-center p-2 md:p-3 border-b border-gray-200 text-gray-600 text-base md:text-lg">
            <span className="mr-2 md:mr-3">🎨</span>
            &ldquo;정답 확인&rdquo; 버튼을 눌러 정답을 확인하세요
          </li>
          <li className="flex items-center p-2 md:p-3 text-gray-600 text-base md:text-lg">
            <span className="mr-2 md:mr-3">🎨</span>
            &ldquo;지우기&rdquo; 버튼으로 다시 그릴 수 있습니다
          </li>
        </ul>
      </div>
    );
  }
  
  if (type === 'quiz') {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h3 className="text-gray-800 text-2xl mb-5 font-bold">📖 음표 맞추기 퀴즈 사용법</h3>
        <ul className="space-y-3">
          <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
            <span className="mr-3">🎵</span>
            오선지에 하나의 음표가 표시됩니다
          </li>
          <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
            <span className="mr-3">🎵</span>
            해당 음표가 어떤 음인지 아래 보기 중에서 선택하세요 (도레미파솔라시)
          </li>
          <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
            <span className="mr-3">🎵</span>
            정답을 확인한 후 &ldquo;다음 문제&rdquo; 버튼을 눌러 계속 퀴즈를 풀어보세요
          </li>
          <li className="flex items-center p-3 text-gray-600 text-lg">
            <span className="mr-3">🎵</span>
            정답률을 확인하여 악보 읽기 실력을 향상시켜보세요!
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <h3 className="text-gray-800 text-2xl mb-5 font-bold">📖 높은음/낮은음 구분 연습 사용법</h3>
      <ul className="space-y-3">
        <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
          <span className="mr-3">🎵</span>
          오선지에 두 개의 음표가 표시됩니다
        </li>
        <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
          <span className="mr-3">🎵</span>
          더 높은 음을 선택하세요 (위쪽에 있는 음표가 더 높은 음입니다)
        </li>
        <li className="flex items-center p-3 border-b border-gray-200 text-gray-600 text-lg">
          <span className="mr-3">🎵</span>
          정답을 확인한 후 &ldquo;다음 문제&rdquo; 버튼을 눌러 계속 연습하세요
        </li>
        <li className="flex items-center p-3 text-gray-600 text-lg">
          <span className="mr-3">🎵</span>
          정답률을 확인하여 실력을 향상시켜보세요!
        </li>
      </ul>
    </div>
  );
} 