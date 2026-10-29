const repository = 'a-lavreniuk/Artist-Reference-Collection';
const releasesUrl = `https://api.github.com/repos/${repository}/releases?per_page=10`;
const githubReleasesUrl = `https://github.com/${repository}/releases`;

const ctaButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-open-beta]'));
const betaDialog = document.querySelector<HTMLDialogElement>('#beta-dialog');
const releaseNote = document.querySelector<HTMLElement>('#release-note');

for (const button of ctaButtons) {
  button.addEventListener('click', () => {
    const downloadUrl = button.dataset.downloadUrl;
    if (downloadUrl) {
      window.location.assign(downloadUrl);
      return;
    }
    if (button.dataset.githubFallback === 'true') {
      window.location.assign(githubReleasesUrl);
      return;
    }
    betaDialog?.showModal();
  });
}

function setReleaseCta(label: string, note: string, downloadUrl?: string, fallback = false) {
  for (const button of ctaButtons) {
    button.innerHTML = `${label} <span aria-hidden="true">${downloadUrl ? '↓' : '↗'}</span>`;
    button.setAttribute('aria-label', label);
    if (downloadUrl) button.dataset.downloadUrl = downloadUrl;
    if (fallback) button.dataset.githubFallback = 'true';
  }
  if (releaseNote) releaseNote.textContent = note;
}

async function initializeReleaseCta() {
  try {
    const response = await fetch(releasesUrl, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub Releases returned ${response.status}`);
    const releases = await response.json() as Array<{
      draft: boolean;
      prerelease: boolean;
      tag_name: string;
      assets: Array<{ name: string; browser_download_url: string }>;
    }>;
    if (releases.length === 0) return;

    const release = releases.find((item) => !item.draft && item.assets.some((asset) => /^ARC-Setup-.+\.exe$/i.test(asset.name)));
    if (!release) {
      setReleaseCta('Посмотреть релизы', 'Ссылка на релизы приложения ARC на GitHub.', undefined, true);
      return;
    }
    const installer = release.assets.find((asset) => /^ARC-Setup-.+\.exe$/i.test(asset.name));
    if (!installer) {
      setReleaseCta('Посмотреть релизы', 'Не удалось найти установщик. Откройте страницу релизов ARC.', undefined, true);
      return;
    }
    const versionLabel = release.prerelease ? `Скачать prerelease ${release.tag_name}` : `Скачать ARC ${release.tag_name}`;
    const releaseDescription = release.prerelease
      ? `Предварительная версия ${release.tag_name} · prerelease`
      : `Актуальная версия ARC ${release.tag_name} для Windows`;
    setReleaseCta(versionLabel, releaseDescription, installer.browser_download_url);
  } catch {
    setReleaseCta('Открыть релизы GitHub', 'Не получилось проверить обновление. Посмотрите доступные сборки ARC на GitHub.', undefined, true);
  }
}

void initializeReleaseCta();
