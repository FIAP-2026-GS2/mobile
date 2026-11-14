const { execSync } = require('child_process');

// Hash do commit exibido na tela "Sobre o app".
// No EAS Build ele vem da variável do build; localmente, do próprio git.
function getCommitHash() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  }
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: getCommitHash(),
  },
});
