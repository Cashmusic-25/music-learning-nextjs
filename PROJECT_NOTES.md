# 음악 학습 앱 프로젝트 노트

## 🎵 프로젝트 개요
- **목적**: 음악 학습을 위한 웹 기반 퀴즈 앱
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, VexFlow
- **주요 기능**: 음표 읽기, 음표 맞추기, 음표 그리기 퀴즈

## 🎼 핵심 기능들

### 1. 높은음/낮은음 구분 연습 (`/note-comparison`)
- 두 개의 음표 중 더 높은 음을 선택하는 퀴즈
- VexFlow를 사용한 전문적인 악보 렌더링
- 실시간 피아노 소리 재생 (Web Audio API)
- 정답률 및 연속 정답 기록

### 2. 음표 맞추기 퀴즈 (`/note-quiz`)
- 오선지에 표시된 음표의 이름을 맞추는 퀴즈
- 도레미파솔라시도(Do Re Mi Fa Sol La Si Do) 음계 사용
- 4개 보기 중 정답 선택 방식
- 한국 음계로 직관적인 학습

### 3. 음표 그리기 퀴즈 (`/note-drawing`)
- 마우스/터치로 오선지에 음표를 직접 그리는 퀴즈
- VexFlow를 사용한 실시간 음표 렌더링
- 클릭한 위치에 정확한 음표 표시
- 정답 위치와 비교하여 정확도 측정

## 🔧 기술적 고려사항

### 1. VexFlow 라이브러리 활용
```typescript
// 동적 로드로 번들 크기 최적화
const { VexFlow } = await import('vexflow');

// 반응형 크기 조정
const width = isMobile ? 300 : 800;
const height = isMobile ? 180 : 280;
renderer.resize(width, height);
```

### 2. 모바일 친화적 디자인
- **반응형 레이아웃**: Tailwind CSS의 반응형 클래스 활용
- **터치 이벤트**: 모바일에서 터치로 음표 그리기 지원
- **화면 크기 최적화**: 모바일에서 튀어나오지 않도록 패딩/마진 조정

### 3. Web Audio API 구현
```typescript
// 피아노 소리 재생을 위한 하모닉스 생성
const harmonics = [
  { freq: frequency, gain: 1.0 },      // 기본 주파수
  { freq: frequency * 2, gain: 0.5 },  // 2배음
  { freq: frequency * 3, gain: 0.25 }, // 3배음
  { freq: frequency * 4, gain: 0.125 }, // 4배음
  { freq: frequency * 5, gain: 0.0625 } // 5배음
];
```

### 4. 터치 이벤트 처리
```typescript
// Passive 이벤트 리스너 문제 해결
container.addEventListener('touchstart', handleTouchStartDirect, { passive: false });

// preventDefault() 사용 가능
const handleTouchStartDirect = (e: TouchEvent) => {
  e.preventDefault(); // 이제 안전하게 사용 가능
  // 터치 처리 로직
};
```

## 🐛 해결한 주요 문제들

### 1. Hydration 오류
- **문제**: `window.innerWidth`를 서버 사이드에서 사용하여 SSR/CSR 불일치
- **해결**: `useState`와 `useEffect`를 사용하여 클라이언트 사이드에서만 크기 계산

```typescript
const [canvasSize, setCanvasSize] = useState({ width: 800, height: 300 });

useEffect(() => {
  const updateCanvasSize = () => {
    const isMobile = window.innerWidth < 768;
    setCanvasSize({
      width: isMobile ? 350 : 800,
      height: isMobile ? 200 : 300
    });
  };
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
  return () => window.removeEventListener('resize', updateCanvasSize);
}, []);
```

### 2. 터치 이벤트 Passive 모드 문제
- **문제**: React 터치 이벤트에서 `preventDefault()` 사용 불가
- **해결**: 직접 DOM 이벤트 리스너 사용

### 3. 모바일 화면 튀어나오는 문제
- **해결**: 모든 패딩, 마진, 텍스트 크기를 모바일에 맞게 조정
- **적용**: `p-3 md:p-5`, `text-sm md:text-lg` 등 반응형 클래스 활용

