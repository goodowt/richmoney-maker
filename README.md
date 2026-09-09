# richmoney-maker.kr

연봉 실수령액 · 퇴직금 · 4대보험 계산기 허브 사이트 (사이트 A). Next.js 16(App Router) + TypeScript + Tailwind CSS 4.

## 로컬 개발

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

```bash
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run start   # 빌드 결과 로컬 실행
```

## 환경변수

현재 계산 로직과 정책 페이지는 별도의 환경변수 없이 동작합니다. `src/lib/tools.ts`의
`siteConfig`에 도메인·연락처 등 사이트 전역 값이 모여 있으니, 값이 바뀌면 그 파일만
수정하면 됩니다(`contactEmail`은 현재 자리표시자 `contact@richmoney-maker.kr`입니다).

추후 Google Analytics 4 / Google Search Console / 네이버 서치어드바이저 연동 시
아래와 같은 환경변수를 추가할 예정입니다(아직 코드에 연결되어 있지 않음):

```bash
# .env.local (예시, 아직 미구현)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=xxxxxxxx
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxx
```

---

# 배포 가이드 (초보자용, 순서대로 따라 하면 됩니다)

이 사이트를 실제 인터넷 주소(`richmoney-maker.kr`)로 띄우는 전체 과정을 처음부터
끝까지 정리했습니다. 개발 지식이 없어도 순서대로 따라 하면 됩니다.

## 0. 먼저 알아두면 좋은 용어

전체 과정은 크게 세 회사(서비스)를 거칩니다. 각각이 하는 일을 한 줄로 요약하면 이래요.

| 서비스 | 하는 일 |
|---|---|
| **GitHub** | 이 프로젝트의 코드를 인터넷 저장소에 보관하는 곳. 창고라고 생각하면 됩니다. |
| **Vercel** | GitHub에 있는 코드를 가져다가 실제로 웹사이트로 &ldquo;띄워주는(호스팅)&rdquo; 서비스. 무료로 시작할 수 있습니다. |
| **가비아** | `richmoney-maker.kr` 도메인(주소)을 구매/관리하는 곳. 지금은 이 주소가 티스토리 블로그를 가리키고 있는데, 이걸 Vercel을 가리키도록 바꿔줘야 합니다. |

그리고 아래 용어도 뒤에서 계속 나옵니다.

- **DNS**: 인터넷의 &ldquo;전화번호부&rdquo;예요. 사람이 `richmoney-maker.kr`이라고 주소창에 치면,
  DNS가 &ldquo;아, 그 주소는 이 컴퓨터(서버)를 가리키는 거구나&rdquo;라고 알려주는 시스템입니다.
- **A 레코드 / CNAME**: DNS 전화번호부에 적는 한 줄, 한 줄이에요. &ldquo;A 레코드&rdquo;는 도메인을
  숫자 주소(IP, 예: `76.76.21.21`)에 직접 연결하고, &ldquo;CNAME&rdquo;은 도메인을 다른 도메인
  이름에 연결합니다(예: `www.richmoney-maker.kr`를 Vercel이 정해준 이름으로 연결).
- **SSL 인증서 / HTTPS**: 주소창에 자물쇠 표시가 뜨게 해주는, 사이트 통신을 암호화하는
  인증서예요. Vercel이 무료로, 자동으로 발급해줍니다.

## 1. GitHub에 코드 올리기

Vercel이 자동으로 코드를 가져가려면, 먼저 코드가 GitHub에 있어야 합니다.

