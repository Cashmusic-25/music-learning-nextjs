'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Factory } from 'vexflow';

interface Note {
  x: number;
  y: number;
}

interface Problem {
  leftNote: Note;
  rightNote: Note;
  correctAnswer: 'left' | 'right';
}

interface StaffCanvasProps {
  currentProblem: Problem | null;
  answered?: boolean;
}

export default function StaffCanvas({ currentProblem, answered = false }: StaffCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getNoteName = (y: number): string => {
    // 오선지 기준으로 음표 이름 계산
    const staffTop = 100;
    const lineSpacing = 20;
    const gLineY = staffTop + lineSpacing; // G선 (두 번째 선)
    
    // Y 좌표를 음표 이름으로 변환
    const steps = Math.round((gLineY - y) / (lineSpacing / 2));
    
    const noteNames = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    const octaves = [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2];
    
    const index = Math.max(0, Math.min(noteNames.length - 1, steps + 7));
    return `${noteNames[index]}/${octaves[index]}`;
  };

  const drawStaff = useCallback(() => {
    if (!canvasRef.current || !currentProblem) return;

    // 기존 내용 삭제
    canvasRef.current.innerHTML = '';

    try {
      // VexFlow Factory 생성
      const factory = new Factory({
        renderer: { 
          elementId: canvasRef.current as unknown as string, 
          width: 800, 
          height: 250 
        }
      });

      const score = factory.EasyScore();
      const system = factory.System();

      // 왼쪽 음표
      const leftNoteName = getNoteName(currentProblem.leftNote.y);
      const rightNoteName = getNoteName(currentProblem.rightNote.y);

      // 첫 번째 마디 (왼쪽 음표)
      system.addStave({
        voices: [
          score.voice([
            score.notes(leftNoteName + '/q', { clef: 'treble' }) as any
          ])
        ]
      }).addClef('treble');

      // 두 번째 마디 (오른쪽 음표)
      system.addStave({
        voices: [
          score.voice([
            score.notes(rightNoteName + '/q') as any
          ])
        ]
      });

      // 렌더링
      factory.draw();

      // 높이 비교 화살표 그리기
      const renderer = factory.getContext();
      const leftStave = system.getStaves()[0];
      const rightStave = system.getStaves()[1];
      
      const leftX = leftStave.getX() + leftStave.getWidth();
      const rightX = rightStave.getX();
      const arrowY = leftStave.getY() + leftStave.getHeight() / 2;

      // 화살표 그리기 (더 굵고 명확하게)
      renderer.beginPath();
      renderer.moveTo(leftX + 15, arrowY);
      renderer.lineTo(rightX - 15, arrowY);
      renderer.setStrokeStyle(answered ? '#10b981' : '#ff6b6b');
      renderer.setLineWidth(4);
      renderer.stroke();

      // 화살표 머리
      renderer.beginPath();
      renderer.moveTo(rightX - 15, arrowY);
      renderer.lineTo(rightX - 25, arrowY - 8);
      renderer.lineTo(rightX - 25, arrowY + 8);
      renderer.setFillStyle(answered ? '#10b981' : '#ff6b6b');
      renderer.fill();

      // 음표 이름 표시 (HTML 요소로 추가)
      const leftNoteY = leftStave.getY() + 60;
      const rightNoteY = rightStave.getY() + 60;
      
      const leftNoteLabel = document.createElement('div');
      leftNoteLabel.textContent = leftNoteName;
      leftNoteLabel.style.position = 'absolute';
      leftNoteLabel.style.left = `${leftStave.getX() + 20}px`;
      leftNoteLabel.style.top = `${leftNoteY}px`;
      leftNoteLabel.style.fontSize = '14px';
      leftNoteLabel.style.fontWeight = 'bold';
      leftNoteLabel.style.color = '#374151';
      canvasRef.current.appendChild(leftNoteLabel);

      const rightNoteLabel = document.createElement('div');
      rightNoteLabel.textContent = rightNoteName;
      rightNoteLabel.style.position = 'absolute';
      rightNoteLabel.style.left = `${rightStave.getX() + 20}px`;
      rightNoteLabel.style.top = `${rightNoteY}px`;
      rightNoteLabel.style.fontSize = '14px';
      rightNoteLabel.style.fontWeight = 'bold';
      rightNoteLabel.style.color = '#374151';
      canvasRef.current.appendChild(rightNoteLabel);

      // 높이 비교 텍스트
      if (answered) {
        const isLeftHigher = currentProblem.leftNote.y < currentProblem.rightNote.y;
        const higherNote = isLeftHigher ? leftNoteName : rightNoteName;
        const lowerNote = isLeftHigher ? rightNoteName : leftNoteName;
        
        const comparisonLabel = document.createElement('div');
        comparisonLabel.textContent = `${higherNote} > ${lowerNote}`;
        comparisonLabel.style.position = 'absolute';
        comparisonLabel.style.left = '300px';
        comparisonLabel.style.top = '220px';
        comparisonLabel.style.fontSize = '16px';
        comparisonLabel.style.fontWeight = 'bold';
        comparisonLabel.style.color = '#10b981';
        canvasRef.current.appendChild(comparisonLabel);
      }

    } catch (error) {
      console.error('VexFlow 렌더링 오류:', error);
      
      // 오류 발생 시 간단한 대체 UI 표시
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <h3>악보 로딩 중...</h3>
          <p>왼쪽 음표: ${getNoteName(currentProblem.leftNote.y)}</p>
          <p>오른쪽 음표: ${getNoteName(currentProblem.rightNote.y)}</p>
        </div>
      `;
      canvasRef.current.appendChild(errorDiv);
    }
  }, [currentProblem, answered]);

  useEffect(() => {
    drawStaff();
  }, [currentProblem, answered, drawStaff]);

  return (
    <div className="flex justify-center mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      <div 
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md relative"
        style={{ width: '800px', height: '250px' }}
      />
    </div>
  );
} 