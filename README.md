<div align="center">
  <img src="./assets/images/icon.png" alt="Logo Smart Sampa Zeladoria" width="110" />

# Smart Sampa Zeladoria

Câmeras que já existem na cidade cuidando de postes, ruas e semáforos.

</div>

---

## Sobre o projeto

O Smart Sampa já conecta dezenas de milhares de câmeras em São Paulo, hoje voltadas para a
segurança. Muitas delas, por acaso ou conveniência, enxergam postes, vias e semáforos. Esta
solução (Global Solution FIAP 2026/2, tema **CitizenTech**) reaproveita essas câmeras para a
**zeladoria urbana**:

1. O gestor cria uma **agenda de captura** semanal ou mensal para cada câmera.
2. A imagem capturada passa por **visão computacional** e um **LLM** descreve o problema encontrado.
3. O gestor revisa a detecção. Se for real, ela vira uma **ocorrência** para a equipe da subprefeitura.
4. O **cidadão** também relata problemas e acompanha o atendimento pela linha do tempo.

> Projeto acadêmico. Não é um aplicativo oficial da Prefeitura de São Paulo.

## Funcionalidades

| Perfil  | Telas                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| Todos   | Login, Cadastro, Início, Ocorrências (lista com filtros e paginação), Detalhe da ocorrência, Conta, Sobre o app |
| Cidadão | Relatar problema, editar e excluir o próprio relato enquanto estiver aberto                                     |
| Gestor  | Painel, Detecções da IA (confirmar ou descartar), Agendas de captura (CRUD), mudar status da ocorrência         |

- **Autenticação** com JWT da API Java: cadastro, login, sessão salva no `expo-secure-store`, logout e rotas protegidas por papel (`Stack.Protected` / `Tabs.Protected`).
- **CRUDs pela API**: ocorrências (cidadão) e agendas de captura (gestor).
- **Feedback visual**: loaders, mensagens de erro em português, "Tentar novamente", puxar para atualizar.
- **Idempotência**: todo `POST` envia `Idempotency-Key`, então um toque duplo não cria registro repetido.
- **Tema** escuro (padrão, como o Smart Sampa Cidadão) e claro, com fonte Montserrat.
- **Sobre o app** mostra o hash do commit da build publicada.

## Tecnologias

- React Native + Expo SDK 58, TypeScript
- Expo Router (navegação por arquivos, rotas protegidas)
- Axios + TanStack Query (camada de acesso à API e cache)
- expo-secure-store (token JWT)
- @expo-google-fonts/montserrat, @expo/vector-icons
- ESLint (`eslint-config-expo`) + Prettier

## Estrutura

```
src/
  app/            rotas (cada arquivo é uma tela)
    (app)/        área logada
      (tabs)/     abas: início, ocorrências, detecções, agendas, conta
  api/            cliente Axios, erros e chamadas por recurso
  components/     componentes de interface (ui/, issues/, monitoring/)
  context/        AuthProvider
  hooks/          queries e mutations do TanStack Query
  storage/        armazenamento seguro de preferências e token
  theme/          cores, tipografia, espaçamentos e ThemeProvider
  types/          tipos do domínio (espelham o modelo relacional)
  utils/          formatação, rótulos e validação
docs/API.md       contrato esperado da API Java
mock-api/         API simulada só para desenvolvimento
```

## Como executar

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador Android).

```bash
git clone https://github.com/FIAP-2026-GS2/mobile.git
```

```bash
cd mobile && npm install
```

Apontando para a API Java publicada:

```bash
EXPO_PUBLIC_API_URL=https://<url-da-api> npx expo start
```

Para desenvolver sem a API Java, use a API simulada (dados em memória):

```bash
npm run mock-api
```

```bash
EXPO_PUBLIC_API_URL=http://<ip-do-computador>:8080 npx expo start
```

Usuários de teste da API simulada: `cidadao@teste.com` e `gestor@teste.com`, senha `senha123`.

Verificações de qualidade:

```bash
npm run lint
npm run typecheck
npm run format:check
```

## Publicação

O app é distribuído pelo **Firebase App Distribution** (APK gerado com EAS Build). A tela
**Conta → Sobre o app** mostra o commit de referência da versão publicada.

## Vídeo de apresentação

_Link do YouTube será adicionado aqui._

## Equipe

_Nome e RM dos integrantes._

## Uso de IA generativa

Ferramentas de IA foram usadas como apoio no desenvolvimento (estrutura inicial do projeto,
revisão de código e textos). Todo o código foi revisado e testado pela equipe.