## 📱 모바일 최적화

### 1. 반응형 디자인
```css
/* 모바일 우선 접근법 */
.p-3.md\:p-5  /* 모바일: 12px, 데스크톱: 20px */
.text-sm.md\:text-lg  /* 모바일: 14px, 데스크톱: 18px */
.mb-4.md\:mb-8  /* 모바일: 16px, 데스크톱: 32px */
```

### 2. 터치 인터랙션
- 터치 영역 최적화
- 스크롤 방지
- 부드러운 터치 반응

### 3. 성능 최적화
- VexFlow 동적 로드
- 이미지 최적화
- 번들 크기 최소화

## 🎨 UI/UX 고려사항

### 1. 일관된 디자인 시스템
- **색상 테마**: 각 퀴즈별로 다른 색상 (파란색, 녹색, 보라색)
- **카드 레이아웃**: 모든 퀴즈가 동일한 카드 구조 사용
- **버튼 스타일**: 일관된 버튼 디자인과 호버 효과

### 2. 사용자 피드백
- **실시간 피드백**: 정답/오답 즉시 표시
- **진도 추적**: 정답률, 연속 정답, 최고 기록
- **시각적 피드백**: 색상과 아이콘으로 상태 표시

### 3. 접근성
- **키보드 네비게이션**: 모든 버튼이 키보드로 접근 가능
- **스크린 리더 지원**: 적절한 ARIA 라벨과 시맨틱 HTML
- **색상 대비**: 충분한 색상 대비로 가독성 확보

## 🔄 상태 관리

### 1. 퀴즈 상태
```typescript
interface Problem {
  leftNote?: Note;
  rightNote?: Note;
  targetNote?: string;
  targetY?: number;
  correctAnswer?: 'left' | 'right';
  options?: string[];
}
```

### 2. 게임 진행 상태
```typescript
const [correctCount, setCorrectCount] = useState(0);
const [incorrectCount, setIncorrectCount] = useState(0);
const [streak, setStreak] = useState(0);
const [bestStreak, setBestStreak] = useState(0);
const [answered, setAnswered] = useState(false);
```

## 📁 파일 구조
```
src/
├── app/
│   ├── page.tsx                    # 메인 페이지
│   ├── note-comparison/page.tsx    # 높은음/낮은음 구분 연습
│   ├── note-quiz/page.tsx          # 음표 맞추기 퀴즈
│   └── note-drawing/page.tsx       # 음표 그리기 퀴즈
├── components/
│   ├── VexFlowStaff.tsx            # VexFlow 악보 렌더링
│   ├── VexFlowDrawingStaff.tsx     # 음표 그리기용 VexFlow
│   ├── ScoreBoard.tsx              # 점수 표시
│   ├── Feedback.tsx                # 피드백 메시지
│   ├── Instructions.tsx            # 사용법 안내
│   └── GameControls.tsx            # 게임 컨트롤
```

## 🚀 배포 고려사항

### 1. 성능 최적화
- VexFlow 동적 로드로 초기 번들 크기 최소화
- 이미지 최적화 및 압축
- 코드 스플리팅으로 필요한 페이지만 로드

### 2. SEO 최적화
- 메타 태그 설정
- 시맨틱 HTML 구조
- 페이지 제목과 설명

### 3. 모니터링
- 에러 바운더리 설정
- 사용자 행동 분석
- 성능 모니터링

## 💡 향후 개선 아이디어

### 1. 기능 확장
- 더 많은 음계 추가 (샵, 플랫 등)
- 리듬 퀴즈 추가
- 멜로디 재생 퀴즈

### 2. 기술적 개선
- PWA 지원으로 오프라인 사용 가능
- 소셜 로그인 및 사용자 계정
- 진도 저장 및 동기화

### 3. 접근성 개선
- 더 많은 키보드 단축키
- 고대비 모드 지원
- 다국어 지원

---

**마지막 업데이트**: 2025년 9월
**프로젝트 상태**: 완성 및 배포 준비 완료 