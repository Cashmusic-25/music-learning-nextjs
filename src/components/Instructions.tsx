export default function Instructions() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <h3 className="text-gray-800 text-2xl mb-5 font-bold">📖 사용법</h3>
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
          정답을 확인한 후 "다음 문제" 버튼을 눌러 계속 연습하세요
        </li>
        <li className="flex items-center p-3 text-gray-600 text-lg">
          <span className="mr-3">🎵</span>
          정답률을 확인하여 실력을 향상시켜보세요!
        </li>
      </ul>
    </div>
  );
} 