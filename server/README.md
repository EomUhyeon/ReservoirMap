저수율 예측 가뭄 대비 사이트 프로젝트




구글 클라우드 배포 방법

1. 초기 세팅 명령어
- sudo apt update
- sudo apt install openjdk-17-jdk
- java -version
- sudo apt install git
- git clone https://github.com/your-repository-url

- java -jar server-0.0.1-SNAPSHOT.jar


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


