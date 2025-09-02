'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import VexFlowStaff from '@/components/VexFlowStaff';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';

interface Note { x: number; y: number; noteName: string; octave: number; }
interface Problem { notes: Note[]; targetNote: string; correctAnswers: string[]; }

export default function NoteQuiz3BassPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  const englishNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const generateAllNotes = (): Note[] => {
    const staffTop = 100;
    const lineSpacing = 20;
    const base: { y: number; note: string; octave: number }[] = [
      // G4~D4 (위쪽)
      { y: staffTop - 3 * lineSpacing, note: 'G', octave: 4 },
      { y: staffTop - 2.5 * lineSpacing, note: 'F', octave: 4 },
      { y: staffTop - 2 * lineSpacing, note: 'E', octave: 4 },
      { y: staffTop - 1.5 * lineSpacing, note: 'D', octave: 4 },
      { y: staffTop - 1 * lineSpacing, note: 'C', octave: 4 },
      // B3~G3 (오선 내부 상단)
      { y: staffTop - 0.5 * lineSpacing, note: 'B', octave: 3 },
      { y: staffTop + 0 * lineSpacing, note: 'A', octave: 3 },
      { y: staffTop + 0.5 * lineSpacing, note: 'G', octave: 3 },
      // F3~C3 (오선 내부 하단)
      { y: staffTop + 1 * lineSpacing, note: 'F', octave: 3 },
      { y: staffTop + 1.5 * lineSpacing, note: 'E', octave: 3 },
      { y: staffTop + 2 * lineSpacing, note: 'D', octave: 3 },
      { y: staffTop + 2.5 * lineSpacing, note: 'C', octave: 3 },
      // B2~C2 (아래쪽)
      { y: staffTop + 3 * lineSpacing, note: 'B', octave: 2 },
      { y: staffTop + 3.5 * lineSpacing, note: 'A', octave: 2 },
      { y: staffTop + 4 * lineSpacing, note: 'G', octave: 2 },
      { y: staffTop + 4.5 * lineSpacing, note: 'F', octave: 2 },
      { y: staffTop + 5 * lineSpacing, note: 'E', octave: 2 },
      { y: staffTop + 5.5 * lineSpacing, note: 'D', octave: 2 },
      { y: staffTop + 6 * lineSpacing, note: 'C', octave: 2 },
    ];

    const notes: Note[] = [];
    base.forEach((n, idx) => {
      notes.push({ x: 150 + (idx % 4) * 150, y: n.y, noteName: n.note, octave: n.octave });
    });
    return notes;
  };

  const getSolfegeNoteName = (englishNote: string): string => {
    const map: Record<string, string> = { C: '도', D: '레', E: '미', F: '파', G: '솔', A: '라', B: '시' };
    return map[englishNote] || '도';
  };

  const generateNewProblem = useCallback(() => {
    const allNotes = generateAllNotes();
    const targetSolfege = solfegeNotes[Math.floor(Math.random() * solfegeNotes.length)];
    const targetEnglish = englishNotes[solfegeNotes.indexOf(targetSolfege)];
    const correctNotes = allNotes.filter(n => n.noteName === targetEnglish);

    const problemNotes: Note[] = [];
    problemNotes.push(...correctNotes);

    const others = allNotes.filter(n => n.noteName !== targetEnglish).sort(() => Math.random() - 0.5);
    const addCount = Math.min(8 - correctNotes.length, others.length);
    for (let i = 0; i < addCount; i++) problemNotes.push(others[i]);

    const shuffled = problemNotes.sort(() => Math.random() - 0.5);
    const correctAnswers: string[] = [];
    shuffled.forEach((n, i) => { if (n.noteName === targetEnglish) correctAnswers.push(`note-${i}`); });

    setCurrentProblem({ notes: shuffled, targetNote: targetSolfege, correctAnswers });
    setAnswered(false);
    setSelectedNotes([]);
    setFeedback({ message: '', type: null });
  }, []);

  const toggleNoteSelection = (id: string) => {
    if (answered) return;
    setSelectedNotes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const checkAnswer = () => {
    if (answered || !currentProblem) return;
    setAnswered(true);
    const isCorrect = selectedNotes.length === currentProblem.correctAnswers.length && currentProblem.correctAnswers.every(id => selectedNotes.includes(id));
    if (isCorrect) {
      setCorrectCount(v => v + 1);
      const s = streak + 1; setStreak(s); if (s > bestStreak) setBestStreak(s);
      setFeedback({ message: `정답입니다! 🎉 ${currentProblem.targetNote}을 모두 선택했습니다! (연속 ${s}번 정답!)`, type: 'correct' });
    } else {
      setIncorrectCount(v => v + 1);
      setStreak(0);
      setFeedback({ message: `틀렸습니다. ${currentProblem.targetNote}을 모두 선택해야 합니다.`, type: 'incorrect' });
    }
  };

  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  useEffect(() => { generateNewProblem(); }, [generateNewProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-3 md:p-5">
        <header className="text-center mb-4 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-4 gap-2 md:gap-4">
            <Link href="/" className="bg-white bg-opacity-20 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-xs md:text-base order-2 md:order-1">🏠 홈으로</Link>
            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg order-1 md:order-2">🎵 다중 선택 퀴즈 (낮은음자리표)</h1>
            <div className="w-16 md:w-24 order-3"></div>
          </div>
          <p className="text-sm md:text-xl opacity-90 px-2 md:px-4">C2~G4 범위에서 특정 음의 모든 옥타브를 선택하세요!</p>
        </header>

        <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-2xl mb-4 md:mb-8">
          <ScoreBoard correctCount={correctCount} incorrectCount={incorrectCount} accuracy={accuracy} streak={streak} bestStreak={bestStreak} />

          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">{currentProblem ? `${currentProblem.targetNote}을 모두 선택하세요!` : '로딩 중...'}</h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-6xl">
              {currentProblem && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {currentProblem.notes.map((note, index) => {
                    const noteId = `note-${index}`;
                    const isSelected = selectedNotes.includes(noteId);
                    const isCorrect = currentProblem.correctAnswers.includes(noteId);
                    return (
                      <div key={noteId} className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'scale-105' : 'hover:scale-102'}`} onClick={() => toggleNoteSelection(noteId)}>
                        <div className={`border-2 rounded-lg p-1 md:p-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                          <VexFlowStaff currentProblem={{ leftNote: { x: note.x, y: note.y }, rightNote: { x: 0, y: 0 }, correctAnswer: 'left' }} answered={answered} singleNote disableAudio clef="bass" />
                          {answered && (
                            <div className="text-center mt-1 md:mt-2 text-xs md:text-sm font-semibold">{note.noteName}{note.octave}</div>
                          )}
                        </div>
                        {answered && (
                          <div className={`absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>{isCorrect ? '✓' : '✗'}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {!answered && (
            <div className="text-center mb-6">
              <button onClick={() => checkAnswer()} disabled={selectedNotes.length === 0} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 w-full max-w-xs md:max-w-none">정답 확인</button>
            </div>
          )}

          {answered && (
            <div className="text-center">
              <button onClick={generateNewProblem} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 w-full max-w-xs md:max-w-none">다음 문제 →</button>
            </div>
          )}

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="quiz" />
      </div>
    </div>
  );
}


