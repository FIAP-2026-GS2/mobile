import { router, type Href } from 'expo-router';

// Volta para a tela anterior; se a tela foi aberta direto (link, notificação), vai para `fallback`
export function goBackOr(fallback: Href) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