1. [github.com](https://github.com)에서 계정이 없다면 무료로 가입합니다.
2. GitHub 우측 상단 **+ → New repository**를 눌러 새 저장소를 만듭니다. 이름은 예를
   들어 `richmoney-maker`로 하고, **Public**(공개) 또는 **Private**(비공개) 아무거나
   선택해도 됩니다. README 등 다른 파일은 추가하지 말고(이미 이 프로젝트에 있음) 빈
   저장소로 만듭니다.
3. 이 프로젝트 폴더(`richmoney-maker/`)에서 터미널을 열고 아래 명령을 순서대로
   입력합니다. `깃허브아이디`와 `저장소이름`은 본인 것으로 바꿔주세요.

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/깃허브아이디/저장소이름.git
   git push -u origin main
   ```

4. GitHub 저장소 페이지를 새로고침해서 파일들이 올라갔는지 확인합니다.

## 2. Vercel에 프로젝트 만들고 배포하기

이 저장소에는 `vercel.json`이 포함되어 있어(`framework: nextjs`, 서울 리전 `icn1`),
Vercel이 Next.js 프로젝트임을 자동으로 알아채고 별도 설정 없이 바로 빌드합니다.

1. [vercel.com](https://vercel.com)에 접속해 **GitHub 계정으로 가입/로그인**합니다
   (별도 회원가입 없이 GitHub 버튼 하나로 됩니다).
2. 로그인 후 대시보드에서 **Add New → Project**를 클릭합니다.
3. 방금 GitHub에 올린 저장소(`richmoney-maker`)를 찾아 **Import**를 누릅니다.
4. Framework Preset이 자동으로 **Next.js**로 잡히는지 확인하고, 다른 설정은 건드리지
   않은 채 **Deploy** 버튼을 누릅니다.
5. 1~2분 정도 기다리면 배포가 끝나고, `richmoney-maker.vercel.app` 같은 임시 주소가
   생깁니다. 이 주소로 먼저 접속해서 사이트가 잘 뜨는지 확인합니다.

여기까지 하면 사이트 자체는 이미 인터넷에 떠 있는 상태입니다. 이제 이 임시 주소
대신 `richmoney-maker.kr`로 접속되게 만드는 작업만 남았습니다.

## 3. 커스텀 도메인 연결: richmoney-maker.kr (가비아 → Vercel)

⚠️ **현재 이 도메인은 가비아 DNS에서 티스토리 블로그(`richmoney-maker.tistory.com`)로
연결되어 있습니다.** 아래 절차는 그 연결을 끊고 Vercel로 새로 연결하는 순서입니다.
DNS를 바꿔도 `richmoney-maker.tistory.com` 기본 주소로는 블로그가 계속 남아있으니
급하게 백업할 내용은 없습니다.

### 3-1. Vercel 프로젝트에 도메인 추가하고, 실제 값 확인하기

1. Vercel 대시보드 → 방금 만든 프로젝트 클릭 → **Settings → Domains**로 이동합니다.
2. 입력창에 `richmoney-maker.kr`을 입력하고 **Add**를 누릅니다.
3. Vercel이 `www.richmoney-maker.kr`도 함께 추가할지 물어보면 **추가하는 것을
   권장**합니다(뒤에서 `www` → 루트 도메인으로 리다이렉트되도록 설정합니다).
4. 도메인을 추가하면 화면에 **A 레코드 값**(루트 도메인용 숫자 주소)과 **CNAME 대상
   값**(www용)이 표시됩니다. 이 두 값을 메모장 같은 곳에 복사해 둡니다.

   > ⚠️ **주의**: A 레코드 IP는 프로젝트마다 다를 수 있습니다(`76.76.21.21`이 흔하지만
   > 최근 생성된 프로젝트는 `216.198.79.1` 등 다른 값이 배정되기도 합니다). CNAME 대상도
   > `xxxxxxxxxxxxxxxx.vercel-dns-XXX.com` 형태로 프로젝트마다 고유합니다. **이 문서의
   > 예시 값이 아니라, 지금 내 Vercel 화면(도메인 카드)에 표시된 값을 그대로 사용**하세요.

### 3-2. 가비아 DNS에서 기존 티스토리 레코드 정리

1. [가비아](https://www.gabia.com) 로그인 → 우측 상단 **My가비아** 클릭 → **서비스
   관리** 메뉴에서 `richmoney-maker.kr`을 찾아 **DNS 관리(DNS 정보)** 버튼을 클릭합니다.
2. **DNS 설정** 화면에서 현재 레코드 목록을 확인합니다. 티스토리 연결 시 보통 아래와
   비슷한 레코드가 있습니다.
   - 호스트 `@`(또는 공백), 타입 `CNAME` (또는 A), 값 `richmoney-maker.tistory.com.`
   - 호스트 `www`, 타입 `CNAME`, 값 `richmoney-maker.tistory.com.`
3. 이 두 레코드를 **삭제**합니다(수정이 아니라 삭제 후 아래 3-3에서 새로 추가하는
   편이 꼬이지 않습니다).

### 3-3. Vercel용 레코드 추가

같은 **DNS 설정** 화면에서 **레코드 추가**를 눌러 아래 2개를 새로 등록합니다. 값은
반드시 3-1에서 메모해 둔 실제 값으로 넣습니다.

| 타입 | 호스트 | 값 | 비고 |
|---|---|---|---|
| A | `@` | Vercel 도메인 카드에 표시된 IP (예: `76.76.21.21`) | 루트 도메인용. TTL은 기본값 그대로 둡니다 |
| CNAME | `www` | Vercel 도메인 카드에 표시된 CNAME 대상 | 가비아는 CNAME 값 끝에 마침표(`.`)를 붙여야 합니다 |

저장 후 DNS가 전 세계에 퍼지는(전파) 데 보통 수분~최대 24시간이 걸릴 수 있습니다.
바로 안 되더라도 당황하지 말고 몇 시간 뒤 다시 확인해보세요.

### 3-4. Vercel에서 연결 확인 + www 리다이렉트 설정

1. Vercel **Settings → Domains**로 돌아가 `richmoney-maker.kr` 옆에 **Valid
   Configuration**(정상 연결됨) 표시가 뜨는지 확인합니다. 아직 회색이나 경고 표시라면
   DNS 전파를 기다리는 중인 것이니 조금 더 기다립니다.
2. 연결이 확인되면 Vercel이 SSL 인증서(자물쇠 표시)를 자동으로 발급합니다(무료,
   Let's Encrypt). 만약 계속 "Certificate Issuance"(인증서 발급 중) 상태에 머물러
   있다면, 가비아 DNS에 **CAA 레코드**가 남아있는지 확인하고 `letsencrypt.org`를
   허용하도록 수정하거나 그 레코드를 삭제합니다.
3. `www.richmoney-maker.kr` 도메인 카드에서 **Redirect to `richmoney-maker.kr`**(301
   리다이렉트)로 설정해, `www`로 들어와도 루트 도메인으로 자동으로 통일되게 합니다
   (이 사이트의 대표 주소가 `https://richmoney-maker.kr`이기 때문입니다 —
   `src/lib/tools.ts`의 `siteConfig.url`).

