# 온라인 공연 예매프로그램 - onlineReservation

## 개요
이 프로젝트는 Node.js 와 Nest.js 를 사용하여 온라인 공연 예매 서비스를 구현하는 과제입니다.

## 기술 스택
- ** Nest.js** : TypeScript 실행환경
- ** Node.js** :TypeScript 웹 애플리케이션 프레임워크
- ** MySQL**: 관계형 데이터베이스(TypeORM 사용)

## ERD
<img width="1764" alt="image" src="https://github.com/user-attachments/assets/6161952a-42dd-47c0-b24b-feccd87b4f0a">

## API
https://savory-toy-357.notion.site/12221179f67b80e1a2b6c530f0f4d3fc?v=2b5148ee7b774dcf8e40743f8f93d9f4&pvs=4

## 프로젝트 설치 및 실행

## 요구 사항

- Node.js
- npm
- MySQL

### 설정

1. **환경 변수 설정**
   '.env' 파일 생성, 아래 환경 변수 설정.
   
   ```plaintext
   DB_NAME = 'online_showReservation'
   DB_SYNC = true
   JWT_SECRET_KEY = 'SECRET_KEY'
   SERVER_PORT = '5555'
   ```
   
2. **서버 실행**

   ```bash
   npm run start
   ```
   
3. **의존성 설치**

   ```bash
   npm install
   ```
   
## 추가 구현

### 사고의 흐름
프로젝트 필수 구현 이후 포인트 내역 확인을 추가하여 구현하였습니다.

### 구현
유저가 예매 성공 , 취소 할때 포인트 내역에 내용과 영수증을 만들었습니다.

