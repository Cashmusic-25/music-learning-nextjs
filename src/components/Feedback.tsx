interface FeedbackProps {
  feedback: {
    message: string;
    type: 'correct' | 'incorrect' | null;
  };
}

export default function Feedback({ feedback }: FeedbackProps) {
  if (!feedback.type) return null;

  return (
    <div className={`text-center text-lg font-bold p-4 rounded-xl mt-5 min-h-[60px] flex items-center justify-center ${
      feedback.type === 'correct' 
        ? 'bg-green-100 text-green-800 border-2 border-green-200' 
        : 'bg-red-100 text-red-800 border-2 border-red-200'
    }`}>
      {feedback.message}
    </div>
  );
} 