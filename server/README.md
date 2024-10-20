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
