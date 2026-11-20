<div align="center">
  <img src="./assets/images/icon.png" alt="Logo Smart Sampa Zeladoria" width="110" />

# Smart Sampa Zeladoria

Câmeras que já existem na cidade cuidando de postes, ruas e calçadas.

</div>

---

## Sobre o projeto

O Smart Sampa já conecta dezenas de milhares de câmeras em São Paulo, hoje voltadas para a
segurança. Muitas delas, por acaso ou conveniência, enxergam postes, vias e calçadas. Esta
solução (Global Solution FIAP 2026/2, tema **CitizenTech**) reaproveita essas câmeras para a
**zeladoria urbana**: a IA encontra problemas nas imagens, a prefeitura valida e atende, e o
cidadão acompanha tudo por este aplicativo.

> Projeto acadêmico. Não é um aplicativo oficial da Prefeitura de São Paulo.

## Funcionalidades

| Tela                  | O que faz                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entrar / Criar conta  | Login e cadastro com JWT da API Java, validação dos campos e mensagens de erro                                                                                               |
| Início                | Totais de ocorrências abertas, em atendimento e resolvidas, e as mais recentes                                                                                               |
| Ocorrências           | Lista paginada com filtros por status, tipo de problema e bairro                                                                                                             |
| Detalhe da ocorrência | Dados, linha do tempo do atendimento, abrir no mapa e perguntar ao assistente                                                                                                |
| Conferir              | Ocorrências que a prefeitura marcou como resolvidas (API .NET), com quantos cidadãos já confirmaram ou contestaram                                                           |
| Conferir conserto     | O cidadão tira uma foto no local (ou escolhe uma da galeria) e confirma o conserto ou contesta, contando o que continua errado; a IA borra rostos e placas e a equipe aprova |
| Assistente            | Chat com IA (Spring AI) que responde com base nas ocorrências registradas                                                                                                    |
| Conta                 | Perfil, tema claro/escuro, sair e excluir conta                                                                                                                              |
| Editar perfil         | Troca de nome e senha                                                                                                                                                        |
| Sobre o app           | Versão, plataforma e hash do commit da build publicada                                                                                                                       |

- **CRUD pela API Java**: o usuário cria a conta, consulta o perfil, edita nome e senha e exclui a conta.
- **Rotas protegidas**: sem login, só as telas de entrar e criar conta existem (`Stack.Protected`).
  O logout apaga o token salvo e volta para o login.
- **Mesma navegação para todos os perfis** (cidadão, agente e administrador).
- **Feedback visual**: carregamento, mensagens de erro em português, "Tentar novamente" e puxar para atualizar.

## Tecnologias

- React Native + Expo SDK 58, TypeScript
- Expo Router (navegação por arquivos e rotas protegidas)
- Axios + TanStack Query (acesso à API e cache)
- expo-secure-store (token JWT)
- @expo-google-fonts/montserrat, @expo/vector-icons
- ESLint (`eslint-config-expo`) + Prettier

## Estrutura

```
src/
  app/            rotas (cada arquivo é uma tela)
    (app)/        área logada
      (tabs)/     abas: início, ocorrências, conferir, assistente, conta
  api/            cliente Axios, erros e chamadas por recurso
  components/     componentes de interface (ui/, issues/, citizenFeedback/, assistant/)
  context/        AuthProvider (sessão)
  hooks/          queries e mutations do TanStack Query
  storage/        armazenamento seguro do token e das preferências
  theme/          cores, tipografia, espaçamentos e ThemeProvider
  types/          tipos do domínio no formato da API
  utils/          formatação, rótulos e validação
docs/API.md       rotas usadas de cada API
```

## Como executar

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador Android).

```bash
git clone https://github.com/FIAP-2026-GS2/mobile.git
```

```bash
cd mobile && npm install
```

```bash
npx expo start
```

O app usa a API Java publicada em `https://sampatech-portal.onrender.com`. Para apontar para outro
servidor:

```bash
EXPO_PUBLIC_API_URL=http://<ip-do-computador>:8080 npx expo start
```

A tela **Conferir** usa a API .NET publicada em `http://sampatech-mobile-gs2devops.centralus.azurecontainer.io:8080`. Para apontar para outro servidor:

```bash
EXPO_PUBLIC_DOTNET_API_URL=https://<url-da-api-dotnet> npx expo start
```

Verificações de qualidade:

```bash
npm run lint
```

```bash
npm run typecheck
```

```bash
npm run format:check
```

## Publicação

O app é distribuído pelo **Firebase App Distribution** (APK gerado com EAS Build). A tela
**Conta → Sobre o app** mostra o commit de referência da versão publicada.

## Vídeo de apresentação

_Link do YouTube será adicionado aqui._

## Equipe

| Nome                        | RM       | Turma  |
| --------------------------- | -------- | ------ |
| Ana Carolina Pereira Fontes | RM562145 | 2TDSPV |
| João Victor Nascimento Adão | RM563409 | 2TDSPX |
| Johnny Dias Mathias Junior  | RM566516 | 2TDSPX |
| Luisa Ganasevici de Abreu   | RM563403 | 2TDSPV |
| Matheus Moya de Oliveira    | RM562822 | 2TDSPV |

## Uso de IA generativa

**Ferramenta:** Claude Code (Anthropic), usado como apoio na estrutura do projeto, na integração
com as APIs, na revisão de código e nos testes. Cada etapa foi testada no app contra a API real e
revisada pela equipe antes do commit.
