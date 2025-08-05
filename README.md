# 🎵 음악 학습 - 높은음/낮은음 구분 연습 (Next.js 버전)

오선지에서 두 개의 음표 중 더 높은 음을 구분하는 연습을 할 수 있는 **Next.js 기반의 인터랙티브한 웹사이트**입니다.

## ✨ 주요 기능

- **오선지 시각화**: HTML5 Canvas를 사용한 실제 오선지 표시
- **랜덤 음표 생성**: 매번 다른 높이의 음표로 연습 가능
- **실시간 피드백**: 정답/오답 즉시 확인
- **점수 추적**: 정답률과 정답/오답 개수 표시
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **컴포넌트 기반 구조**: 재사용 가능한 React 컴포넌트
- **TypeScript 지원**: 타입 안정성 보장

## 🚀 기술 스택

- **Next.js 14**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **HTML5 Canvas**: 오선지 및 음표 그리기
- **React Hooks**: 상태 관리

## 📁 프로젝트 구조

```
music-learning-nextjs/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── layout.tsx         # 레이아웃
│   │   └── globals.css        # 전역 스타일
│   └── components/
│       ├── ScoreBoard.tsx     # 점수판 컴포넌트
│       ├── StaffCanvas.tsx    # 오선지 Canvas 컴포넌트
│       ├── GameControls.tsx   # 게임 컨트롤 컴포넌트
│       ├── Feedback.tsx       # 피드백 컴포넌트
│       └── Instructions.tsx   # 사용법 안내 컴포넌트
├── public/                    # 정적 파일
├── package.json
└── README.md
```

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 환경 설정
```bash
# 개발 환경
npm run dev     # http://localhost:3000

# 프로덕션 환경
npm run build
npm start
```

## 🎯 사용법

1. 웹 브라우저에서 `http://localhost:3000` 접속
2. 오선지에 표시된 두 개의 음표 중 더 높은 음을 선택
3. 정답 확인 후 "다음 문제" 버튼을 눌러 계속 연습
4. 상단의 점수판에서 실력 향상을 확인

## 🎨 컴포넌트 구조

### 주요 컴포넌트

- **ScoreBoard**: 정답/오답/정답률 표시
- **StaffCanvas**: HTML5 Canvas를 사용한 오선지 그리기
- **GameControls**: 게임 진행을 위한 버튼들
- **Feedback**: 정답/오답 피드백 메시지
- **Instructions**: 사용법 안내

### 상태 관리

- `correctCount`: 정답 개수
- `incorrectCount`: 오답 개수
- `currentProblem`: 현재 문제 정보
- `answered`: 답변 완료 여부
- `feedback`: 피드백 메시지

## 🔧 개발 정보

### Next.js App Router 사용
- `src/app/` 디렉토리 구조
- 서버 컴포넌트와 클라이언트 컴포넌트 분리
- 메타데이터 최적화

### TypeScript 설정
- 엄격한 타입 검사
- 인터페이스 정의로 타입 안정성 보장
- 컴포넌트 Props 타입 정의

### Tailwind CSS
- 유틸리티 클래스 기반 스타일링
- 반응형 디자인
- 커스텀 애니메이션

## 📱 반응형 디자인

- **데스크톱**: 최적화된 레이아웃과 큰 Canvas
- **태블릿**: 중간 크기 화면에 맞춘 조정
- **모바일**: 터치 친화적인 버튼과 작은 Canvas

## 🚀 배포

### Vercel 배포 (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 기타 플랫폼
- Netlify
- AWS Amplify
- Docker

## 🎵 학습 목표

- 오선지에서 음표의 높낮이를 시각적으로 구분하는 능력 향상
- 음악 이론의 기초인 음의 높낮이 개념 이해
- 반복 연습을 통한 음악적 감각 개발
- 인터랙티브한 학습 경험 제공

## 🔄 기존 버전과의 차이점

### 개선사항
- **Next.js 프레임워크**: 더 나은 성능과 SEO
- **TypeScript**: 타입 안정성 향상
- **컴포넌트 분리**: 재사용성과 유지보수성 향상
- **Tailwind CSS**: 더 나은 스타일링 시스템
- **반응형 디자인**: 모든 디바이스 지원

### 호환성
- 기존 HTML/CSS/JS 버전과 동일한 기능
- 향상된 사용자 경험
- 더 나은 개발자 경험

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었으며, 자유롭게 사용하실 수 있습니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