### 3-5. 최종 확인 체크리스트

- [ ] 브라우저에서 `https://richmoney-maker.kr` 접속 시 사이트가 정상적으로 뜬다
- [ ] `https://www.richmoney-maker.kr`로 접속해도 루트 도메인으로 자동 리다이렉트된다
- [ ] 주소창에 자물쇠(HTTPS) 표시가 있다
- [ ] `https://richmoney-maker.kr/sitemap.xml`, `/robots.txt`가 정상 응답한다
- [ ] 도메인 만료일(2026-12-22)을 캘린더 등에 등록해 갱신을 놓치지 않는다

## 4. 자주 막히는 부분 (트러블슈팅)

- **몇 시간이 지나도 Vercel에서 계속 "Invalid Configuration"이라고 나와요.**
  가비아 DNS 설정 화면을 다시 열어 A/CNAME 값에 오타가 없는지, 예전 티스토리
  레코드가 삭제 없이 남아 같은 호스트(`@` 또는 `www`)에 레코드가 두 개 이상 겹쳐
  있지 않은지 확인하세요. 같은 호스트에 레코드가 중복되면 연결이 안 됩니다.
- **SSL 인증서가 계속 발급 중 상태예요.** 위 3-4의 CAA 레코드 문제일 가능성이 가장
  높습니다. 그 외에는 DNS 전파가 아직 끝나지 않은 것이니 몇 시간 더 기다려보세요.
- **GitHub에 `git push`가 안 돼요(인증 오류).** 최근 GitHub은 비밀번호 대신 개인
  액세스 토큰(Personal Access Token)이나 GitHub Desktop 앱 로그인을 요구합니다.
  터미널이 익숙하지 않다면 [GitHub Desktop](https://desktop.github.com/) 앱으로
  로그인해서 이 폴더를 저장소로 추가하고 Push 버튼을 누르는 방법이 더 쉽습니다.
- **코드를 수정했는데 사이트에 반영이 안 돼요.** Vercel은 GitHub 저장소에
  `git push`할 때마다 자동으로 새로 빌드·배포합니다. 로컬에서 수정만 하고
  `git add` → `git commit` → `git push`를 안 했다면 반영되지 않습니다.

## 5. 배포 후 다음 순서 (PLAN.md 5주차)

DNS 연결이 끝나면 Google Search Console / 네이버 서치어드바이저에 사이트를 등록하고
사이트맵(`https://richmoney-maker.kr/sitemap.xml`)을 제출합니다. 자세한 내용은
`Claude outputs/PLAN.md`의 4번(SEO 체크리스트), 6번(타임라인) 항목을 참고하세요.
