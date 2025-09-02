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
  correctNoteName?: string; // 정답 정보 추가
  disableAudio?: boolean; // 오디오 기능 비활성화
  clef?: 'treble' | 'bass';
}

export default function VexFlowStaff({ currentProblem, answered = false, singleNote = false, correctNoteName, disableAudio = false, clef = 'treble' }: VexFlowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [renderTick, setRenderTick] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const rafIdRef2 = useRef<number | null>(null);

  // Web Audio API 초기화
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // AudioContext가 suspended 상태라면 resume
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
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

  // 피아노 소리 재생
  const playNote = (noteName: string) => {
    // AudioContext 상태를 직접 확인
    if (!audioContextRef.current || audioContextRef.current.state !== 'running') {
      // console.log('Audio not ready');
      return;
    }
    
    try {
      if (!audioContextRef.current) {
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
    }
  };

  // 음표 클릭 이벤트 핸들러
  const handleNoteClick = (noteName: string) => {
    // console.log('handleNoteClick called with:', noteName);
    playNote(noteName);
  };

  // 오디오 활성화
  const enableAudio = async () => {
    try {
      initAudio();
      if (audioContextRef.current) {
        await audioContextRef.current.resume();
        setAudioEnabled(true);
      }
    } catch (error) {
      console.error('Failed to enable audio:', error);
    }
  };

  const getNoteName = (y: number): string => {
    // 오선지의 정확한 위치에 맞는 음표 매핑 (확장된 범위)
    const staffTop = 100;
    const lineSpacing = 20;
    
    // VexFlow와 동일한 옥타브로 매핑 (yToVexNote와 일치하도록 수정)
    const noteMappingTreble = [
      // 높은 부분: D5~G6
      { y: staffTop - 4 * lineSpacing, note: 'G/6' },
      { y: staffTop - 3.5 * lineSpacing, note: 'F/6' },
      { y: staffTop - 3 * lineSpacing, note: 'E/6' },
      { y: staffTop - 2.5 * lineSpacing, note: 'D/6' },
      { y: staffTop - 2 * lineSpacing, note: 'C/6' },
      { y: staffTop - 1.5 * lineSpacing, note: 'B/5' },
      { y: staffTop - 1 * lineSpacing, note: 'A/5' },
      { y: staffTop - 0.5 * lineSpacing, note: 'G/5' },
      { y: staffTop, note: 'F/5' },
      { y: staffTop + 0.5 * lineSpacing, note: 'E/5' },
      { y: staffTop + lineSpacing, note: 'D/5' },
      { y: staffTop + 1.5 * lineSpacing, note: 'C/5' },
      { y: staffTop + 2 * lineSpacing, note: 'B/4' },
      { y: staffTop + 2.5 * lineSpacing, note: 'A/4' },
      { y: staffTop + 3 * lineSpacing, note: 'G/4' },
      { y: staffTop + 3.5 * lineSpacing, note: 'F/4' },
      { y: staffTop + 4 * lineSpacing, note: 'E/4' },
      { y: staffTop + 4.5 * lineSpacing, note: 'D/4' },
      { y: staffTop + 5 * lineSpacing, note: 'C/4' },
      { y: staffTop + 5.5 * lineSpacing, note: 'B/3' },
      { y: staffTop + 6 * lineSpacing, note: 'A/3' },
      { y: staffTop + 6.5 * lineSpacing, note: 'G/3' },
      { y: staffTop + 7 * lineSpacing, note: 'F/3' },
    ];

    // 낮은음자리표 전용 매핑 (정확한 오선 위치: 상단선 A3, 중앙선 D3)
    const noteMappingBass = [
      // 위로 확장: D4~G4
      { y: staffTop - 3 * lineSpacing, note: 'G/4' },
      { y: staffTop - 2.5 * lineSpacing, note: 'F/4' },
      { y: staffTop - 2 * lineSpacing, note: 'E/4' },
      { y: staffTop - 1.5 * lineSpacing, note: 'D/4' },
      { y: staffTop - 1 * lineSpacing, note: 'C/4' },    // 위로 1개 보조선: C4
      { y: staffTop - 0.5 * lineSpacing, note: 'B/3' },  // 상단선 위 공간: B3
      { y: staffTop, note: 'A/3' },                      // 상단선: A3
      { y: staffTop + 0.5 * lineSpacing, note: 'G/3' },  // 공간: G3
      { y: staffTop + 1 * lineSpacing, note: 'F/3' },    // 4번째 선: F3
      { y: staffTop + 1.5 * lineSpacing, note: 'E/3' },  // 공간: E3
      { y: staffTop + 2 * lineSpacing, note: 'D/3' },    // 중앙선: D3
      { y: staffTop + 2.5 * lineSpacing, note: 'C/3' },  // 공간: C3
      { y: staffTop + 3 * lineSpacing, note: 'B/2' },    // 2번째 선: B2
      { y: staffTop + 3.5 * lineSpacing, note: 'A/2' },  // 공간: A2
      { y: staffTop + 4 * lineSpacing, note: 'G/2' },    // 하단선: G2
      { y: staffTop + 4.5 * lineSpacing, note: 'F/2' },  // 하단선 아래 공간: F2
      { y: staffTop + 5 * lineSpacing, note: 'E/2' },
      { y: staffTop + 5.5 * lineSpacing, note: 'D/2' },
      { y: staffTop + 6 * lineSpacing, note: 'C/2' },
    ];

    const noteMapping = clef === 'bass' ? noteMappingBass : noteMappingTreble;
    
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
    // 오선지의 정확한 위치에 맞는 음표 매핑 (확장된 범위)
    const staffTop = 100;
    const lineSpacing = 20;
    
    // 높은음자리표 매핑
    const noteMappingTreble = [
      { y: staffTop - 4 * lineSpacing, note: 'g/6' },
      { y: staffTop - 3.5 * lineSpacing, note: 'f/6' },
      { y: staffTop - 3 * lineSpacing, note: 'e/6' },
      { y: staffTop - 2.5 * lineSpacing, note: 'd/6' },
      { y: staffTop - 2 * lineSpacing, note: 'c/6' },
      { y: staffTop - 1.5 * lineSpacing, note: 'b/5' },
      { y: staffTop - 1 * lineSpacing, note: 'a/5' },
      { y: staffTop - 0.5 * lineSpacing, note: 'g/5' },
      { y: staffTop, note: 'f/5' },
      { y: staffTop + 0.5 * lineSpacing, note: 'e/5' },
      { y: staffTop + lineSpacing, note: 'd/5' },
      { y: staffTop + 1.5 * lineSpacing, note: 'c/5' },
      { y: staffTop + 2 * lineSpacing, note: 'b/4' },
      { y: staffTop + 2.5 * lineSpacing, note: 'a/4' },
      { y: staffTop + 3 * lineSpacing, note: 'g/4' },
      { y: staffTop + 3.5 * lineSpacing, note: 'f/4' },
      { y: staffTop + 4 * lineSpacing, note: 'e/4' },
      { y: staffTop + 4.5 * lineSpacing, note: 'd/4' },
      { y: staffTop + 5 * lineSpacing, note: 'c/4' },
      { y: staffTop + 5.5 * lineSpacing, note: 'b/3' },
      { y: staffTop + 6 * lineSpacing, note: 'a/3' },
      { y: staffTop + 6.5 * lineSpacing, note: 'g/3' },
      { y: staffTop + 7 * lineSpacing, note: 'f/3' },
    ];

    // 낮은음자리표 매핑 (정확한 오선 위치: 상단선 A3, 중앙선 D3)
    const noteMappingBass = [
      { y: staffTop - 3 * lineSpacing, note: 'g/4' },
      { y: staffTop - 2.5 * lineSpacing, note: 'f/4' },
      { y: staffTop - 2 * lineSpacing, note: 'e/4' },
      { y: staffTop - 1.5 * lineSpacing, note: 'd/4' },
      { y: staffTop - 1 * lineSpacing, note: 'c/4' },
      { y: staffTop - 0.5 * lineSpacing, note: 'b/3' },
      { y: staffTop, note: 'a/3' },
      { y: staffTop + 0.5 * lineSpacing, note: 'g/3' },
      { y: staffTop + 1 * lineSpacing, note: 'f/3' },
      { y: staffTop + 1.5 * lineSpacing, note: 'e/3' },
      { y: staffTop + 2 * lineSpacing, note: 'd/3' },
      { y: staffTop + 2.5 * lineSpacing, note: 'c/3' },
      { y: staffTop + 3 * lineSpacing, note: 'b/2' },
      { y: staffTop + 3.5 * lineSpacing, note: 'a/2' },
      { y: staffTop + 4 * lineSpacing, note: 'g/2' },
      { y: staffTop + 4.5 * lineSpacing, note: 'f/2' },
      { y: staffTop + 5 * lineSpacing, note: 'e/2' },
      { y: staffTop + 5.5 * lineSpacing, note: 'd/2' },
      { y: staffTop + 6 * lineSpacing, note: 'c/2' },
    ];

    const noteMapping = clef === 'bass' ? noteMappingBass : noteMappingTreble;
    
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

        // 컨테이너 실제 너비 기반 반응형 크기 설정 (SVG 축소로 인한 음표 소형화 방지)
        const containerWidth = containerRef.current!.clientWidth || 320;
        const isMobile = containerWidth < 640;
        const width = Math.max(260, Math.min(containerWidth, 520));
        const height = singleNote
          ? Math.max(160, Math.round(width * 0.6))
          : Math.max(180, Math.round(width * 0.5));
        
        // VexFlow 5.x 방식으로 렌더러 생성
        const renderer = new VexFlow.Renderer(containerRef.current!, VexFlow.Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();

        // 오선 생성 - 컨테이너 기반 반응형
        const horizontalPadding = Math.max(16, Math.round(width * 0.06));
        const staveX = horizontalPadding;
        const staveWidth = Math.max(140, width - horizontalPadding * 2);
        const staveY = Math.max(36, Math.round(height * 0.27));
        
        const stave = new VexFlow.Stave(staveX, staveY, staveWidth);
        stave.addClef(clef);
        stave.setContext(context).draw();

        if (singleNote) {
          // 단일 음표 모드
          const singleNote = yToVexNote(currentProblem.leftNote.y);
          const singleNoteObj = new VexFlow.StaveNote({ 
            clef: clef, 
            keys: [singleNote], 
            duration: '4'
          });

          const displayNote = getNoteName(currentProblem.leftNote.y);

          // 표준 규칙: 중앙선(y = staffTop + 2*lineSpacing)을 기준으로
          const getStemDirectionByY = (y: number) => {
            const staffTop = 100;
            const lineSpacing = 20;
            // treble: 중앙선 B4 = staffTop + 2*spacing
            // bass: 중앙선 D3 = staffTop + 2*spacing (동일 위치)
            const middleLineY = staffTop + 2 * lineSpacing;
            return y <= middleLineY ? -1 : 1;
          };

          singleNoteObj.setStemDirection(getStemDirectionByY(currentProblem.leftNote.y));
          singleNoteObj.setStave(stave);

          // Voice 생성 및 음표 추가
          const voice = new VexFlow.Voice({ numBeats: 1, beatValue: 4 });
          voice.addTickables([singleNoteObj]);

          // Formatter로 음표 배치 - 컨테이너 기반 반응형
          const formatter = new VexFlow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], Math.max(120, staveWidth - 80));
          
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
            clef: clef, 
            keys: [leftNote], 
            duration: '4'
          });
          const rightNoteObj = new VexFlow.StaveNote({ 
            clef: clef, 
            keys: [rightNote], 
            duration: '4'
          });

          const leftDisplayNote = getNoteName(currentProblem.leftNote.y);
          const rightDisplayNote = getNoteName(currentProblem.rightNote.y);

          const getStemDirectionByY = (y: number) => {
            const staffTop = 100;
            const lineSpacing = 20;
            const middleLineY = staffTop + 2 * lineSpacing;
            return y <= middleLineY ? -1 : 1;
          };

          leftNoteObj.setStemDirection(getStemDirectionByY(currentProblem.leftNote.y));
          rightNoteObj.setStemDirection(getStemDirectionByY(currentProblem.rightNote.y));

          leftNoteObj.setStave(stave);
          rightNoteObj.setStave(stave);

          const voice = new VexFlow.Voice({ numBeats: 2, beatValue: 4 });
          voice.addTickables([leftNoteObj, rightNoteObj]);

          const formatter = new VexFlow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], Math.max(180, staveWidth - 40));
          
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
          // 렌더 후 SVG 스케일링/정밀도 안정화
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svg.setAttribute('shape-rendering', 'geometricPrecision');
          (svg as SVGElement).style.width = `${width}px`;
          (svg as SVGElement).style.height = `${height}px`;
          (svg as SVGElement).style.maxWidth = '100%';
          if (singleNote) {
            // 단일 음표 모드에서는 음표 이름을 표시하지 않음 (퀴즈이므로)
            const displayNote = getNoteName(currentProblem.leftNote.y);
            
            // 정답 표시 (answered가 true일 때만)
            if (answered) {
              const answerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
              answerText.setAttribute('x', isMobile ? '175' : '400');
              answerText.setAttribute('y', isMobile ? '160' : '190');
              answerText.setAttribute('text-anchor', 'middle');
              answerText.setAttribute('fill', '#10b981');
              answerText.setAttribute('font-size', isMobile ? '14' : '16');
              answerText.setAttribute('font-weight', 'bold');
              answerText.setAttribute('font-family', 'Arial');
              // correctNoteName이 제공되면 그것을 사용, 아니면 기존 방식 사용
              const answerToShow = correctNoteName || displayNote;
              answerText.textContent = `정답: ${answerToShow}`;
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
            leftText.setAttribute('y', isMobile ? '140' : '170');
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
            rightText.setAttribute('y', isMobile ? '140' : '170');
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
              compareText.setAttribute('y', isMobile ? '160' : '190');
              compareText.setAttribute('text-anchor', 'middle');
              compareText.setAttribute('fill', '#10b981');
              compareText.setAttribute('font-size', isMobile ? '14' : '16');
              compareText.setAttribute('font-weight', 'bold');
              compareText.setAttribute('font-family', 'Arial');
              compareText.textContent = `${leftNoteName} ${isLeftHigher ? '>' : '<'} ${rightNoteName}`;
              svg.appendChild(compareText);
            }

            
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

    // 레이아웃이 안정된 다음 프레임에 렌더
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef2.current = window.requestAnimationFrame(() => {
        void loadVexFlow();
      });
    });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (rafIdRef2.current) cancelAnimationFrame(rafIdRef2.current);
    };
  }, [currentProblem, answered, renderTick]);

  // 레이아웃 변화(리사이즈/컨테이너 크기 변경)에 대응하여 재렌더링
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => setRenderTick((v) => v + 1);
    window.addEventListener('resize', handleResize);
    const ResizeObserverCtor = (window as any).ResizeObserver;
    const ro = ResizeObserverCtor ? new ResizeObserverCtor(() => handleResize()) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, []);

  if (!currentProblem) return null;

  return (
    <div className="flex flex-col items-center mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      {!disableAudio && !audioEnabled && (
        <button
          onClick={enableAudio}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔊 오디오 활성화 (클릭하여 소리 재생 가능)
        </button>
      )}
      {!disableAudio && audioEnabled && (
        <button
          onClick={() => playNote('A/4')}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          🎵 테스트 소리 재생 (A4)
        </button>
      )}
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-4 w-full overflow-hidden"
        style={{ minHeight: '220px' }}
      />
      {!disableAudio && (
        <p className="text-sm text-gray-600 text-center">
          {audioEnabled 
            ? "💡 음표를 클릭하면 피아노 소리를 들을 수 있습니다!"
            : "🔇 먼저 오디오를 활성화해주세요!"
          }
        </p>
      )}
    </div>
  );
} 