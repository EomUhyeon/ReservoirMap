저수율 예측 가뭄 대비 사이트 프로젝트




구글 클라우드 배포 방법

1. 초기 세팅 명령어
- sudo apt update
- sudo apt install locales
- sudo apt install openjdk-17-jdk
- java -version
- sudo apt install git
- git clone https://github.com/your-repository-url

- java -jar server-0.0.5-SNAPSHOT.jar


- chmod +x gradlew
- ./gradlew build


2. VM 인스턴스 생성
- Compute Engine > VM 인스턴스 페이지에서 "인스턴스 만들기" 버튼 클릭
- 인스턴스 설정 입력
  - 무료 사용 가능한 리전
      us-west1 (오리건)
      us-central1 (아이오와)
      us-east1 (사우스캐롤라이나)

  - 방화벽 : 웹 애플리케이션을 외부에서 접속할 수 있도록 HTTP와 HTTPS 트래픽 허용 선택
  
- 생성 후 방화벽 규칙 추가
  네트워킹 → VPC 네트워크 → 방화벽 규칙으로 이동한 후 새로운 규칙을 추가하고 포트 8080을 추가

3. Spring Boot Project를 빌드 하는 방법
- .\gradlew.bat build

4. 접속 방법

- http://your-vm-ip-address:8080
- http://34.66.104.241:8080/ 

5. 프로젝트 만들기
- Paths.get() 사용하지 마세요.

Path filePath = Paths.get(new ClassPathResource(fileName).getURI());
String csvContent = Files.readString(filePath);


ClassPathResource resource = new ClassPathResource(fileName);
String csvContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

// 파일 이름을 UTF-8로 인코딩
String encodedFileName = URLEncoder.encode(reservoirName + ".csv", StandardCharsets.UTF_8.toString());


1. 로케일 설정을 기본값으로 적용
   로케일을 en_US.UTF-8로 변경하려면, 시스템의 기본 로케일을 업데이트해야 합니다.

1.1 /etc/default/locale 파일을 수정:
bash
코드 복사
sudo nano /etc/default/locale
파일이 열리면 다음 내용을 추가하거나 수정하세요:

bash
코드 복사
LANG=en_US.UTF-8
LC_ALL=en_US.UTF-8
저장하고 나서 파일을 닫습니다.

1.2 로케일 적용:
다음 명령어를 실행하여 변경 사항을 적용합니다.

bash
코드 복사
source /etc/default/locale
2. 로케일 설정 확인
   이제 다시 locale 명령어를 실행하여 설정이 제대로 적용되었는지 확인하세요:

bash
코드 복사
locale
출력에서 LANG과 LC_* 항목이 모두 en_US.UTF-8으로 표시되면 설정이 완료된 것입니다.
재부팅 (필요한 경우): 모든 단계를 수행한 후 시스템을 재부팅해 설정을 제대로 반영시켜야 할 수 있습니다.

bash
코드 복사
sudo reboot
로케일 확인: 재부팅 후 다시 locale 명령어로 로케일 설정을 확인하세요.

bash
코드 복사
locale


1. 자체 서명된 SSL 인증서 생성
   먼저 Google Cloud VM에서 자체 서명된 SSL 인증서를 생성하여 HTTPS 설정을 위해 준비합니다.

SSH로 Google Cloud VM에 접속합니다.

Google Cloud Console에서 SSH 버튼을 클릭하여 VM에 접속합니다.
OpenSSL을 사용해 자체 서명된 SSL 인증서 생성: 아래 명령어를 사용하여 자체 서명된 SSL 인증서와 개인 키 파일을 생성합니다.

bash
코드 복사
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/ssl/private/selfsigned.key \
-out /etc/ssl/certs/selfsigned.crt
인증서 생성을 위한 정보를 입력해야 합니다. 가장 중요한 것은 Common Name(CN) 부분에 VM의 공인 IP 주소를 입력하는 것입니다. 예:

Country Name: KR
State: Seoul
Locality: Seoul
Organization: MyCompany
Organizational Unit: IT
Common Name: 34.66.xxx.xxx (VM의 공인 IP 주소)
Email Address: 비워둬도 됩니다.
2. SSL 인증서를 Spring Boot에서 사용할 수 있도록 변환 (PKCS12)
   Spring Boot는 PKCS12 또는 JKS 형식의 인증서를 사용합니다. 방금 생성한 인증서를 PKCS12 형식으로 변환합니다.

