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
}

export default function VexFlowStaff({ currentProblem, answered = false }: VexFlowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vexFlowLoaded, setVexFlowLoaded] = useState(false);

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

        // VexFlow 5.x 방식으로 렌더러 생성
        const renderer = new VexFlow.Renderer(containerRef.current!, VexFlow.Renderer.Backends.SVG);
        renderer.resize(800, 250);
        const context = renderer.getContext();

        // 오선 생성
        const stave = new VexFlow.Stave(50, 100, 700);
        stave.addClef('treble');
        stave.setContext(context).draw();

        // 왼쪽 음표와 오른쪽 음표 생성
        const leftNote = yToVexNote(currentProblem.leftNote.y);
        const rightNote = yToVexNote(currentProblem.rightNote.y);
        
        // 음표 객체 생성
        const leftNoteObj = new VexFlow.StaveNote({ clef: 'treble', keys: [leftNote], duration: '4' });
        const rightNoteObj = new VexFlow.StaveNote({ clef: 'treble', keys: [rightNote], duration: '4' });

        // 각 음표의 표시 이름 가져오기
        const leftDisplayNote = getNoteName(currentProblem.leftNote.y);
        const rightDisplayNote = getNoteName(currentProblem.rightNote.y);
        
        // B4(포함) 이상의 음은 꼬리 아래, 미만은 위로 설정
        const getStemDir = (note: string, displayNote: string) => {
          const [pitch, octaveStr] = note.split('/');
          const octave = parseInt(octaveStr, 10);
          
          // B4 이상이면 아래(-1), 아니면 위(1)
          let stemDir = 1; // 기본값: 위
          
          if (octave > 4) {
            stemDir = -1; // 5옥타브 이상은 아래
          } else if (octave === 4) {
            // 4옥타브에서 B4만 아래, 나머지는 위
            if (pitch.toLowerCase() === 'b') {
              stemDir = -1; // B4만 아래
            }
          }
          
          console.log(`Note: ${note}, Display: ${displayNote}, Octave: ${octave}, Pitch: ${pitch}, StemDir: ${stemDir}`);
          return stemDir;
        };

        leftNoteObj.setStemDirection(getStemDir(leftNote, leftDisplayNote));
        rightNoteObj.setStemDirection(getStemDir(rightNote, rightDisplayNote));

        // 음표 위치 설정
        leftNoteObj.setStave(stave);
        rightNoteObj.setStave(stave);

        // Voice 생성 및 음표 추가
        const voice = new VexFlow.Voice({ numBeats: 2, beatValue: 4 });
        voice.addTickables([leftNoteObj, rightNoteObj]);

        // Formatter로 음표 배치
        const formatter = new VexFlow.Formatter();
        formatter.joinVoices([voice]).format([voice], 600);

        // 음표 그리기
        voice.draw(context, stave);

        // 음표 이름 표시
        const leftNoteName = getNoteName(currentProblem.leftNote.y);
        const rightNoteName = getNoteName(currentProblem.rightNote.y);
        const isLeftHigher = currentProblem.leftNote.y < currentProblem.rightNote.y;

        // 음표 이름을 SVG 텍스트로 추가
        const svg = containerRef.current!.querySelector('svg');
        if (svg) {
          // 왼쪽 음표 이름
          const leftText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          leftText.setAttribute('x', '200');
          leftText.setAttribute('y', '180');
          leftText.setAttribute('text-anchor', 'middle');
          leftText.setAttribute('fill', '#374151');
          leftText.setAttribute('font-size', '14');
          leftText.setAttribute('font-weight', 'bold');
          leftText.setAttribute('font-family', 'Arial');
          leftText.textContent = leftNoteName;
          svg.appendChild(leftText);

          // 오른쪽 음표 이름
          const rightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          rightText.setAttribute('x', '600');
          rightText.setAttribute('y', '180');
          rightText.setAttribute('text-anchor', 'middle');
          rightText.setAttribute('fill', '#374151');
          rightText.setAttribute('font-size', '14');
          rightText.setAttribute('font-weight', 'bold');
          rightText.setAttribute('font-family', 'Arial');
          rightText.textContent = rightNoteName;
          svg.appendChild(rightText);

          // 높이 비교 텍스트
          if (answered) {
            const compareText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            compareText.setAttribute('x', '400');
            compareText.setAttribute('y', '220');
            compareText.setAttribute('text-anchor', 'middle');
            compareText.setAttribute('fill', '#10b981');
            compareText.setAttribute('font-size', '16');
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
    <div className="flex justify-center mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md"
      />
    </div>
  );
} 