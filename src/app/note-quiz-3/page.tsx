'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScoreBoard from '@/components/ScoreBoard';
import VexFlowStaff from '@/components/VexFlowStaff';
import GameControls from '@/components/GameControls';
import Feedback from '@/components/Feedback';
import Instructions from '@/components/Instructions';

interface Note {
  x: number;
  y: number;
  noteName: string;
  octave: number;
}

interface Problem {
  notes: Note[];
  targetNote: string; // '도', '레', '미', '파', '솔', '라', '시'
  correctAnswers: string[]; // 선택해야 할 음표들의 ID
}

export default function NoteQuiz3Page() {
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | null }>({ message: '', type: null });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const staffConfig = {
    lineSpacing: 20,
    staffTop: 100,
    staffHeight: 80,
    noteX: 400,
    noteSize: 15
  };

  // 도레미파솔라시도 음계
  const solfegeNotes = ['도', '레', '미', '파', '솔', '라', '시'];
  
  // 영어 음계 (C, D, E, F, G, A, B)
  const englishNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // F3~G6 범위의 모든 음표 생성
  const generateAllNotes = (): Note[] => {
    const staffTop = 100;
    const lineSpacing = 20;
    const notes: Note[] = [];
    
    // F3~G6 범위의 모든 음표
    const noteRanges = [
      // G6~F6
      { y: staffTop - 4 * lineSpacing, note: 'G', octave: 6 },
      { y: staffTop - 3.5 * lineSpacing, note: 'F', octave: 6 },
      { y: staffTop - 3 * lineSpacing, note: 'E', octave: 6 },
      { y: staffTop - 2.5 * lineSpacing, note: 'D', octave: 6 },
      { y: staffTop - 2 * lineSpacing, note: 'C', octave: 6 },
      { y: staffTop - 1.5 * lineSpacing, note: 'B', octave: 5 },
      { y: staffTop - 1 * lineSpacing, note: 'A', octave: 5 },
      { y: staffTop - 0.5 * lineSpacing, note: 'G', octave: 5 },
      { y: staffTop, note: 'F', octave: 5 },
      { y: staffTop + 0.5 * lineSpacing, note: 'E', octave: 5 },
      { y: staffTop + lineSpacing, note: 'D', octave: 5 },
      { y: staffTop + 1.5 * lineSpacing, note: 'C', octave: 5 },
      { y: staffTop + 2 * lineSpacing, note: 'B', octave: 4 },
      { y: staffTop + 2.5 * lineSpacing, note: 'A', octave: 4 },
      { y: staffTop + 3 * lineSpacing, note: 'G', octave: 4 },
      { y: staffTop + 3.5 * lineSpacing, note: 'F', octave: 4 },
      { y: staffTop + 4 * lineSpacing, note: 'E', octave: 4 },
      { y: staffTop + 4.5 * lineSpacing, note: 'D', octave: 4 },
      { y: staffTop + 5 * lineSpacing, note: 'C', octave: 4 },
      { y: staffTop + 5.5 * lineSpacing, note: 'B', octave: 3 },
      { y: staffTop + 6 * lineSpacing, note: 'A', octave: 3 },
      { y: staffTop + 6.5 * lineSpacing, note: 'G', octave: 3 },
      { y: staffTop + 7 * lineSpacing, note: 'F', octave: 3 },
    ];
    
    noteRanges.forEach((noteInfo, index) => {
      notes.push({
        x: 150 + (index % 4) * 150, // 4열로 배치
        y: noteInfo.y,
        noteName: noteInfo.note,
        octave: noteInfo.octave
      });
    });
    
    return notes;
  };

  const getSolfegeNoteName = (englishNote: string): string => {
    const noteMap: { [key: string]: string } = {
      'C': '도', 'D': '레', 'E': '미', 'F': '파', 'G': '솔', 'A': '라', 'B': '시'
    };
    return noteMap[englishNote] || '도';
  };

  const generateNewProblem = useCallback(() => {
    const allNotes = generateAllNotes();
    
    // 랜덤하게 타겟 음 선택 (도레미파솔라시)
    const targetSolfege = solfegeNotes[Math.floor(Math.random() * solfegeNotes.length)];
    
    // 타겟 음에 해당하는 모든 음표 찾기
    const targetEnglishNote = englishNotes[solfegeNotes.indexOf(targetSolfege)];
    const correctNotes = allNotes.filter(note => note.noteName === targetEnglishNote);
    
    // 문제에 사용할 음표들 선택 (정답 음표 + 다른 음표들)
    const problemNotes: Note[] = [];
    
    // 정답 음표들 추가
    problemNotes.push(...correctNotes);
    
    // 다른 음표들 랜덤 추가 (총 8-12개 정도)
    const otherNotes = allNotes.filter(note => note.noteName !== targetEnglishNote);
    const shuffledOthers = otherNotes.sort(() => Math.random() - 0.5);
    const additionalCount = Math.min(8 - correctNotes.length, shuffledOthers.length);
    
    for (let i = 0; i < additionalCount; i++) {
      problemNotes.push(shuffledOthers[i]);
    }
    
    // 음표 순서 섞기
    const shuffledNotes = problemNotes.sort(() => Math.random() - 0.5);
    
    // 정답 ID 생성 - shuffledNotes에서 타겟 음표들의 인덱스를 찾아서 ID 생성
    const correctAnswers: string[] = [];
    shuffledNotes.forEach((note, index) => {
      if (note.noteName === targetEnglishNote) {
        correctAnswers.push(`note-${index}`);
      }
    });
    
    const newProblem: Problem = {
      notes: shuffledNotes,
      targetNote: targetSolfege,
      correctAnswers: correctAnswers
    };
    
    setCurrentProblem(newProblem);
    setAnswered(false);
    setSelectedNotes([]);
    setFeedback({ message: '', type: null });
  }, []);

  const toggleNoteSelection = (noteId: string) => {
    if (answered) return;
    
    setSelectedNotes(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  };

  const checkAnswer = () => {
    if (answered || !currentProblem) return;
    
    setAnswered(true);
    
    // 선택된 음표들이 정답과 일치하는지 확인
    const isCorrect = selectedNotes.length === currentProblem.correctAnswers.length &&
      currentProblem.correctAnswers.every(id => selectedNotes.includes(id));
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setFeedback({ 
        message: `정답입니다! 🎉 ${currentProblem.targetNote}을 모두 선택했습니다! (연속 ${newStreak}번 정답!)`, 
        type: 'correct' 
      });
    } else {
      setIncorrectCount(prev => prev + 1);
      setStreak(0);
      setFeedback({ 
        message: `틀렸습니다. ${currentProblem.targetNote}을 모두 선택해야 합니다.`, 
        type: 'incorrect' 
      });
    }
  };

  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 text-gray-800">
      <div className="max-w-6xl mx-auto p-3 md:p-5">
        {/* Header */}
        <header className="text-center mb-4 md:mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-3 md:mb-4 gap-2 md:gap-4">
            <Link 
              href="/"
              className="bg-white bg-opacity-20 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 text-xs md:text-base order-2 md:order-1"
            >
              🏠 홈으로
            </Link>
            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg order-1 md:order-2">
              🎵 다중 선택 퀴즈
            </h1>
            <div className="w-16 md:w-24 order-3"></div> {/* 균형을 위한 빈 공간 */}
          </div>
          <p className="text-sm md:text-xl opacity-90 px-2 md:px-4">
            F3~G6 범위에서 특정 음의 모든 옥타브를 선택하세요!
          </p>
        </header>

        {/* Game Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-2xl mb-4 md:mb-8">
          <ScoreBoard 
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            accuracy={accuracy}
            streak={streak}
            bestStreak={bestStreak}
          />

          {/* Question */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">
              {currentProblem ? `${currentProblem.targetNote}을 모두 선택하세요!` : '로딩 중...'}
            </h2>
          </div>

          {/* Staff Display */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-6xl">
              {currentProblem && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {currentProblem.notes.map((note, index) => {
                    const noteId = `note-${index}`;
                    const isSelected = selectedNotes.includes(noteId);
                    const isCorrect = currentProblem.correctAnswers.includes(noteId);
                    
                    return (
                      <div 
                        key={noteId}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          isSelected ? 'scale-105' : 'hover:scale-102'
                        }`}
                        onClick={() => toggleNoteSelection(noteId)}
                      >
                        <div className={`border-2 rounded-lg p-1 md:p-2 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          <VexFlowStaff 
                            currentProblem={{
                              leftNote: { x: note.x, y: note.y },
                              rightNote: { x: 0, y: 0 },
                              correctAnswer: 'left'
                            }} 
                            answered={answered}
                            singleNote={true}
                            disableAudio={true}
                          />
                          {answered && (
                            <div className="text-center mt-1 md:mt-2 text-xs md:text-sm font-semibold">
                              {note.noteName}{note.octave}
                            </div>
                          )}
                        </div>
                        {answered && (
                          <div className={`absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {isCorrect ? '✓' : '✗'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {!answered && (
            <div className="text-center mb-6">
              <button
                onClick={checkAnswer}
                disabled={selectedNotes.length === 0}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 w-full max-w-xs md:max-w-none"
              >
                정답 확인
              </button>
            </div>
          )}

          {/* Next Problem Button */}
          {answered && (
            <div className="text-center">
              <button
                onClick={generateNewProblem}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 w-full max-w-xs md:max-w-none"
              >
                다음 문제 →
              </button>
            </div>
          )}

          <Feedback feedback={feedback} />
        </div>

        <Instructions type="quiz" />
      </div>
    </div>
  );
}