bash
코드 복사
sudo openssl pkcs12 -export -in /etc/ssl/certs/selfsigned.crt \
-inkey /etc/ssl/private/selfsigned.key \
-out /etc/ssl/private/selfsigned.p12 \
-name tomcat
변환된 인증서 파일(selfsigned.p12)이 /etc/ssl/private/ 경로에 저장됩니다. 변환 시 설정한 비밀번호는 Spring Boot 설정에서 사용됩니다.

# 홈 디렉토리로 SSL 인증서 파일을 이동
sudo mv /etc/ssl/private/selfsigned.p12 /home/righthyeon00/selfsigned.p12

# 새로운 위치의 권한을 수정하여 읽기 권한 부여
sudo chmod 644 /home/righthyeon00/selfsigned.p12


3. Spring Boot 애플리케이션에 HTTPS 설정 추가
   이제 Spring Boot 프로젝트의 application.properties 또는 application.yml 파일에 HTTPS 설정을 추가합니다.

application.properties 설정:
properties
코드 복사
server.port=443
server.ssl.key-store=file:/etc/ssl/private/selfsigned.p12
server.ssl.key-store-password=your-password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
application.yml 설정:
yaml
코드 복사
server:
port: 443
ssl:
key-store: file:/etc/ssl/private/selfsigned.p12
key-store-password: your-password
key-store-type: PKCS12
key-alias: tomcat
server.port=443: HTTPS는 기본적으로 포트 443에서 동작합니다.
key-store: SSL 인증서 파일의 경로를 지정합니다.
key-store-password: 인증서를 생성할 때 설정한 비밀번호를 입력합니다.
key-store-type: PKCS12 형식으로 설정합니다.
key-alias: 인증서의 별칭(alias)을 지정합니다. (보통 tomcat으로 설정).
4. Spring Boot 애플리케이션 빌드 및 VM으로 전송
   Spring Boot 애플리케이션을 HTTPS 설정을 포함하여 빌드한 후, Google Cloud VM으로 전송합니다.

빌드: 로컬 환경에서 Maven을 사용하여 애플리케이션을 빌드합니다.

bash
코드 복사
mvn clean package
빌드가 완료되면 target/ 디렉토리에 .jar 파일이 생성됩니다.

VM으로 전송: SCP(Secure Copy) 명령어를 사용하여 빌드된 .jar 파일을 VM으로 전송합니다.

bash
코드 복사
scp target/myapp-0.0.1-SNAPSHOT.jar username@<VM_IP>:/home/username/
username: VM의 사용자 이름.
VM_IP: VM의 공인 IP 주소.
5. Google Cloud VM에서 애플리케이션 실행
   SSH로 VM에 접속: SSH로 다시 VM에 접속합니다.

Spring Boot 애플리케이션 실행:

bash
코드 복사
java -jar /home/username/myapp-0.0.1-SNAPSHOT.jar
Spring Boot 애플리케이션이 HTTPS로 구동되며, 443 포트에서 요청을 처리합니다.

6. Google Cloud 방화벽 설정 확인
   Google Cloud에서 포트 443이 외부에서 접근 가능하도록 방화벽 설정을 확인해야 합니다.

Google Cloud Console에서 VPC 네트워크 > 방화벽 규칙으로 이동합니다.

**포트 443(HTTPS)**가 허용되어 있는지 확인합니다. 만약 허용되어 있지 않다면 방화벽 규칙을 추가해야 합니다.

이름: allow-https
대상: 모든 인스턴스
소스 IP 범위: 0.0.0.0/0
프로토콜 및 포트: TCP 443
7. 브라우저에서 HTTPS로 접속
   애플리케이션이 실행되면, 브라우저에서 HTTPS로 접속할 수 있습니다.

브라우저에서 **https://<VM_IP>**를 입력하여 접속합니다.
자체 서명된 인증서이므로 브라우저에서 경고 메시지가 표시될 수 있습니다. 이 경고를 무시하고 계속 진행하면 애플리케이션에 접속할 수 있습니다.
요약:
SSL 인증서 생성: VM에서 자체 서명된 SSL 인증서 생성.
SSL 인증서 변환: Spring Boot에서 사용할 수 있도록 PKCS12 형식으로 변환.
Spring Boot 설정: HTTPS 설정을 application.properties 또는 application.yml에 추가.
Spring Boot 애플리케이션 빌드: 빌드 후 VM에 .jar 파일 업로드.
Spring Boot 실행: VM에서 HTTPS를 사용해 Spring Boot 애플리케이션 실행.
Google Cloud 방화벽 설정: 443 포트를 열어 외부에서 HTTPS로 접근 가능하도록 설정.
브라우저 접속: HTTPS로 애플리케이션에 접속.