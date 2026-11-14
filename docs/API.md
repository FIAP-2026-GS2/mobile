# Contrato da API (consumida pelo app)

Este é o contrato que o app espera da **API Java (Spring Boot)**. A pasta `mock-api/` implementa
exatamente estas rotas em memória, só para desenvolver o app enquanto a API real não está no ar.

- Base URL configurada por `EXPO_PUBLIC_API_URL`.
- JSON em camelCase; datas com horário em ISO-8601 (`2026-11-12T10:30:00Z`), datas sem horário em `yyyy-MM-dd`.
- Autenticação: `Authorization: Bearer <JWT>` em todas as rotas, exceto `/auth/login` e `/auth/register`.
- Papéis (`userType`): `CITIZEN` (cidadão) e `MANAGER` (gestor de zeladoria). Rotas marcadas com 🔒 exigem `MANAGER` (403 para os outros).
- Todo `POST` envia o cabeçalho `Idempotency-Key` (UUID). A API deve devolver a mesma resposta se receber a mesma chave de novo, sem repetir a operação.
- Erros seguem o `@RestControllerAdvice`:

```json
{
  "status": 400,
  "message": "Confira os dados informados.",
  "errors": { "title": "Título muito curto." }
}
```

`errors` também pode ser uma lista `[{ "field": "title", "message": "..." }]`. O app mostra cada mensagem no campo correspondente.
Para `429 Too Many Requests` (rate limiting), o app mostra "Muitas tentativas em pouco tempo".

## Autenticação

| Método | Rota             | Corpo                       | Resposta                                      |
| ------ | ---------------- | --------------------------- | --------------------------------------------- |
| POST   | `/auth/register` | `{ name, email, password }` | `201 { token, user }` (sempre cria `CITIZEN`) |
| POST   | `/auth/login`    | `{ email, password }`       | `200 { token, user }` ou `401`                |
| GET    | `/auth/me`       | –                           | `200 user`                                    |

`user`: `{ id, name, email, userType, registrationDate }`

## Ocorrências (`ISSUE_REPORT` + `ISSUE_HISTORY`)

| Método   | Rota                                                                        | Observação                                                               |
| -------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| GET      | `/issue-reports?page=0&size=10&sort=openingDate,desc&status=OPEN&mine=true` | Paginado (`Page<T>` do Spring). `mine=true` filtra pelo usuário do token |
| GET      | `/issue-reports/{id}`                                                       | Inclui `history` (linha do tempo)                                        |
| POST     | `/issue-reports`                                                            | Cidadão cria relato (`source = CITIZEN`, `status = OPEN`)                |
| PUT      | `/issue-reports/{id}`                                                       | Só o autor e só com `status = OPEN`                                      |
| DELETE   | `/issue-reports/{id}`                                                       | Só o autor e só com `status = OPEN` → `204`                              |
| PATCH 🔒 | `/issue-reports/{id}/status`                                                | `{ status, notes }` → grava linha em `ISSUE_HISTORY`                     |

Corpo de POST/PUT:

```json
{
  "title": "Poste apagado",
  "description": "Há três noites...",
  "severity": "HIGH",
  "issueTypeId": 1,
  "monitoringPointId": 1
}
```

Resposta (`IssueReport`):

```json
{
  "id": 1,
  "title": "...",
  "description": "...",
  "source": "CITIZEN",
  "severity": "HIGH",
  "status": "IN_PROGRESS",
  "openingDate": "...",
  "resolutionDate": null,
  "issueType": { "id": 1, "name": "Poste apagado", "category": "Iluminação" },
  "monitoringPoint": {
    "id": 1,
    "street": "Av. Paulista",
    "streetNumber": "1578",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "latitude": -23.56,
    "longitude": -46.65
  },
  "reportedBy": { "id": 1, "name": "Ana" },
  "detection": null,
  "history": [
    {
      "id": 1,
      "previousStatus": null,
      "newStatus": "OPEN",
      "notes": "...",
      "changeDate": "...",
      "changedBy": "Ana"
    }
  ]
}
```

