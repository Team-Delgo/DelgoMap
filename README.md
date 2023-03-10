# <b>🐕 Delgo Client Repository 🐕</b>
<img width="40%" src="https://user-images.githubusercontent.com/54196723/203544712-8ad87cf3-23ef-408b-97d2-e1ccc21d9485.svg">

<br/>


## <b> 📚 Contents </b>

-   ### <b> <a href="#1"> 🐶 Service introduce </a> </b>
-   ### <b> <a href="#2"> 🐶 Repositories </a> </b>
-   ### <b> <a href="#3"> 🐶 Technology </a> </b>
-   ### <b> <a href="#0"> 🐶 Team introduce </a> </b>
-   ### <b> <a href="#4"> 🐶 Store link </a> </b>
-   ### <b> <a href="#5"> 🐶 Develop period </a> </b>
-   ### <b> <a href="#6"> 🐶 Result </a> </b>

<br/>




<h2 id="1">
    <b>💁 Service introduce</b>
</h2>

### 인증기반 펫 다이어리 서비스 플랫폼

- **펫 인증**
    - 카테고리, 인증장소 등을 선택해 인증
    - 사진첩, 캘린더, 지도, 커뮤니티등 기록
- **펫 다이어리**
    - 사진첩과 캘린더에 기록
- **멍플 지도**
    - 멍플 장소 아이콘 마커 표시
    - 인증 기록 아이콘 마커 표시
- **업적**
    - 업적 미션 수행시 업적 획득
- **푸쉬 알림**
    - 다른 사용자의 반응을 실시간으로 알려줌

<br/>


<h2 id="2">
<b>📂 Repositories</b>
</h2>

-   ### <b> <a href="https://github.com/Team-Delgo"> 🔗 Delgo-Organization </a> </b>
-   ### <b> <a href="https://github.com/Team-Delgo/DelgoClient" > 🔗 Delgo-Frontend </a> </b>
-   ### <b> <a href="https://github.com/Team-Delgo/DelgoRewardServer" > 🔗 Delgo-Backend </a> </b>
-   ### <b> <a href="https://github.com/Team-Delgo/DelgoAndroid" > 🔗 Delgo-Android </a> </b>


<br/>


<h2 id="3">🛠 Technology</h2>

### ⚙️ Tech Stack

`React`, `Redux Toolkit`, `React Query`, `SCSS`, `TypeScript`, `Eslint`, `Prettier`, `Naver Map`, `Firebase Analytics`, `FCM`, `Spring Boot`, `JPA`, `Maria DB`, `Nginx`, `Apache Tomcat`, `NCP`, `Object Storage`, `JWT`, `OAuth 2.0`, `REST API`

### ⚙️ Architecture

`MVC`

### ⚙️ ERD
<img width="70%" src="https://user-images.githubusercontent.com/54196723/209088168-6ac91aee-63f2-4d78-9f8a-d71a0a12c0df.png">

<br/>

<h2 id="0">
    <b>💁 Team  introduce </b>
</h2>



