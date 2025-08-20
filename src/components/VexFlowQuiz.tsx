'use client';

import { useEffect, useRef, useState } from 'react';

interface VexFlowQuizProps {
  lessonType: 'notes' | 'rests' | 'dotted' | 'dottedRests';
  variant?: 'basic' | 'advanced';
  onQuizComplete: (score: number, total: number) => void;
}

export default function VexFlowQuiz({ lessonType, variant = 'basic', onQuizComplete }: VexFlowQuizProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [abcjsLoaded, setAbcjsLoaded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showStats, setShowStats] = useState(false);

  const getQuestions = () => {
    if (variant === 'advanced' && lessonType === 'notes') {
      // 고급에서도 퀴즈는 개수 구분 없이 8분/16분만 출제
      return [
        { name: '8분음표', duration: '8', description: '0.5박자' },
        { name: '16분음표', duration: '16', description: '0.25박자' }
      ];
    } else if (lessonType === 'notes') {
      return [
        { name: '4분음표', duration: '4', description: '1박자' },
        { name: '2분음표', duration: '2', description: '2박자' },
        { name: '온음표', duration: '1', description: '4박자' },
        { name: '8분음표', duration: '8', description: '0.5박자' },
        { name: '16분음표', duration: '16', description: '0.25박자' }
      ];
    } else if (lessonType === 'dotted') {
      return [
        { name: '점 4분음표', duration: '4.', description: '1.5박자' },
        { name: '점 2분음표', duration: '2.', description: '3박자' },
        { name: '점 8분음표', duration: '8.', description: '0.75박자' }
      ];
    } else if (lessonType === 'dottedRests') {
      return [
        { name: '점 4분쉼표', duration: '4.', description: '1.5박자' },
        { name: '점 2분쉼표', duration: '2.', description: '3박자' },
        { name: '점 8분쉼표', duration: '8.', description: '0.75박자' }
      ];
    } else {
      return variant === 'advanced'
        ? [
            { name: '8분쉼표', duration: '8', description: '0.5박자' },
            { name: '16분쉼표', duration: '16', description: '0.25박자' }
          ]
        : [
            { name: '4분쉼표', duration: '4', description: '1박자' },
            { name: '2분쉼표', duration: '2', description: '2박자' },
            { name: '온쉼표', duration: '1', description: '4박자' }
          ];
    }
  };

  const questions = getQuestions();

  const getDurations = () => {
    if (variant === 'advanced' && lessonType === 'notes') {
      // 개수 구분 없이 두 값만 출제
      return [
        { value: '8', label: '0.5박자' },
        { value: '16', label: '0.25박자' }
      ];
    } else if (lessonType === 'notes') {
      return [
        { value: '4', label: '1박자' },
        { value: '2', label: '2박자' },
        { value: '1', label: '4박자' },
        { value: '8', label: '0.5박자' },
        { value: '16', label: '0.25박자' }
      ];
    } else if (lessonType === 'dotted') {
      return [
        { value: '4.', label: '1.5박자' },
        { value: '2.', label: '3박자' },
        { value: '8.', label: '0.75박자' }
      ];
    } else if (lessonType === 'dottedRests') {
      return [
        { value: '4.', label: '1.5박자' },
        { value: '2.', label: '3박자' },
        { value: '8.', label: '0.75박자' }
      ];
    } else {
      return variant === 'advanced'
        ? [
            { value: '8', label: '0.5박자' },
            { value: '16', label: '0.25박자' }
          ]
        : [
            { value: '4', label: '1박자' },
            { value: '2', label: '2박자' },
            { value: '1', label: '4박자' }
          ];
    }
  };

  const durations = getDurations();

  const currentQuestionData = questions[currentQuestion % questions.length];

  useEffect(() => {
    if (!containerRef.current) return;

    const loadAbcjs = async () => {
      try {
        const ABCJS = (window as any).ABCJS;
        if (!ABCJS) {
          console.warn('ABCJS 전역 객체를 찾을 수 없습니다. CDN 로딩을 확인하세요.');
          return;
        }
        setAbcjsLoaded(true);

        containerRef.current!.innerHTML = '';

        const isMobile = window.innerWidth < 768;
        
        let abcNotation = '';

        if (lessonType === 'notes') {
          // 표시용 변형: 8/16일 때는 (1개/2개/4개) 중 랜덤으로 보여주되,
          // 정답 판정은 기본 duration(8 또는 16)만 사용
          let displayDuration = currentQuestionData.duration;
          if (variant === 'advanced') {
            if (currentQuestionData.duration === '8') {
              const choices = ['8', '8-8', '8-4'] as const;
              displayDuration = choices[Math.floor(Math.random() * choices.length)];
            } else if (currentQuestionData.duration === '16') {
              const choices = ['16', '16-16', '16-4'] as const;
              displayDuration = choices[Math.floor(Math.random() * choices.length)];
            }
          }

          if (displayDuration === '4') {
            abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nCCCC|';
          } else if (displayDuration === '2') {
            abcNotation = 'X:1\nM:4/4\nL:1/2\nK:C\nCC|';
          } else if (displayDuration === '1') {
            abcNotation = 'X:1\nM:4/4\nL:1/1\nK:C\nC|';
          } else if (displayDuration === '8') {
            // 8분음표 1개 + 8분쉼표 + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nC z z2 z2 z2|';
          } else if (displayDuration === '8-8') {
            // 8분음표 2개(빔) + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nCC z2 z2 z2|';
          } else if (displayDuration === '8-4') {
            // 8분음표 4개(빔) + 4분쉼표×2
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nCCCC z2 z2|';
          } else if (displayDuration === '16') {
            // 16분음표 1개 + 점8분쉼표 + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/16\nK:C\nC z3 z4 z4 z4|';
          } else if (displayDuration === '16-16') {
            // 16분음표 2개(빔) + 8분쉼표 + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/16\nK:C\nCC z2 z4 z4 z4|';
          } else if (displayDuration === '16-4') {
            // 16분음표 4개(빔) + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/16\nK:C\nCCCC z4 z4 z4|';
          }
        } else if (lessonType === 'dotted') {
          if (currentQuestionData.duration === '4.') {
            // 점 4분음표(3/8) + 8분쉼표 + 4분쉼표×2
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nC3 z z2 z2|';
          } else if (currentQuestionData.duration === '2.') {
            // 점 2분음표(3/4) + 4분쉼표
            abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nC3 z|';
          } else if (currentQuestionData.duration === '8.') {
            // 점 8분음표(3/16) + 16분쉼표 + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nC3/2 z/2 z2 z2 z2|';
          }
        } else if (lessonType === 'dottedRests') {
          if (currentQuestionData.duration === '4.') {
            // 점 4분쉼표(3/8) + 8분쉼표 + 4분쉼표×2
            abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nz3 z z2 z2|';
          } else if (currentQuestionData.duration === '2.') {
            // 점 2분쉼표(3/4) + 4분쉼표
            abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nz3 z|';
          } else if (currentQuestionData.duration === '8.') {
            // 점 8분쉼표(3/16) + 16분쉼표 + 4분쉼표×3
            abcNotation = 'X:1\nM:4/4\nL:1/16\nK:C\nz3 z z4 z4 z4|';
          }
        } else {
          if (variant === 'advanced') {
            if (currentQuestionData.duration === '8') {
              abcNotation = 'X:1\nM:4/4\nL:1/8\nK:C\nz z2 z2 z2 z2|';
            } else if (currentQuestionData.duration === '16') {
              abcNotation = 'X:1\nM:4/4\nL:1/16\nK:C\nz z4 z4 z4 z4|';
            }
          } else {
            if (currentQuestionData.duration === '4') {
              abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nzzzz|';
            } else if (currentQuestionData.duration === '2') {
              abcNotation = 'X:1\nM:4/4\nL:1/2\nK:C\nzz|';
            } else if (currentQuestionData.duration === '1') {
              abcNotation = 'X:1\nM:4/4\nL:1/1\nK:C\nz|';
            }
          }
        }

        ABCJS.renderAbc(containerRef.current!, abcNotation, {
          responsive: 'resize',
          scale: isMobile ? 1.8 : 2.2,
          paddingbottom: 25,
          paddingleft: 25,
          paddingright: 5,
          paddingtop: 25,
          staffwidth: isMobile ? 320 : 380
        });

      } catch (error) {
        console.error('ABC.js 오류:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div style="text-align: center; padding: 50px; color: #666;">${
            lessonType === 'notes' ? '음표' : 
            lessonType === 'dotted' ? '점 음표' : '쉼표'
          } 로딩 중...</div>`;
        }
      }
    };

    loadAbcjs();
  }, [lessonType, currentQuestion, currentQuestionData.duration, questions]);

  const handleAnswer = () => {
    if (!selectedName || !selectedDuration) return;
    
    const nameCorrect = selectedName === currentQuestionData.name;
    const durationCorrect = selectedDuration === currentQuestionData.duration;
    const isCorrectAnswer = nameCorrect && durationCorrect;
    
    setIsCorrect(isCorrectAnswer);
    
    if (isCorrectAnswer) {
      setScore(prev => prev + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedName('');
      setSelectedDuration('');
      // 다음 문제로 계속 진행
      setCurrentQuestion(prev => prev + 1);
    }, 3000);
  };

  const getRandomNames = () => {
    const allNames = questions.map(q => q.name);
    const correctName = currentQuestionData.name;
    const wrongNames = allNames.filter(name => name !== correctName);
    
    // 정답 + 오답 2개를 랜덤으로 선택
    const selectedWrongNames = wrongNames
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const allNamesForQuestion = [correctName, ...selectedWrongNames];
    return allNamesForQuestion.sort(() => Math.random() - 0.5);
  };

  const getRandomDurations = () => {
    const allDurations = durations.map(d => d.value);
    const correctDuration = currentQuestionData.duration;
    const wrongDurations = allDurations.filter(d => d !== correctDuration);
    
    // 정답 + 오답 2개를 랜덤으로 선택
    const selectedWrongDurations = wrongDurations
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const allDurationsForQuestion = [correctDuration, ...selectedWrongDurations];
    return allDurationsForQuestion.sort(() => Math.random() - 0.5);
  };

  const showStatistics = () => {
    setShowStats(true);
  };

  const hideStatistics = () => {
    setShowStats(false);
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setCurrentQuestion(0);
    setSelectedName('');
    setSelectedDuration('');
    setShowStats(false);
  };

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const canSubmit = selectedName && selectedDuration;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      {/* 통계 표시 */}
      {showStats && (
        <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-2">📊 퀴즈 통계</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-semibold">총 문제 수</p>
              <p className="text-2xl font-bold text-blue-800">{totalQuestions}</p>
            </div>
            <div>
              <p className="text-blue-600 font-semibold">정답률</p>
              <p className="text-2xl font-bold text-blue-800">{accuracy}%</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-blue-600 font-semibold">현재 점수</p>
            <p className="text-3xl font-bold text-blue-800">{score} / {totalQuestions}</p>
          </div>
          <div className="mt-4 space-x-2">
            <button
              onClick={hideStatistics}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              계속하기
            </button>
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              새로 시작
            </button>
          </div>
        </div>
      )}

      {/* 문제 표시 */}
      {!showStats && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              문제 #{totalQuestions + 1}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              이 {lessonType === 'notes' ? '음표' : '쉼표'}의 이름과 박자를 모두 맞추세요!
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <span>정답: {score}</span>
              <span>정답률: {accuracy}%</span>
              <button
                onClick={showStatistics}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                통계 보기
              </button>
            </div>
          </div>

          {/* 음표/쉼표 표시 */}
          <div className="flex flex-col items-center mb-8">
            <div 
              ref={containerRef}
              className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-4 w-full overflow-hidden flex items-center justify-center"
              style={{ minHeight: '250px' }}
            />
          </div>

          {/* 피드백 표시 */}
          {showFeedback && (
            <div className={`text-center mb-6 p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className="text-2xl mb-2">
                {isCorrect ? '🎉 정답입니다!' : '❌ 틀렸습니다!'}
              </div>
              <p className="text-lg">
                {isCorrect 
                  ? `정답: ${currentQuestionData.name} (${currentQuestionData.description})`
                  : `정답: ${currentQuestionData.name} (${currentQuestionData.description})`
                }
              </p>
              {!isCorrect && (
                <div className="mt-2 text-sm">
                  <p>선택한 이름: {selectedName || '선택 안함'}</p>
                  <p>선택한 박자: {selectedDuration ? durations.find(d => d.value === selectedDuration)?.label : '선택 안함'}</p>
                </div>
              )}
            </div>
          )}

          {/* 답안 선택 */}
          {!showFeedback && (
            <>
              {/* 이름 선택 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                  이름을 선택하세요
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {getRandomNames().map((name, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedName(name)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        selectedName === name
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 박자 선택 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                  박자를 선택하세요
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {getRandomDurations().map((duration, index) => {
                    const durationLabel = durations.find(d => d.value === duration)?.label;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDuration(duration)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                          selectedDuration === duration
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {durationLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 정답 확인 버튼 */}
              <div className="text-center">
                <button
                  onClick={handleAnswer}
                  disabled={!canSubmit}
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    canSubmit
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  정답 확인
                </button>
              </div>
            </>
          )}

          {/* 진행 상황 */}
          <div className="text-center mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalQuestions % 10) * 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              현재 세션: {Math.floor(totalQuestions / 10) + 1} (10문제마다 세션 변경)
            </p>
          </div>
        </>
      )}
    </div>
  );
}
