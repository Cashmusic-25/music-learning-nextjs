'use client';

import { useEffect, useRef, useState } from 'react';

interface VexFlowNoteLearningProps {
  lessonType: 'notes' | 'rests';
  noteIndex: number;
  duration: string;
}

export default function VexFlowNoteLearning({ lessonType, noteIndex, duration }: VexFlowNoteLearningProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [abcjsLoaded, setAbcjsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadAbcjs = async () => {
      try {
        // ABC.js 동적 로드
        const ABCJS = await import('abcjs');
        setAbcjsLoaded(true);

        // 기존 내용 제거
        containerRef.current!.innerHTML = '';

        // 모바일 반응형을 위한 크기 조정 - 더 안정적인 방법
        const getDeviceType = () => {
          if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
          }
          return false;
        };
        
        const isMobile = getDeviceType();
        const width = isMobile ? 400 : 600;
        const height = isMobile ? 200 : 250;

        // 음표/쉼표에 따른 ABC 표기법 생성
        let abcNotation = '';
        
        if (lessonType === 'notes') {
          // 음표 모드
          if (duration === '4') {
            // 4분음표 4개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nCCCC|';
          } else if (duration === '2') {
            // 2분음표 2개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/2\nK:C\nCC|';
          } else if (duration === '1') {
            // 온음표 1개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/1\nK:C\nC|';
          }
        } else {
          // 쉼표 모드
          if (duration === '4') {
            // 4분쉼표 4개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/4\nK:C\nzzzz|';
          } else if (duration === '2') {
            // 2분쉼표 2개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/2\nK:C\nzz|';
          } else if (duration === '1') {
            // 온쉼표 1개 - 한 마디 완성
            abcNotation = 'X:1\nM:4/4\nL:1/1\nK:C\nz|';
          }
        }

        // ABC.js로 음악 렌더링 - 네모칸에 맞춰서 크기 조절 및 중앙 정렬
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
          containerRef.current.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">음표 로딩 중...</div>';
        }
      }
    };

    loadAbcjs();
    
    // 화면 크기 변경 감지
    const handleResize = () => {
      if (containerRef.current) {
        loadAbcjs();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [lessonType, noteIndex, duration]);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg bg-white shadow-md mb-4 w-full overflow-hidden flex items-center justify-center"
        style={{ minHeight: '250px' }}
      />
      
      {/* 추가 설명 */}
      <div className="text-center text-gray-600">
        <p className="text-sm">
          {lessonType === 'notes' 
            ? '위의 음표를 보면서 박자와 길이를 기억해보세요!'
            : '위의 쉼표를 보면서 휴식 시간을 기억해보세요!'
          }
        </p>
      </div>
    </div>
  );
}