| Name        | Part   | Development                                   |
|:------------:|:-------:|:-----------------------------------------------|
|<a href="https://github.com/wjdtjrdn1234">정석우</a>|**front-end**|숙소 검색 서비스 구현</li> <li>지역별 숙소 필터링</li> <li>일정별 숙소 예약현황, 가격정보 노출</li> <br/>나의 저장소 서비스 구현<li>위시리스트 숙소 리스트 노출 </li><li> 예약내역 리스트 노출 </li><br/>리뷰 작성 서비스 구현<li>formdata & createObjectURL 메서드 이용한 이미지확장자 파일 업로드(리뷰사진)</li><li>별점, 텍스트, 이미지를 통한 리뷰작성</li><br/>숙소 상세 서비스 구현<li>숙소사진, 별점, 리뷰, 룸리스트, 예약현황, 예약금액, 주소, 공지, 환불규정 노출</li><li>리뷰사진 후기 필터링</li><li>Kakao Map API 이용한 숙소위치 노출</li><li>Redux Toolkit을 이용한 숙소정보, 룸정보 상태관리</li><br/>예약 결제 서비스 구현 <li>Toss Payments API 이용한 예약결제, 취소</li><li>쿠폰, 포인트 이용한 할인</li><li>Redux Toolkit을 이용한 예약정보 상태관리(예약자명,숙소명,방타입명,쿠폰사용 유무,결제가격,일정)</li><br/>예약 조회 서비스 구현 <li>예약대기, 예약확정</li><br/>예약 취소 구현<li>환불규정에 따른 예약, 결제 취소</li><br/>네이티브 Bridge 함수 연결 <li>Ios,Android copyToClipboard</li><li>Ios,Android vibrate</li><li>Ios,Android goToPlusFriends</li><li>Ios,Android setNotify</li><li>Ios numToCall</li><br/>예약관리 시스템(PMS) 웹사이트 구현<li>로그인 구현</li><li>예약대기 -> 예약취소 구현</li><li>예약대기 -> 예약확정 구현</li><li>예약확정 -> 예약취소 구현</li><br/> 에디터 노트 서비스 구현 <br/><br/>숙소 추천 서비스 구현 <br/><br/>위시리스트 추가, 삭제 구현 <br/><br/>React Query를 이용한 데이터 패칭, 에러핸들링, 로딩처리등 비동기처리와 서버상태 관리<br/><br/>Redux Toolkit을 이용한 스크롤위치, 지역명, 탭 상태관리<br/><br/>Axios.Interceptors 이용한 JWT 만료 에러 핸들링<br/><br/>React-Modal-Sheet 이용한 Modal Sheet 구현<br/><br/>React-Loading-Skeleton 이용한 숙소 Skeleton UI 구현<br/><br/>React-Responsive-Carousel 이용한 숙소이미지 Slider 구현</li>|
|<a href="https://github.com/ckrb63">김찬규</a>| **front-end**|로그인 서비스 개발<li>JWT Access, Refresh Token 관리</li> <li>비밀번호 찾기</li> <li>OAuth2.0 로그인 Kakao, Naver, Apple </li> <li>Redux Toolkit으로 회원 정보 상태 관리</li><br/>회원가입 서비스 개발<li>핸드폰 인증을 통한 회원가입 구현</li><li>입력값 정규식으로 유효성 검사, 불필요한 통신 최소화</li><li>FormData로 강아지 사진 등록</li><li>OAuth2.0 회원가입 Kakao, Naver, Apple </li><br/>회원 정보 페이지 서비스 개발<li>강아지 정보, 사진 수정</li><li>회원 정보 수정</li><li>예약 현황 확인</li><li>로그아웃, 회원탈퇴</li><li>쿠폰 조회,등록</li><li>리뷰 목록 페이지</li><li>설정 페이지</li><br/>체험 기능 구현<li>로그인이 필요한 기능은 SignIn페이지로 보내는 Alert</li><br/>Redux Toolkit을 통한 전역 비동기 Error Alert 기능 개발<br/><br/>Calendar 개발<li>Room Type에 따른 예약 가능 날짜,가격 동기화</li><br/>홈 화면 내부 페이징 가능한 예약현황 확인 서비스 개발<br/><br/>앱 내부 애니메이션, 효과<br/><br/>이미지 browser-image-compression로 Base64 압축 후 FormData 업로드|
|<a href="https://github.com/Gupuroom">이동재 </a>|**back-end**|DB 설계<br/><br/>Spring Security & JWT 세팅 및 인증 구현<li>Delgo 로그인 도메인 개발</li><br/>Spring Data JPA 세팅<br/><br/>Spring Boot로 Delgo RESTful API 개발<li예약 도메인 개발</li><li>숙소 조회 도메인 개발</li><li>리뷰 도메인 개발</li><li>리뷰작성시 사진 Upload & Ncp Object Storage 연동 개발</li><li>회원가입시 사진 Upload & Ncp Object Storage 연동 개발</li><li>캘린더 도메인 개발</li><li>쿠폰 도메인 개발</li><li>카카오 로그인 개발</li><li>기존 로그인 OAuth 로그인 연동 개발</li><br/>@ExceptionHandler 이용 공통예외처리 세팅<br/><br/>Spring Inteceptor Log 세팅<li> Get & Post Log 세팅 [ 요청 url, Parameter , 결과 코드, 결과 내용 ]</li><br/>Quartz & Crontab 이용 Crawling 개발<li>실시간 예약 정보 취득 Crawling</li><li>특정 숙소 등록 Crawling</li><br/>NCP 연동<li>API 서버 배포</li><li>WEB 서버 배포</li><li>User, Review 사진 저장을 위한 Object Storage 세팅</li><br/>Letsencrypt, Certbot을 이용한 서비스 SSL 보안 적용|
| <a href="https://github.com/danpung2">조현서 </a>|**back-end** <br/> **ios** <br/> **android**|회원 서비스 개발<li>유저, 펫 DB 관리</li> <li>회원가입 프로세스</li> <li>회원가입 시 이메일, 핸드폰 번호 등 중복 데이터 검증</li> <li>핸드폰 인증 DB 관리</li><li>핸드폰 인증 로직</li><li>핸드폰 번호 정규식으로 데이터베이스에 정해진 형식으로 저장</li><li>회원 정보, 강아지 정보 수정</li><li>회원탈퇴 기능 개발</li><br/>알림 서비스 개발<li>NCP의 sms 서비스를 활용한 핸드폰 인증 기능 담당</li><li>NCP의 BizMessage 서비스를 활용한 카카오톡 알림 기능 담당</li><br/>결제 서비스 개발<li>결제 취소 로직 개발</li><br/>CI/CD<li>Jenkins를 이용한 React-Nginx 자동 배포</li><li>Jenkins를 이용한 Springboot 자동 배포</li><br/>Android 웹뷰 앱 개발<li>리액트와 안드로이드 간의 통신 구현</li><li>최초 실행 시 갤러리 등 디바이스 접근 권한 설정</li><li>웹뷰와 통신하여 진동, 디바이스 설정으로 이동 등 설정</li><li>웹뷰와 통신하여 카카오톡 플러스 친구로 이동 기능 개발</li><br/>Ios 웹뷰 앱 개발<li>리액트와 iOS 간의 통신 구현</li><li>최초 실행 시 알림 권한 설정</li><li>웹뷰와 통신하여 진동, 디바이스 설정으로 이동 등 설정</li><li>웹뷰와 통신하여 카카오톡 플러스 친구로 이동 기능 개발</li>|


