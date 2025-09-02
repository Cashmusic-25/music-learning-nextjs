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
  isMobile?: boolean;
  clef?: 'treble' | 'bass';
  showDrawAreaBox?: boolean;
}

export default function VexFlowDrawingStaff({ 
  targetNote, 
  targetY, 
  drawnNote, 
  onNoteDrawn, 
  answered,
  isMobile: propIsMobile,
  clef = 'treble',
  showDrawAreaBox = false
}: VexFlowDrawingStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [staffFirstLineY, setStaffFirstLineY] = useState<number>(180);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(propIsMobile !== undefined ? propIsMobile : mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [propIsMobile]);

  const yToVexNote = (y: number): string => {
    // VexFlow는 오선지의 첫 번째 선(가장 아래 선)을 기준으로 음표를 배치
    // 오선지의 첫 번째 선 위치를 기준으로 계산
    const staffFirstLine = staffFirstLineY;  // 실제 렌더된 오선 기준
    const lineSpacing = 20;
    
    const noteMappingTreble = [
      { y: staffFirstLine - 2.5 * lineSpacing, note: 'c/5' },
      { y: staffFirstLine - 2 * lineSpacing, note: 'b/4' },
      { y: staffFirstLine - 1.5 * lineSpacing, note: 'a/4' },
      { y: staffFirstLine - lineSpacing, note: 'g/4' },
      { y: staffFirstLine - 0.5 * lineSpacing, note: 'f/4' },
      { y: staffFirstLine, note: 'e/4' },
      { y: staffFirstLine + 0.5 * lineSpacing, note: 'd/4' },
      { y: staffFirstLine + lineSpacing, note: 'c/4' },
    ];

    // 낮은음자리표: 범위 C3~C4, 첫 번째 선은 G2
    const noteMappingBass = [
      { y: staffFirstLine - 5 * lineSpacing, note: 'c/4' },
      { y: staffFirstLine - 4.5 * lineSpacing, note: 'b/3' },
      { y: staffFirstLine - 4 * lineSpacing, note: 'a/3' },
      { y: staffFirstLine - 3.5 * lineSpacing, note: 'g/3' },
      { y: staffFirstLine - 3 * lineSpacing, note: 'f/3' },
      { y: staffFirstLine - 2.5 * lineSpacing, note: 'e/3' },
      { y: staffFirstLine - 2 * lineSpacing, note: 'd/3' },
      { y: staffFirstLine - 1.5 * lineSpacing, note: 'c/3' },
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

  const handleStaffClick = (e: React.MouseEvent) => {
    if (answered) return;
    
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // console.log('Click - X:', x, 'Y:', y);
    
    // 오선지 영역 내에서만 음표 그리기 (높은 도부터 낮은 도까지만)
    const minX = isMobile ? 60 : 100;
    const maxX = isMobile ? 220 : 700;
    const staffFirstLine = staffFirstLineY;  // 실제 렌더된 오선 기준
    const lineSpacing = 20;
    const minY = clef === 'bass' ? (staffFirstLine - 5 * lineSpacing) : (staffFirstLine - 2.5 * lineSpacing);
    const maxY = clef === 'bass' ? (staffFirstLine + 0.5 * lineSpacing) : (staffFirstLine + 1 * lineSpacing);
    
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
      const staffFirstLine = staffFirstLineY;  // 실제 렌더된 오선 기준
      const lineSpacing = 20;
      const minY = clef === 'bass' ? (staffFirstLine - 5 * lineSpacing) : (staffFirstLine - 2.5 * lineSpacing);
      const maxY = clef === 'bass' ? (staffFirstLine + 0.5 * lineSpacing) : (staffFirstLine + 1 * lineSpacing);
      
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
        stave.addClef(clef);
        stave.setContext(context).draw();

        // 실제 렌더된 오선의 첫 번째 선(아래 선) 위치 계산 및 저장
        const lineSpacing = 20;
        setStaffFirstLineY(staveY + 4 * lineSpacing);

        // 그려진 음표가 있으면 표시 (사용자가 그린 음표)
        if (drawnNote) {
          const noteName = yToVexNote(drawnNote.y);
          const noteObj = new VexFlow.StaveNote({ 
            clef: clef, 
            keys: [noteName], 
            duration: '4'
          });

          // 중앙선 기준: 위는 아래꼬리, 아래는 위꼬리
          const middleLineY = (isMobile ? 150 : 180) - 2 * 20;
          const stemDir = drawnNote.y <= middleLineY ? -1 : 1;

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
            clef: clef, 
            keys: [correctNoteName], 
            duration: '4'
          });

          const middleLineY = (isMobile ? 150 : 180) - 2 * 20;
          const stemDir = targetY <= middleLineY ? -1 : 1;

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
      <div className="relative w-full">
        <div 
          ref={containerRef}
          className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-3 md:mb-4 w-full overflow-hidden cursor-crosshair"
          style={{ minHeight: isMobile ? '200px' : '280px' }}
          onClick={handleStaffClick}
        />
        {showDrawAreaBox && (
          <div
            className="pointer-events-none absolute border-2 border-dashed border-red-500"
            style={{
              left: (isMobile ? 60 : 100),
              width: (isMobile ? 160 : 600),
              top: staffFirstLineY - (clef === 'bass' ? 5 * 20 : 2.5 * 20),
              height: (clef === 'bass' ? (5.5 * 20) : (3.5 * 20))
            }}
          />
        )}

      </div>
      
      <p className="text-xs md:text-sm text-gray-600 text-center">
        💡 오선지 위를 클릭하여 음표를 그려보세요!
      </p>
    </div>
  );
} 