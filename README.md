# 공주들 되는 날짜 표시 해줘 !! 

모임통장도 시작한김에 ~~ 
매번 카톡으로 날짜 투표 올리기 귀찮구,, 그럴시간에 간단하게 만들어버리자 + NestJS 써보자 마인드로 만들기 ~

어차피 아이디 비번이 노출되어도 개인정보는 이름과 만나는 날짜일뿐
그치만 안전을 위해 비밀번호 변경을 만들어야겠징..


## 백엔드 (NestJS)
- **메인 프레임워크**: NestJS
- **데이터베이스**: SQLite + Prisma (ORM)
- **인증**: JWT, Passport.js
- **배포**: Render

### 주요 패키지
- `@nestjs/jwt`: JWT 토큰 생성 및 검증
- `@nestjs/passport`: 인증 미들웨어
- `@prisma/client`: Prisma ORM
- `bcrypt`: 비밀번호 해싱

## 프론트엔드 (Next.js)
- **메인 프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **배포**: Vercel

### 주요 패키지
- `axios`: HTTP 클라이언트
- `date-fns`: 날짜 처리
- `@tanstack/react-query`: 서버 상태 관리

## 기능 구현
### 인증
- 6명의 사용자 로그인 시스템
- JWT 기반 인증
- 사용자별 고유 색상

### 캘린더
- 월간 캘린더 뷰
- 일정 등록/수정/삭제
- 사용자별 색상으로 일정 표시
- 반응형 디자인... 인데 지금 월간 달력 이상하게 나옴 수정 예정

## 데이터베이스 스키마
```prisma
model User {
  id       Int     @id @default(autoincrement())
  username String  @unique
  password String
  color    String
  events   Event[]
}

model Event {
  id        Int      @id @default(autoincrement())
  title     String
  date      DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API 엔드포인트
- POST `/auth/login`: 로그인
- GET `/events`: 전체 일정 조회
- POST `/events`: 일정 생성
- PUT `/events/:id`: 일정 수정
- DELETE `/events/:id`: 일정 삭제


## 배포 환경
- 백엔드: Render
- 프론트엔드: Vercel