<br/>



<h2 id="4">🛒 Store link</h2>

-   ### <b> <a href="https://play.google.com/store/apps/details?id=com.delgo.delgoreward" > 🔗 Android </a> </b>
-   ### <b> <a href="https://apps.apple.com/kr/app/delgo-%EB%8D%B8%EA%B3%A0-%EC%9A%B0%EB%A6%AC-%EA%B0%95%EC%95%84%EC%A7%80%EC%99%80%EC%9D%98-%EB%8F%99%EB%84%A4-%EA%B8%B0%EB%A1%9D/id1662427735"> 🔗 IOS </a> </b>

<br/>


<h2 id="5">📅 Develop period</h2>

<b>22.08.28 ~ </b>

<br/>


<h2 id="6">📷 Result</h2>
<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540079-a0da2912-369b-42a6-a3f1-a8eb6397d70b.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540036-3f67de05-00dd-467f-a291-6736699532de.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540074-c9f4cffc-abc4-401f-84c1-45448d1a04cb.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540027-772d0d92-f184-4168-bfab-ecf614f93a82.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540061-5ad23994-0938-448f-9c54-7418e39c282b.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540054-cab5dc3d-96e9-429b-8306-95b16901fbdb.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540690-969ce54c-07c2-4ca7-ac69-04e80004b4f4.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540699-f5e7e2be-cb9d-465c-966d-ae6caa97bf9d.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540884-7425ba8f-8e60-4f1e-8f22-0bfe8ed2bd41.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203540895-a3e27933-125b-4a0a-ba06-757232b80605.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541093-c7967f12-93e6-4462-82c2-cbcc94076126.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541107-d3b96527-a925-4016-bb1b-ac602ea8d069.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541465-1e6b5b24-72e7-4f80-b318-b3cd5761a6f0.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541474-038f446c-14ca-4266-8649-a92240156d93.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/209087451-d5dd90db-6d89-4419-a5f3-3a613c3bb207.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/209087443-ac6620df-d93d-44c0-bfd2-dd4f77573a2a.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541666-b56563c4-87c5-4979-b366-78bb12297868.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541678-86e2894f-446a-4435-8a7d-1e4cd2b89d3a.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541759-79295aca-7fb8-4eca-b09f-08a1c31d1246.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541875-5fcb4675-7628-4643-8ea8-fa1c0f0ce7ac.png">
</p>

<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541863-00366c79-b8be-4173-8ba2-687062fe4be0.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541770-7b6fd766-1172-4858-9c3a-5bdf9e3f3a85.png">
</p>


<p float="left">  
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/209088830-6e2b7536-ffda-4bf9-bd39-c9805b56f1cc.png">
<img width="35%" height="650px" src="https://user-images.githubusercontent.com/54196723/203541995-62839b6d-efb3-4aa4-b6ac-78d0ce043269.png">
</p>

