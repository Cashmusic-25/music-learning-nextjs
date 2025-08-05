# 🎵 음악 학습 앱 - 높은음/낮은음 구분 연습

두 개의 음표 중에서 더 높은 음을 선택하는 음악 학습 앱입니다.

## 🚀 기능

- **음표 높낮이 비교**: 두 음표 중 더 높은 음을 선택하는 연습
- **실시간 피드백**: 정답/오답 즉시 확인
- **통계 추적**: 정답률, 연속 정답, 최고 기록 등
- **A3~C6 음역**: 학습에 적합한 음역으로 제한
- **VexFlow 기반**: 정확한 악보 표시

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Music Notation**: VexFlow 5
- **Deployment**: GitHub Pages

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 배포
npm run deploy
```

## 🌐 배포

이 앱은 GitHub Pages에 자동으로 배포됩니다.

- **배포 URL**: https://cashmusic-25.github.io/music-learning-nextjs/
- **브랜치**: main 브랜치에 push하면 자동 배포

## 🎯 사용법

1. 화면에 표시되는 두 개의 음표를 확인
2. 더 높은 음표가 왼쪽인지 오른쪽인지 선택
3. 정답을 확인하고 다음 문제로 진행
4. 통계를 통해 학습 진행 상황 확인

## 📊 음표 범위

- **최저음**: A3 (라3)
- **최고음**: C6 (도6)
- **총 음역**: 3옥타브 + 2음

## 🔧 개발

```bash
# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 📝 라이선스

MIT License
