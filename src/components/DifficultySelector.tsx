interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export default function DifficultySelector({ difficulty, onDifficultyChange }: DifficultySelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => onDifficultyChange('easy')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              difficulty === 'easy'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            쉬움
          </button>
          <button
            onClick={() => onDifficultyChange('medium')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              difficulty === 'medium'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            보통
          </button>
          <button
            onClick={() => onDifficultyChange('hard')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              difficulty === 'hard'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            어려움
          </button>
        </div>
      </div>
    </div>
  );
} 