Enums: `status` = `OPEN | IN_PROGRESS | RESOLVED | CANCELLED`; `severity` = `LOW | MEDIUM | HIGH | CRITICAL`; `source` = `CITIZEN | CAMERA`.

## Catálogos

| Método | Rota                                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/issue-types`                                                                                                              |
| GET    | `/monitoring-points`                                                                                                        |
| GET 🔒 | `/cameras` (cada câmera traz `monitoringPoint`)                                                                             |
| GET    | `/dashboard/summary` → `{ openIssues, inProgressIssues, resolvedIssues, pendingDetections, activeSchedules, myOpenIssues }` |

## Agendas de captura 🔒 (`CAPTURE_SCHEDULE`)

| Método | Rota                              |
| ------ | --------------------------------- |
| GET    | `/capture-schedules`              |
| GET    | `/capture-schedules/{id}`         |
| POST   | `/capture-schedules`              |
| PUT    | `/capture-schedules/{id}`         |
| DELETE | `/capture-schedules/{id}` → `204` |

```json
{
  "cameraId": 1,
  "frequency": "WEEKLY",
  "weekday": 1,
  "dayOfMonth": null,
  "executionTime": "22:00",
  "startDate": "2026-11-12",
  "endDate": null,
  "isActive": true
}
```

`frequency` = `WEEKLY` (usa `weekday` 1=segunda … 7=domingo) ou `MONTHLY` (usa `dayOfMonth` 1–28). A resposta troca `cameraId` por `camera`.

## Detecções da IA 🔒 (`AI_DETECTION` + `AI_ANALYSIS` + `CAPTURE`)

| Método | Rota                                  | Observação                                                    |
| ------ | ------------------------------------- | ------------------------------------------------------------- |
| GET    | `/ai-detections?reviewStatus=PENDING` | `PENDING                                                      | CONFIRMED | DISMISSED` |
| GET    | `/ai-detections/{id}`                 |                                                               |
| POST   | `/ai-detections/{id}/confirm`         | Cria `ISSUE_REPORT` com `source = CAMERA` → `201 IssueReport` |
| POST   | `/ai-detections/{id}/dismiss`         | Marca como falso positivo                                     |

```json
{
  "id": 11,
  "confidenceScore": 0.87,
  "estimatedSeverity": "HIGH",
  "description": "Texto gerado pelo LLM (Spring AI) a partir da detecção",
  "aiModel": "YOLOv8-zeladoria",
  "imageUrl": null,
  "reviewStatus": "PENDING",
  "detectionCoordinates": "220,40,300,380",
  "analysis": { "modelVersion": "1.2", "analysisDate": "...", "processingTimeMs": 760 },
  "capture": {
    "id": 101,
    "captureDate": "...",
    "camera": { "id": 1, "cameraCode": "CAM-BV-0142" },
    "monitoringPoint": {}
  },
  "suggestedIssueType": { "id": 1, "name": "Poste apagado", "category": "Iluminação" },
  "issueReportId": null
}
```

## Diferenças em relação ao modelo ER atual

O app precisa de alguns campos que ainda não aparecem no diagrama:

- `ISSUE_REPORT.ID_POINT` (FK para `MONITORING_POINT`): onde fica o problema relatado pelo cidadão.
- `CAPTURE_SCHEDULE.FREQUENCY` e `CAPTURE_SCHEDULE.DAY_OF_MONTH`: para agendas mensais, além das semanais.
- `reviewStatus` da detecção pode ser derivado (`PENDING` = sem ocorrência e não descartada) ou virar uma coluna em `AI_DETECTION`.
- `suggestedIssueType` pode vir da relação `AI_DETECTION → ISSUE_TYPE` que já existe no diagrama.
