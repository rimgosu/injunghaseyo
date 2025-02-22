- 매일 인증하고 돈 벌기

## 1. settings

### envs

- 백엔드 환경 변수 설정 (./packages/backend/envs/.example.env 참고)

```text
./packages/backend/envs/.dev.env
./packages/backend/envs/.sdk.env
./packages/backend/envs/.prod.env
```

### .npmrc

- libs 라이브러리 업데이트를 위한 세팅

```text
./packages/libs/.npmrc
```

- npm registry login

```bash
npm login --registry=https://npm.pkg.github.com --scope=@rimgosu
```

### 라이브러리 및 백엔드 준비

1. yarn install

```bash
yarn install
```

2. docker up

```bash
docker compose -f docker-compose.db.yaml up -d --build
```

3. prisma init

```bash
yarn prisma:setting
```

### sdk update

- 백엔드 DTO 추가 및 변경 시 sdk를 업데이트 한다.

```bash
yarn gen:sdk
```

## 2. run

```bash
yarn dev
```

## 3. refs - 외부 공개용

<https://excalidraw.com/#room=34381f295846e1bd7b81,--VWceRNTk4H76ekFOwe0w>
