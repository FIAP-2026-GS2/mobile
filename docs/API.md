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

- `POST /api/auth/register` devolve só o usuário, sem token. O app entra logo em seguida com as
  mesmas credenciais; quando a API passar a devolver o token, o app já usa a resposta direto.
- `POST /api/chat` responde, mas a conversa não aparece em `GET /api/users/me/chat-history`. O app
  mostra as respostas da sessão atual e junta com o histórico assim que a API passar a gravá-lo.
- A API não envia cabeçalhos CORS, então a versão web do app não acessa a API direto do navegador.
  No Android e no iOS isso não se aplica.

## API .NET (envio de fotos para confirmar ou contestar ocorrências)

Planejada, ainda não integrada. A API .NET hoje expõe rotas para a prefeitura e para o serviço de
IA (login com usuários fixos `ADMIN`, `MANAGER`, `VIEWER` e `IA_SERVICE`) e a consulta pública
`GET /api/public/issue-reports`, mas ainda não tem rota para o cidadão enviar uma foto, nem uma URL
publicada. Para o app integrar, ela precisa de:

- uma rota que receba a foto (`multipart/form-data`) e a decisão `CONFIRM` ou `CONTEST` de uma
  ocorrência;
- uma forma de o cidadão se autenticar (aceitar o JWT emitido pela API Java ou um login próprio);
- a URL do deploy no Azure.
