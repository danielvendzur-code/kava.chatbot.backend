(() => {
  'use strict';

  if (document.body?.dataset?.cosmeticsDemo !== 'kvitok') return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914g';
  const launcher = document.querySelector('#cx-open');
  const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');

  let launcherMark = null;
  if (launcher) {
    launcherMark = document.createElement('img');
    launcherMark.src = src;
    launcherMark.alt = 'Kvitok';
    launcherMark.className = 'cx-kvitok-direct-mark';
    launcherMark.decoding = 'async';
    launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark', 'cx-kvitok-processing', 'cx-kvitok-logo-ready');
    launcher.classList.add('cx-launcher-has-image-logo');
    launcher.replaceChildren(launcherMark);
  }

  /* Extract only the real Kvitok lettering from the original badge. The source
     PNG contains its own circular rim, so using the complete image can never
     produce the requested clean single-colour launcher. */
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    const width = Math.max(1, image.naturalWidth || image.width);
    const height = Math.max(1, image.naturalHeight || image.height);
    const source = document.createElement('canvas');
    source.width = width;
    source.height = height;
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    if (!sourceCtx) return;
    sourceCtx.drawImage(image, 0, 0, width, height);

    let sourceData;
    try { sourceData = sourceCtx.getImageData(0, 0, width, height); }
    catch (_) { return; }

    const launcherData = sourceCtx.createImageData(width, height);
    const headerData = sourceCtx.createImageData(width, height);
    const input = sourceData.data;
    const launchPx = launcherData.data;
    const headerPx = headerData.data;
    let minX = width, minY = height, maxX = -1, maxY = -1;
    let visible = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const alpha = input[i + 3];
        if (alpha < 8) continue;

        /* The real script sits in the middle of the badge. These bounds exclude
           the original circular rim before colour filtering is applied. */
        const nx = x / width;
        const ny = y / height;
        if (nx < 0.14 || nx > 0.86 || ny < 0.31 || ny > 0.69) continue;

        const lum = 0.2126 * input[i] + 0.7152 * input[i + 1] + 0.0722 * input[i + 2];
        if (lum >= 154) continue;

        const edge = lum > 118 ? Math.max(0, Math.min(1, (154 - lum) / 36)) : 1;
        const outAlpha = Math.round(alpha * edge);
        if (outAlpha <= 10) continue;

        /* Launcher keeps the actual dark colour from the real logo. */
        launchPx[i] = input[i];
        launchPx[i + 1] = input[i + 1];
        launchPx[i + 2] = input[i + 2];
        launchPx[i + 3] = outAlpha;

        /* Header uses the same extracted real lettering, recoloured white for
           contrast on the green header, matching the approved previous look. */
        headerPx[i] = 255;
        headerPx[i + 1] = 255;
        headerPx[i + 2] = 255;
        headerPx[i + 3] = outAlpha;

        visible += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (visible < 40 || maxX < minX || maxY < minY) return;

    const pad = 3;
    const sx = Math.max(0, minX - pad);
    const sy = Math.max(0, minY - pad);
    const sw = Math.min(width - sx, maxX - minX + 1 + pad * 2);
    const sh = Math.min(height - sy, maxY - minY + 1 + pad * 2);

    const cropData = (data) => {
      const full = document.createElement('canvas');
      full.width = width;
      full.height = height;
      const fullCtx = full.getContext('2d');
      if (!fullCtx) return null;
      fullCtx.putImageData(data, 0, 0);
      const cropped = document.createElement('canvas');
      cropped.width = sw;
      cropped.height = sh;
      const croppedCtx = cropped.getContext('2d');
      if (!croppedCtx) return null;
      croppedCtx.drawImage(full, sx, sy, sw, sh, 0, 0, sw, sh);
      return cropped.toDataURL('image/png');
    };

    const launcherUrl = cropData(launcherData);
    if (launcherMark && launcherUrl) {
      launcherMark.src = launcherUrl;
      launcherMark.className = 'cx-kvitok-direct-mark cx-kvitok-launcher-clean';
    }

    const headerUrl = cropData(headerData);
    if (headerLogo && headerUrl) {
      headerLogo.src = headerUrl;
      headerLogo.classList.add('cx-kvitok-header-clean');
    }
  };
  image.src = src;
})();
