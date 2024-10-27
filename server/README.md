< 저수율 예측 가뭄 대비 작물 추천 사이트 Server >

1. 프로젝트 배포
- Firebase
    * React(프론트엔드)를 빌드해서 Firebase에 업로드
    * 도메인( https://reservoirmap.web.app/ )을 얻기 위해 Firebase 활용

- Google Cloud Compute Engine VM
    * VM 인스턴스 생성
        - Compute Engine > VM 인스턴스 페이지에서 "인스턴스 만들기" 버튼 클릭
        - 무료 사용 가능한 리전 <br>
          us-west1 (오리건) <br>
          us-central1 (아이오와) <br>
          us-east1 (사우스캐롤라이나) 
        - 방화벽 : 웹 애플리케이션을 외부에서 접속할 수 있도록 HTTP와 HTTPS 트래픽 허용 선택
        - 생성 후 방화벽 규칙 추가
          네트워킹 → VPC 네트워크 → 방화벽 규칙 → 새로운 규칙 추가 → 포트 8080 추가

    * VM 서버 기본 설치 및 https 인증서 생성
        - VM 서버 SSH 접속
        - sudo apt update
        - sudo apt install openjdk-17-jdk (java17 설치)
        - OpenSSL을 사용해 자체 서명된 SSL 인증서 생성
          sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
          -keyout /etc/ssl/private/selfsigned.key \
          -out /etc/ssl/certs/selfsigned.crt
        - 인증서 생성을 위한 정보를 입력 예시
          Country Name: KR
          State: Seoul
          Locality: Seoul
          Organization: MyCompany
          Organizational Unit: IT
          Common Name: 35.193.25.157 (VM의 외부 IP 주소)
          Email Address: (비워둬도 됩니다.)
        - SSL 인증서를 Spring Boot에서 사용할 수 있도록 변환 (PKCS12)
          sudo openssl pkcs12 -export -in /etc/ssl/certs/selfsigned.crt \
          -inkey /etc/ssl/private/selfsigned.key \
          -out /etc/ssl/private/selfsigned.p12 \
          -name tomcat
        - 홈 디렉토리로 SSL 인증서 파일을 이동
          sudo mv /etc/ssl/private/selfsigned.p12 /home/{Your-Directory}/selfsigned.p12
        - 읽기 권한 부여
          sudo chmod 644 /home/righthyeon00/selfsigned.p12

    * Spring Boot 설정 및 빌드
        - Spring Boot application.properties 설정 추가
          server.port=443
          server.ssl.key-store=file:/home/{Your-Directory}/selfsigned.p12
          server.ssl.key-store-password={Your-Password}
          server.ssl.key-store-type=PKCS12
          server.ssl.key-alias=tomcat

        - Spring Boot에 React(프론트엔드)를 빌드해서 추가(선택사항) 후 Spring Boot를 빌드해서 .jar 파일 생성
          .\gradlew.bat build (Spring Boot 빌드 명령어)

    * Spring Boot(벡엔드) VM 서버 실행
        - VM 서버 SSH 접속
        - {Your-Spring-Boot}SNAPSHOT.jar 업로드
        - 서버 실행
          sudo java -jar {Your-Spring-Boot}SNAPSHOT.jar

    * 도메인( https://reservoirmap.web.app/ )을 통해 사이트 접속
    * React(프론트엔드) 빌드 추가 시 서버의 외부 아이피로도 사이트 접속 가능( https://35.193.25.157 )
    * 서버 외부 IP(35.193.25.157)는 Google Cloud Compute Engine VM에서 확인가능
    * 자체 서명된 인증서이므로 브라우저에서 경고 메시지가 표시될 수 있습니다. 이 경고를 무시하고 계속 진행하면 사이트에 접속할 수 있습니다.
    * Spring Boot(벡엔드)는 client의 요청 처리
