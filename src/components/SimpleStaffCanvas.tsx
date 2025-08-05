'use client';



interface Note {
  x: number;
  y: number;
}

interface Problem {
  leftNote: Note;
  rightNote: Note;
  correctAnswer: 'left' | 'right';
}

interface SimpleStaffCanvasProps {
  currentProblem: Problem | null;
  answered?: boolean;
}

export default function SimpleStaffCanvas({ currentProblem, answered = false }: SimpleStaffCanvasProps) {
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

  const renderNote = (x: number, y: number) => {
    const noteSize = 8;
    const stemHeight = 45;
    const stemWidth = 2;
    
    // 음표가 중간 C (가운데 선) 위에 있는지 확인
    const middleC = 100 + 2 * 20; // staffTop + 2 * lineSpacing
    const isAboveMiddleC = y < middleC;
    
    // 기둥 방향 결정 (중간 C 위면 아래로, 아래면 위로)
    const stemDirection = isAboveMiddleC ? 1 : -1;
    const stemY = y + (stemDirection * stemHeight);
    
    // 음표 머리 (타원형) - 더 자연스러운 모양
    const headWidth = noteSize * 2;
    const headHeight = noteSize * 0.8;
    
    // 기둥 시작점 (음표 머리 오른쪽)
    const stemStartX = x + headWidth / 2;
    const stemEndX = stemStartX + stemWidth;
    
    // 깃발 (8분음표) - 더 자연스러운 곡선
    const flagWidth = 10;
    const flagHeight = 14;
    const flagX = stemEndX;
    const flagY = isAboveMiddleC ? stemY - flagHeight : stemY;
    
    return (
      <g key={`note-${x}-${y}`}>
        {/* 음표 머리 (타원형) - 더 자연스러운 모양 */}
        <ellipse
          cx={x}
          cy={y}
          rx={headWidth / 2}
          ry={headHeight / 2}
          fill={answered ? '#10b981' : '#3b82f6'}
          stroke="#000000"
          strokeWidth="1"
        />
        
        {/* 기둥 - 더 정확한 위치 */}
        <rect
          x={stemStartX}
          y={isAboveMiddleC ? y : stemY}
          width={stemWidth}
          height={Math.abs(stemY - y)}
          fill="#000000"
        />
        
        {/* 깃발 (8분음표) - 더 자연스러운 곡선 */}
        <path
          d={`M ${flagX} ${flagY} 
              C ${flagX + flagWidth * 0.7} ${flagY + flagHeight * 0.3} 
                ${flagX + flagWidth * 0.5} ${flagY + flagHeight * 0.7} 
                ${flagX} ${flagY + flagHeight}
              C ${flagX - flagWidth * 0.3} ${flagY + flagHeight * 0.7} 
                ${flagX - flagWidth * 0.1} ${flagY + flagHeight * 0.3} 
                ${flagX} ${flagY}`}
          fill="#000000"
        />
        
        {/* 음표 이름 */}
        <text
          x={x}
          y={y + 25}
          textAnchor="middle"
          fill="#374151"
          fontSize="12"
          fontWeight="bold"
          fontFamily="Arial"
        >
          {getNoteName(y)}
        </text>
      </g>
    );
  };

  if (!currentProblem) return null;

  const staffTop = 100;
  const lineSpacing = 20;
  const staffWidth = 700;
  const staffLeft = 50;
  const leftNoteX = staffLeft + 150;
  const rightNoteX = staffLeft + 550;
  const leftNoteY = currentProblem.leftNote.y;
  const rightNoteY = currentProblem.rightNote.y;
  const isLeftHigher = leftNoteY < rightNoteY;

  return (
    <div className="flex justify-center mb-8 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
      <svg 
        width={800}
        height={250}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md"
        viewBox="0 0 800 250"
      >
        {/* 배경 */}
        <rect width="800" height="250" fill="#ffffff" />
        
        {/* 오선 그리기 */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`staff-line-${i}`}
            x1={staffLeft}
            y1={staffTop + i * lineSpacing}
            x2={staffLeft + staffWidth}
            y2={staffTop + i * lineSpacing}
            stroke="#000000"
            strokeWidth="2"
          />
        ))}
        
        {/* 음표 렌더링 */}
        {renderNote(leftNoteX, leftNoteY)}
        {renderNote(rightNoteX, rightNoteY)}
        
        {/* 높이 비교 화살표 */}
        <g>
          <line
            x1={leftNoteX + 35}
            y1={(leftNoteY + rightNoteY) / 2}
            x2={rightNoteX - 35}
            y2={(leftNoteY + rightNoteY) / 2}
            stroke={answered ? '#10b981' : '#ff6b6b'}
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          
          {/* 화살표 머리 정의 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill={answered ? '#10b981' : '#ff6b6b'}
              />
            </marker>
          </defs>
        </g>
        
        {/* 높이 비교 텍스트 */}
        {answered && (
          <text
            x="400"
            y="220"
            textAnchor="middle"
            fill="#10b981"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial"
          >
            {`${getNoteName(leftNoteY)} ${isLeftHigher ? '>' : '<'} ${getNoteName(rightNoteY)}`}
          </text>
        )}
        
        {/* 높이 표시선 (점선) */}
        <g stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5">
          <line
            x1={staffLeft}
            y1={leftNoteY}
            x2={leftNoteX - 20}
            y2={leftNoteY}
          />
          <line
            x1={rightNoteX + 20}
            y1={rightNoteY}
            x2={staffLeft + staffWidth}
            y2={rightNoteY}
          />
        </g>
      </svg>
    </div>
  );
} 