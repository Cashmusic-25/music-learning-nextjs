'use client';

import { useEffect, useRef, useState } from 'react';

interface Note {
  x: number;
  y: number;
}

interface Problem {
  leftNote: Note;
  rightNote: Note;
  correctAnswer: 'left' | 'right';
}

interface VexFlowStaffProps {
  currentProblem: Problem | null;
  answered?: boolean;
  singleNote?: boolean;
}

export default function VexFlowStaff({ currentProblem, answered = false, singleNote = false }: VexFlowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [useHTML5Audio, setUseHTML5Audio] = useState(false);

  // Web Audio API 초기화 (iOS 호환성 개선)
  const initAudio = () => {
    try {
      if (!audioContextRef.current) {
        // iOS Safari 호환성을 위한 webkitAudioContext 사용
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // iOS에서 AudioContext가 자동으로 suspended 상태가 될 수 있음
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        
        // iOS에서 AudioContext를 활성화하기 위한 더미 오실레이터 생성
        const dummyOscillator = audioContextRef.current.createOscillator();
        const dummyGain = audioContextRef.current.createGain();
        dummyGain.gain.setValueAtTime(0, audioContextRef.current.currentTime); // 무음으로 설정
        dummyOscillator.connect(dummyGain);
        dummyGain.connect(audioContextRef.current.destination);
        dummyOscillator.start();
        dummyOscillator.stop(audioContextRef.current.currentTime + 0.001);
      }
    } catch (error) {
      console.error('AudioContext 초기화 실패:', error);
    }
  };

  // 음표 이름을 주파수로 변환
  const noteToFrequency = (noteName: string): number => {
    const noteMap: { [key: string]: number } = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63, 'F': 349.23,
      'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    
    const [note, octave] = noteName.split('/');
    const baseFreq = noteMap[note] || 440;
    const octaveMultiplier = Math.pow(2, parseInt(octave) - 3); // 3옥타브를 기준으로 수정
    return baseFreq * octaveMultiplier;
  };

  // 피아노 소리 재생 (iOS 호환성 개선)
  const playNote = async (noteName: string) => {
    try {
      // HTML5 Audio를 사용하는 경우
      if (useHTML5Audio) {
        try {
          // 간단한 비프음 생성 (iOS에서 확실히 작동)
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          
          return;
        } catch (e) {
          console.error('HTML5 Audio 재생 실패:', e);
        }
      }
      
      // AudioContext가 없거나 suspended 상태라면 재시도
      if (!audioContextRef.current) {
        initAudio();
        return;
      }
      
      // iOS에서 AudioContext가 suspended 상태가 될 수 있으므로 resume 시도
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // 여전히 running 상태가 아니라면 HTML5 Audio로 전환
      if (audioContextRef.current.state !== 'running') {
        console.log('AudioContext 상태:', audioContextRef.current.state, '- HTML5 Audio로 전환');
        setUseHTML5Audio(true);
        return;
      }
      
      const frequency = noteToFrequency(noteName);
      const now = audioContextRef.current.currentTime;
      const duration = 0.8;
      
      // 피아노 소리를 위한 여러 하모닉스 생성
      const harmonics = [
        { freq: frequency, gain: 1.0 },      // 기본 주파수
        { freq: frequency * 2, gain: 0.5 },  // 2배음
        { freq: frequency * 3, gain: 0.25 }, // 3배음
        { freq: frequency * 4, gain: 0.125 }, // 4배음
        { freq: frequency * 5, gain: 0.0625 } // 5배음
      ];
      
      harmonics.forEach((harmonic, index) => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        oscillator.frequency.setValueAtTime(harmonic.freq, now);
        oscillator.type = 'triangle'; // 삼각파로 더 풍부한 소리
        
        // 피아노 같은 ADSR 엔벨로프
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(harmonic.gain * 0.3, now + 0.02); // 빠른 Attack
        gainNode.gain.exponentialRampToValueAtTime(harmonic.gain * 0.1, now + 0.1); // Decay
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release
        
        oscillator.start(now);
        oscillator.stop(now + duration);
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      // 에러 발생 시 HTML5 Audio로 전환
      setUseHTML5Audio(true);
    }
  };

  // 음표 클릭 이벤트 핸들러
  const handleNoteClick = async (noteName: string) => {
    // console.log('handleNoteClick called with:', noteName);
    await playNote(noteName);
  };

  // 오디오 활성화 (iOS 호환성 개선)
  const enableAudio = async () => {
    try {
      // iOS에서 즉시 HTML5 Audio로 전환
      setUseHTML5Audio(true);
      setAudioEnabled(true);
      
      // HTML5 Audio 테스트
      try {
        const testAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const testOscillator = testAudioContext.createOscillator();
        const testGain = testAudioContext.createGain();
        
        testOscillator.connect(testGain);
        testGain.connect(testAudioContext.destination);
        
        testOscillator.frequency.setValueAtTime(440, testAudioContext.currentTime);
        testOscillator.type = 'sine';
        testGain.gain.setValueAtTime(0.3, testAudioContext.currentTime);
        
        testOscillator.start(testAudioContext.currentTime);
        testOscillator.stop(testAudioContext.currentTime + 0.3);
        
        console.log('HTML5 Audio 테스트 성공');
      } catch (e) {
        console.error('HTML5 Audio 테스트 실패:', e);
        // HTML5 Audio도 실패하면 Web Audio API 시도
        initAudio();
        if (audioContextRef.current) {
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          
          // 더미 오실레이터로 AudioContext 활성화
          const dummyOsc = audioContextRef.current.createOscillator();
          const dummyGain = audioContextRef.current.createGain();
          dummyGain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
          dummyOsc.connect(dummyGain);
          dummyGain.connect(audioContextRef.current.destination);
          dummyOsc.start();
          dummyOsc.stop(audioContextRef.current.currentTime + 0.001);
          
          setUseHTML5Audio(false);
        }
      }
    } catch (error) {
      console.error('Failed to enable audio:', error);
      alert('오디오 활성화에 실패했습니다. iOS에서는 설정 > Safari > 미디어 자동 재생을 허용으로 설정해주세요.');
    }
  };

  const getNoteName = (y: number): string => {
    // 오선지의 정확한 위치에 맞는 음표 매핑
    const staffTop = 100;
    const lineSpacing = 20;
    
    // VexFlow와 동일한 옥타브로 매핑
    const noteMapping = [
      { y: staffTop - 0.5 * lineSpacing, note: 'C/4' },      // C5 → C4
      { y: staffTop, note: 'B/3' },
      { y: staffTop + 0.5 * lineSpacing, note: 'A/3' },
      { y: staffTop + lineSpacing, note: 'G/3' },
      { y: staffTop + 1.5 * lineSpacing, note: 'F/3' },
      { y: staffTop + 2 * lineSpacing, note: 'E/3' },
      { y: staffTop + 2.5 * lineSpacing, note: 'D/3' },
      { y: staffTop + 3 * lineSpacing, note: 'C/3' },
      { y: staffTop + 3.5 * lineSpacing, note: 'B/2' },
      { y: staffTop + 4 * lineSpacing, note: 'A/2' },
      { y: staffTop + 4.5 * lineSpacing, note: 'G/2' },
      { y: staffTop + 5 * lineSpacing, note: 'F/2' },
      { y: staffTop + 5.5 * lineSpacing, note: 'E/2' },
      { y: staffTop + 6 * lineSpacing, note: 'D/2' },
      { y: staffTop + 6.5 * lineSpacing, note: 'C/2' }
    ];
    
    // 가장 가까운 음표 찾기
    let closestNote = noteMapping[0];
    let minDistance = Math.abs(y - closestNote.y);
    
    for (const note of noteMapping) {
      const distance = Math.abs(y - note.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestNote = note;
      }
    }
    
    return closestNote.note;
  };

  const yToVexNote = (y: number): string => {
    // 오선지의 정확한 위치에 맞는 음표 매핑
    const staffTop = 100;
    const lineSpacing = 20;
    
    // VexFlow 옥타브 조정 (+1씩 높임)
    const noteMapping = [
      { y: staffTop - 0.5 * lineSpacing, note: 'c/5' },      // C5
      { y: staffTop, note: 'b/4' },
      { y: staffTop + 0.5 * lineSpacing, note: 'a/4' },
      { y: staffTop + lineSpacing, note: 'g/4' },
      { y: staffTop + 1.5 * lineSpacing, note: 'f/4' },
      { y: staffTop + 2 * lineSpacing, note: 'e/4' },
      { y: staffTop + 2.5 * lineSpacing, note: 'd/4' },
      { y: staffTop + 3 * lineSpacing, note: 'c/4' },
      { y: staffTop + 3.5 * lineSpacing, note: 'b/3' },
      { y: staffTop + 4 * lineSpacing, note: 'a/3' },
      { y: staffTop + 4.5 * lineSpacing, note: 'g/3' },
      { y: staffTop + 5 * lineSpacing, note: 'f/3' },
      { y: staffTop + 5.5 * lineSpacing, note: 'e/3' },
      { y: staffTop + 6 * lineSpacing, note: 'd/3' },
      { y: staffTop + 6.5 * lineSpacing, note: 'c/3' }
    ];
    
    // 가장 가까운 음표 찾기
    let closestNote = noteMapping[0];
    let minDistance = Math.abs(y - closestNote.y);
    
    for (const note of noteMapping) {
      const distance = Math.abs(y - note.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestNote = note;
      }
    }
    
    return closestNote.note;
  };

  useEffect(() => {
    if (!containerRef.current || !currentProblem) return;

    // VexFlow 동적 로드
    const loadVexFlow = async () => {
      try {
        const { VexFlow } = await import('vexflow');
        setVexFlowLoaded(true);

        // 기존 내용 제거
        containerRef.current!.innerHTML = '';

        // 모바일 반응형을 위한 크기 조정
        const isMobile = window.innerWidth < 768;
        const width = isMobile ? 350 : 800;
        const height = isMobile ? 200 : 280;
        
        // VexFlow 5.x 방식으로 렌더러 생성
        const renderer = new VexFlow.Renderer(containerRef.current!, VexFlow.Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();

        // 오선 생성 - 모바일 반응형
        const staveWidth = isMobile ? 250 : 700;
        const staveX = isMobile ? 25 : 50;
        const staveY = isMobile ? 80 : 100;
        
        const stave = new VexFlow.Stave(staveX, staveY, staveWidth);
        stave.addClef('treble');
        stave.setContext(context).draw();

        if (singleNote) {
          // 단일 음표 모드
          const singleNote = yToVexNote(currentProblem.leftNote.y);
          const singleNoteObj = new VexFlow.StaveNote({ 
            clef: 'treble', 
            keys: [singleNote], 
            duration: '4'
          });

          const displayNote = getNoteName(currentProblem.leftNote.y);
          
          // B4(포함) 이상의 음은 꼬리 아래, 미만은 위로 설정
          const getStemDir = (note: string, displayNote: string) => {
            const [pitch, octaveStr] = note.split('/');
            const octave = parseInt(octaveStr, 10);
            
            let stemDir = 1; // 기본값: 위
            
            if (octave > 4) {
              stemDir = -1; // 5옥타브 이상은 아래
            } else if (octave === 4) {
              if (pitch.toLowerCase() === 'b') {
                stemDir = -1; // B4만 아래
              }
            }
            
            return stemDir;
          };

          singleNoteObj.setStemDirection(getStemDir(singleNote, displayNote));
          singleNoteObj.setStave(stave);

          // Voice 생성 및 음표 추가
          const voice = new VexFlow.Voice({ numBeats: 1, beatValue: 4 });
          voice.addTickables([singleNoteObj]);

          // Formatter로 음표 배치 - 모바일 반응형
          const formatter = new VexFlow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], isMobile ? 150 : 200);
          
          // 음표 그리기
          voice.draw(context, stave);

          // 음표 요소에 클릭 이벤트 추가
          setTimeout(() => {
            const noteheadElements = svg?.querySelectorAll('.vf-notehead');
            
            if (!noteheadElements || noteheadElements.length < 1) {
              return;
            }
            
            noteheadElements.forEach((element) => {
              const allChildren = element.querySelectorAll('*');
              
              (element as SVGElement).style.cursor = 'pointer';
              (element as SVGElement).style.pointerEvents = 'auto';
              element.addEventListener('click', (e) => {
                e.stopPropagation();
                handleNoteClick(displayNote);
              });
              
              allChildren.forEach((child) => {
                (child as SVGElement).style.cursor = 'pointer';
                (child as SVGElement).style.pointerEvents = 'auto';
                child.addEventListener('click', (e) => {
                  e.stopPropagation();
                  handleNoteClick(displayNote);
                });
              });
            });
          }, 500);
        } else {
          // 기존 두 음표 비교 모드
          const leftNote = yToVexNote(currentProblem.leftNote.y);
          const rightNote = yToVexNote(currentProblem.rightNote.y);
          
          const leftNoteObj = new VexFlow.StaveNote({ 
            clef: 'treble', 
            keys: [leftNote], 
            duration: '4'
          });
          const rightNoteObj = new VexFlow.StaveNote({ 
            clef: 'treble', 
            keys: [rightNote], 
            duration: '4'
          });

          const leftDisplayNote = getNoteName(currentProblem.leftNote.y);
          const rightDisplayNote = getNoteName(currentProblem.rightNote.y);
          
          const getStemDir = (note: string, displayNote: string) => {
            const [pitch, octaveStr] = note.split('/');
            const octave = parseInt(octaveStr, 10);
            
            let stemDir = 1;
            
            if (octave > 4) {
              stemDir = -1;
            } else if (octave === 4) {
              if (pitch.toLowerCase() === 'b') {
                stemDir = -1;
              }
            }
            
            return stemDir;
          };

          leftNoteObj.setStemDirection(getStemDir(leftNote, leftDisplayNote));
          rightNoteObj.setStemDirection(getStemDir(rightNote, rightDisplayNote));

          leftNoteObj.setStave(stave);
          rightNoteObj.setStave(stave);

          const voice = new VexFlow.Voice({ numBeats: 2, beatValue: 4 });
          voice.addTickables([leftNoteObj, rightNoteObj]);

          const formatter = new VexFlow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], isMobile ? 200 : 600);
          
          voice.draw(context, stave);

          // 음표 요소에 클릭 이벤트 추가
          setTimeout(() => {
            const noteheadElements = svg?.querySelectorAll('.vf-notehead');
            
            if (!noteheadElements || noteheadElements.length < 2) {
              return;
            }
            
            noteheadElements.forEach((element, index) => {
              const allChildren = element.querySelectorAll('*');
              
              (element as SVGElement).style.cursor = 'pointer';
              (element as SVGElement).style.pointerEvents = 'auto';
              element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index === 0) {
                  handleNoteClick(leftDisplayNote);
                } else {
                  handleNoteClick(rightDisplayNote);
                }
              });
              
              allChildren.forEach((child) => {
                (child as SVGElement).style.cursor = 'pointer';
                (child as SVGElement).style.pointerEvents = 'auto';
                child.addEventListener('click', (e) => {
                  e.stopPropagation();
                  if (index === 0) {
                    handleNoteClick(leftDisplayNote);
                  } else {
                    handleNoteClick(rightDisplayNote);
                  }
                });
              });
            });
          }, 500);
        }

        // 음표 이름 표시
        const svg = containerRef.current!.querySelector('svg');
        if (svg) {
          if (singleNote) {
            // 단일 음표 모드에서는 음표 이름을 표시하지 않음 (퀴즈이므로)
            const displayNote = getNoteName(currentProblem.leftNote.y);
            
            // 정답 표시 (answered가 true일 때만)
            if (answered) {
              const answerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              answerText.setAttribute('x', isMobile ? '175' : '400');
              answerText.setAttribute('y', isMobile ? '180' : '250');
              answerText.setAttribute('text-anchor', 'middle');
              answerText.setAttribute('fill', '#10b981');
              answerText.setAttribute('font-size', isMobile ? '14' : '16');
              answerText.setAttribute('font-weight', 'bold');
              answerText.setAttribute('font-family', 'Arial');
              answerText.textContent = `정답: ${displayNote}`;
              svg.appendChild(answerText);
            }
          } else {
            // 기존 두 음표 비교 모드
            const leftNoteName = getNoteName(currentProblem.leftNote.y);
            const rightNoteName = getNoteName(currentProblem.rightNote.y);
            const isLeftHigher = currentProblem.leftNote.y < currentProblem.rightNote.y;

            // 왼쪽 음표 이름 (클릭 가능)
            const leftText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            leftText.setAttribute('x', isMobile ? '100' : '200');
            leftText.setAttribute('y', isMobile ? '150' : '180');
            leftText.setAttribute('text-anchor', 'middle');
            leftText.setAttribute('fill', '#374151');
            leftText.setAttribute('font-size', isMobile ? '12' : '14');
            leftText.setAttribute('font-weight', 'bold');
            leftText.setAttribute('font-family', 'Arial');
            leftText.setAttribute('cursor', 'pointer');
            leftText.setAttribute('class', 'note-name');
            leftText.textContent = leftNoteName;
            
            svg.appendChild(leftText);

            // 오른쪽 음표 이름 (클릭 가능)
            const rightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            rightText.setAttribute('x', isMobile ? '300' : '600');
            rightText.setAttribute('y', isMobile ? '150' : '180');
            rightText.setAttribute('text-anchor', 'middle');
            rightText.setAttribute('fill', '#374151');
            rightText.setAttribute('font-size', isMobile ? '12' : '14');
            rightText.setAttribute('font-weight', 'bold');
            rightText.setAttribute('font-family', 'Arial');
            rightText.setAttribute('cursor', 'pointer');
            rightText.setAttribute('class', 'note-name');
            rightText.textContent = rightNoteName;
            
            svg.appendChild(rightText);

            // 높이 비교 텍스트
            if (answered) {
              const compareText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              compareText.setAttribute('x', isMobile ? '175' : '400');
              compareText.setAttribute('y', isMobile ? '180' : '250');
              compareText.setAttribute('text-anchor', 'middle');
              compareText.setAttribute('fill', '#10b981');
              compareText.setAttribute('font-size', isMobile ? '14' : '16');
              compareText.setAttribute('font-weight', 'bold');
              compareText.setAttribute('font-family', 'Arial');
              compareText.textContent = `${leftNoteName} ${isLeftHigher ? '>' : '<'} ${rightNoteName}`;
              svg.appendChild(compareText);
            }

            // 높이 표시선 (점선)
            const leftGuideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            leftGuideLine.setAttribute('x1', '50');
            leftGuideLine.setAttribute('y1', '120');
            leftGuideLine.setAttribute('x2', '180');
            leftGuideLine.setAttribute('y2', '120');
            leftGuideLine.setAttribute('stroke', '#e5e7eb');
            leftGuideLine.setAttribute('stroke-width', '1');
            leftGuideLine.setAttribute('stroke-dasharray', '5,5');
            svg.appendChild(leftGuideLine);

            const rightGuideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rightGuideLine.setAttribute('x1', '620');
            rightGuideLine.setAttribute('y1', '120');
            rightGuideLine.setAttribute('x2', '750');
            rightGuideLine.setAttribute('y2', '120');
            rightGuideLine.setAttribute('stroke', '#e5e7eb');
            rightGuideLine.setAttribute('stroke-width', '1');
            rightGuideLine.setAttribute('stroke-dasharray', '5,5');
            svg.appendChild(rightGuideLine);
          }
        }
      } catch (error) {
        console.error('VexFlow 오류:', error);
        // 오류 발생 시 간단한 메시지 표시
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">음표 로딩 중...</div>';
        }
      }
    };

    loadVexFlow();
  }, [currentProblem, answered]);

  if (!currentProblem) return null;

  return (
    <div className="flex flex-col items-center mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      {!audioEnabled && (
        <button
          onClick={enableAudio}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔊 오디오 활성화 (클릭하여 소리 재생 가능)
        </button>
      )}
      {audioEnabled && (
        <div className="mb-4 flex flex-col gap-2">
          <button
            onClick={() => playNote('A/4')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            🎵 테스트 소리 재생 (A4)
          </button>
          {useHTML5Audio && (
            <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              📱 HTML5 Audio 모드 (iOS 호환)
            </div>
          )}
        </div>
      )}
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-4 w-full overflow-hidden"
        style={{ minHeight: '280px' }}
      />
      <p className="text-sm text-gray-600 text-center">
        {audioEnabled 
          ? "💡 음표를 클릭하면 피아노 소리를 들을 수 있습니다!"
          : "🔇 먼저 오디오를 활성화해주세요!"
        }
      </p>
    </div>
  );
} 