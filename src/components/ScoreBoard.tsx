interface ScoreBoardProps {
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  streak?: number;
  bestStreak?: number;
}

export default function ScoreBoard({ correctCount, incorrectCount, accuracy, streak = 0, bestStreak = 0 }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-1">정답</div>
        <div className="text-green-600 text-2xl font-bold">{correctCount}</div>
      </div>
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-1">오답</div>
        <div className="text-red-600 text-2xl font-bold">{incorrectCount}</div>
      </div>
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-1">정답률</div>
        <div className="text-blue-600 text-2xl font-bold">{accuracy}%</div>
      </div>
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-1">연속 정답</div>
        <div className="text-orange-600 text-2xl font-bold">{streak}</div>
      </div>
      <div className="text-center">
        <div className="text-gray-600 text-sm mb-1">최고 기록</div>
        <div className="text-purple-600 text-2xl font-bold">{bestStreak}</div>
      </div>
    </div>
  );
} 