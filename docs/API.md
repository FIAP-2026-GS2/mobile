# APIs consumidas pelo app

## API Java (SampaTech - Portal da Transparência)

- Produção: `https://sampatech-portal.onrender.com` (Swagger em `/swagger-ui.html`)
- Outro servidor: defina `EXPO_PUBLIC_API_URL`.
- Autenticação: `Authorization: Bearer <JWT>`; o token fica salvo no `expo-secure-store`.

| Funcionalidade do app                                              | Método e rota                    | Arquivo                                       |
| ------------------------------------------------------------------ | -------------------------------- | --------------------------------------------- |
| Cadastro                                                           | `POST /api/auth/register`        | `src/api/auth.api.ts`                         |
| Login                                                              | `POST /api/auth/login`           | `src/api/auth.api.ts`                         |
| Restaurar sessão / ver perfil                                      | `GET /api/users/me`              | `src/api/auth.api.ts`, `src/api/users.api.ts` |
| Editar perfil (nome e senha)                                       | `PUT /api/users/me`              | `src/api/users.api.ts`                        |
| Excluir conta                                                      | `DELETE /api/users/me`           | `src/api/users.api.ts`                        |
| Lista de ocorrências (filtros por status, tipo e bairro; paginada) | `GET /api/issues`                | `src/api/issues.api.ts`                       |
| Detalhe e histórico da ocorrência                                  | `GET /api/issues/{id}`           | `src/api/issues.api.ts`                       |
| Tipos de problema (filtro)                                         | `GET /api/issue-types`           | `src/api/issues.api.ts`                       |
| Assistente com IA (Spring AI)                                      | `POST /api/chat`                 | `src/api/assistant.api.ts`                    |
| Histórico do assistente                                            | `GET /api/users/me/chat-history` | `src/api/assistant.api.ts`                    |

O **CRUD** exigido em Mobile é o do próprio usuário: criar (cadastro), ler (perfil), atualizar
(editar perfil) e excluir (excluir conta), todos pela API Java.

### Pontos em aberto na API Java

- `POST /api/chat` responde, mas a conversa não aparece em `GET /api/users/me/chat-history`. O app
  mostra as respostas da sessão atual e junta com o histórico assim que a API passar a gravá-lo.
- A API não envia cabeçalhos CORS, então a versão web do app não acessa a API direto do navegador.
  No Android e no iOS isso não se aplica.

## API .NET (conferência do conserto com foto)

- Produção: `http://sampatech-gs2devops.centralus.azurecontainer.io:8080` (Swagger em `/swagger`). Como é HTTP, o `app.json` libera esse tráfego no Android (`expo-build-properties`). Outro servidor: defina `EXPO_PUBLIC_DOTNET_API_URL`.
- Autenticação: o mesmo JWT emitido pela API Java. A .NET aceita dele só o papel `CITIZEN`; para
  agentes e administradores o app avisa que só contas de cidadão enviam fotos.
- A Java e a .NET têm bancos separados, então a lista da tela **Conferir** vem da própria .NET
  (os ids das ocorrências não são os mesmos nas duas APIs).

| Funcionalidade do app                            | Método e rota                                   | Arquivo                          |
| ------------------------------------------------ | ----------------------------------------------- | -------------------------------- |
| Ocorrências resolvidas para conferir (sem login) | `GET /api/public/issue-reports?status=RESOLVED` | `src/api/citizenFeedback.api.ts` |
| Confirmar ou contestar o conserto com foto       | `POST /api/issue-reports/{id}/citizen-feedback` | `src/api/citizenFeedback.api.ts` |

O envio é `multipart/form-data` com `decision` (`CONFIRM` ou `CONTEST`), `notes` (obrigatório para
contestar), `latitude`, `longitude` e `photo` (JPEG ou PNG, tirado na hora pela câmera ou escolhido da galeria do celular), mais o
cabeçalho `Idempotency-Key`. A IA da .NET borra rostos e placas e confere se a foto mostra o local;
o relato fica `PENDING` até alguém da equipe aprovar. Confirmações e contestações aprovadas
aparecem nos contadores da lista (`citizenConfirmations` e `citizenContests`).
