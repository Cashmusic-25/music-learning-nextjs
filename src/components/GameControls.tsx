interface GameControlsProps {
  answered: boolean;
  onCheckAnswer: (answer: 'left' | 'right') => void;
  onNextProblem: () => void;
}

export default function GameControls({ answered, onCheckAnswer, onNextProblem }: GameControlsProps) {
  return (
    <div className="flex justify-center gap-5 mb-5 flex-wrap">
      <button
        onClick={() => onCheckAnswer('left')}
        disabled={answered}
        className="px-6 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        왼쪽 음표가 더 높음
      </button>
      <button
        onClick={() => onCheckAnswer('right')}
        disabled={answered}
        className="px-6 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        오른쪽 음표가 더 높음
      </button>
      <button
        onClick={onNextProblem}
        disabled={!answered}
        className="px-8 py-4 text-lg font-bold border-none rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        다음 문제
      </button>
    </div>
  );
} 