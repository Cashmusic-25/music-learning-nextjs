'use client';

import { useEffect, useRef, useState } from 'react';

interface Note {
  x: number;
  y: number;
}

interface VexFlowDrawingStaffProps {
  targetNote: string;
  targetY: number;
  drawnNote: Note | null;
  onNoteDrawn: (note: Note) => void;
  answered: boolean;
}

export default function VexFlowDrawingStaff({ 
  targetNote, 
  targetY, 
  drawnNote, 
  onNoteDrawn, 
  answered 
}: VexFlowDrawingStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const yToVexNote = (y: number): string => {
    // 오선지의 정확한 위치에 맞는 음표 매핑 (높은 도부터 낮은 도까지만)
    const staffTop = 100;
    const lineSpacing = 20;
    
    const noteMapping = [
      { y: staffTop - 0.5 * lineSpacing, note: 'c/5' },      // C5 (높은 도)
      { y: staffTop, note: 'b/4' },                          // B4 (시)
      { y: staffTop + 0.5 * lineSpacing, note: 'a/4' },      // A4 (라)
      { y: staffTop + lineSpacing, note: 'g/4' },            // G4 (솔)
      { y: staffTop + 1.5 * lineSpacing, note: 'f/4' },      // F4 (파)
      { y: staffTop + 2 * lineSpacing, note: 'e/4' },        // E4 (미)
      { y: staffTop + 2.5 * lineSpacing, note: 'd/4' },      // D4 (레)
      { y: staffTop + 3 * lineSpacing, note: 'c/4' },        // C4 (낮은 도)
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

  const handleStaffClick = (e: React.MouseEvent) => {
    if (answered) return;
    
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // console.log('Click - X:', x, 'Y:', y);
    
    // 오선지 영역 내에서만 음표 그리기 (높은 도부터 낮은 도까지만)
    const minX = isMobile ? 60 : 100;
    const maxX = isMobile ? 220 : 700;
    const minY = 70;  // 높은 도 위치
    const maxY = 160; // 낮은 도 위치 (시보다 위로 제한)
    
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      onNoteDrawn({ x, y });
    }
  };



  useEffect(() => {
    if (!containerRef.current) return;

    // 터치 이벤트를 위한 직접 이벤트 리스너 추가
    const container = containerRef.current;
    
    const handleTouchStartDirect = (e: TouchEvent) => {
      e.preventDefault(); // 이제 preventDefault가 가능합니다
      
      if (answered) return;
      
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // console.log('Touch - X:', x, 'Y:', y);
      
      // 오선지 영역 내에서만 음표 그리기 (높은 도부터 낮은 도까지만)
      const minX = isMobile ? 60 : 100;
      const maxX = isMobile ? 220 : 700;
      const minY = 70;  // 높은 도 위치
      const maxY = 160; // 낮은 도 위치 (시보다 위로 제한)
      
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        onNoteDrawn({ x, y });
      }
    };

    container.addEventListener('touchstart', handleTouchStartDirect, { passive: false });

    // VexFlow 동적 로드
    const loadVexFlow = async () => {
      try {
        const { VexFlow } = await import('vexflow');
        setVexFlowLoaded(true);

        // 기존 내용 제거
        containerRef.current!.innerHTML = '';

        // VexFlow 5.x 방식으로 렌더러 생성
        const renderer = new VexFlow.Renderer(containerRef.current!, VexFlow.Renderer.Backends.SVG);
        const width = isMobile ? 300 : 800;
        const height = isMobile ? 180 : 280;
        renderer.resize(width, height);
        const context = renderer.getContext();

        // 오선 생성
        const staveWidth = isMobile ? 200 : 700;
        const staveX = isMobile ? 20 : 50;
        const staveY = isMobile ? 70 : 100;
        
        const stave = new VexFlow.Stave(staveX, staveY, staveWidth);
        stave.addClef('treble');
        stave.setContext(context).draw();

        // 그려진 음표가 있으면 표시 (사용자가 그린 음표)
        if (drawnNote) {
          const noteName = yToVexNote(drawnNote.y);
          const noteObj = new VexFlow.StaveNote({ 
            clef: 'treble', 
            keys: [noteName], 
            duration: '4'
          });

          // B4(포함) 이상의 음은 꼬리 아래, 미만은 위로 설정
          const [pitch, octaveStr] = noteName.split('/');
          const octave = parseInt(octaveStr, 10);
          
          let stemDir = 1; // 기본값: 위
          
          if (octave > 4) {
            stemDir = -1; // 5옥타브 이상은 아래
          } else if (octave === 4) {
            if (pitch.toLowerCase() === 'b') {
              stemDir = -1; // B4만 아래
            }
          }

          noteObj.setStemDirection(stemDir);
          noteObj.setStave(stave);



          // Voice 생성 및 음표 추가
          const voice = new VexFlow.Voice({ numBeats: 1, beatValue: 4 });
          voice.addTickables([noteObj]);

          // Formatter로 음표 배치
          const formatter = new VexFlow.Formatter();
          formatter.joinVoices([voice]);
          formatter.format([voice], isMobile ? 150 : 200);
          
          // 음표 그리기
          voice.draw(context, stave);
        }

        // 정답 표시 (answered가 true일 때만)
        if (answered) {
          // 정답 음표를 녹색으로 표시 (더 굵게)
          const correctNoteName = yToVexNote(targetY);
          const correctNoteObj = new VexFlow.StaveNote({ 
            clef: 'treble', 
            keys: [correctNoteName], 
            duration: '4'
          });

          // B4(포함) 이상의 음은 꼬리 아래, 미만은 위로 설정
          const [pitch, octaveStr] = correctNoteName.split('/');
          const octave = parseInt(octaveStr, 10);
          
          let stemDir = 1; // 기본값: 위
          
          if (octave > 4) {
            stemDir = -1; // 5옥타브 이상은 아래
          } else if (octave === 4) {
            if (pitch.toLowerCase() === 'b') {
              stemDir = -1; // B4만 아래
            }
          }

          correctNoteObj.setStemDirection(stemDir);
          correctNoteObj.setStave(stave);

          // 정답 음표를 진한 녹색으로 설정
          correctNoteObj.setStyle({ 
            fillStyle: '#059669', 
            strokeStyle: '#059669'
          });

          // 새로운 Voice 생성 및 정답 음표 추가
          const correctVoice = new VexFlow.Voice({ numBeats: 1, beatValue: 4 });
          correctVoice.addTickables([correctNoteObj]);

          // Formatter로 정답 음표 배치
          const correctFormatter = new VexFlow.Formatter();
          correctFormatter.joinVoices([correctVoice]);
          correctFormatter.format([correctVoice], isMobile ? 150 : 200);
          
          // 정답 음표 그리기
          correctVoice.draw(context, stave);
        }

      } catch (error) {
        console.error('VexFlow 오류:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">음표 로딩 중...</div>';
        }
      }
    };

    loadVexFlow();

    // Cleanup 함수
    return () => {
      container.removeEventListener('touchstart', handleTouchStartDirect);
    };
  }, [drawnNote, answered, targetNote, isMobile, onNoteDrawn]);

  return (
    <div className="flex flex-col items-center mb-4 md:mb-8 p-3 md:p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <div 
          ref={containerRef}
          className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-3 md:mb-4 w-full overflow-hidden cursor-crosshair"
          style={{ minHeight: isMobile ? '200px' : '280px' }}
          onClick={handleStaffClick}
        />
      <p className="text-xs md:text-sm text-gray-600 text-center">
        💡 오선지 위를 클릭하여 음표를 그려보세요!
      </p>
    </div>
  );
} 