const fill_clipboard = async (doc) => {
  const get_og_image_url = () => {
    const meta_tags = doc.getElementsByTagName('meta');
    for (let i = 0; i < meta_tags.length; i++) {
      if (meta_tags[i].getAttribute('property') == 'og:image') {
        return meta_tags[i].getAttribute('content');
      }
    }
  };
  const get_favicon_url = () => {
    const link_tags = doc.getElementsByTagName('link');
    const favicon_rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
    for (let i = 0; i < link_tags.length; i++) {
      if (favicon_rels.includes(link_tags[i].getAttribute('rel'))) {
        return link_tags[i].getAttribute('href');
      }
    }
    return new URL(window.location.href).origin + '/favicon.ico';
  };
  const get_base64_of_image_url = async (url, width, height) => {
    const img = doc.createElement('img');
    img.src = url;
    img.setAttribute('crossorigin', 'anonymous');
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Image not found'));
    });
    const canvas = doc.createElement('canvas');
    canvas.width = width || img.width;
    canvas.height = height || img.height;
    const ctx = canvas.getContext('2d');
    if (width && height) {
      ctx.drawImage(img, 0, 0, width, height);
    } else {
      ctx.drawImage(img, 0, 0);
    }
    return canvas.toDataURL('image/webp');
  };
  const og_image_url = get_og_image_url();
  let og_image = undefined;
  if (og_image_url) {
    try {
      og_image = await get_base64_of_image_url(og_image_url);
    } catch {}
  }
  let favicon = undefined;
  try {
    favicon = await get_base64_of_image_url(get_favicon_url(), 32, 32);
  } catch {}
  const html = doc.getElementsByTagName('html')[0].outerHTML;
  navigator.clipboard.writeText(JSON.stringify({ favicon, og_image, html }));
};

const check_iframe_support = async () => {
  try {
    const response = await fetch(window.location.href);
    const headers = response.headers;

    const x_frame_options = headers.get('X-Frame-Options');
    if (x_frame_options) {
      if (x_frame_options === 'DENY') {
        return false;
      }
    }

    const csp = headers.get('Content-Security-Policy');
    console.log(csp);
    if (csp && csp.includes('frame-ancestors')) {
      const frame_ancestors = csp.match(/frame-ancestors\s+([^;]+)/);
      console.log(frame_ancestors);
      if (frame_ancestors) {
        const sources = frame_ancestors[1].split(' ');
        console.log(sources);
        if (!sources.includes('*') && !sources.includes('self')) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking iframe support:', error);
    return false;
  }
};

check_iframe_support().then(async (supports_iframe) => {
  if (supports_iframe) {
    document.write(
      `<iframe src="${location.href}" style="visibility: hidden;">`
    );
    document
      .getElementsByTagName('iframe')[0]
      .addEventListener('load', async () => {
        const doc =
          document.getElementsByTagName('iframe')[0].contentWindow.document;
        await fill_clipboard(doc);
        const target_url =
          'https://taaabs.com/library#url=' +
          encodeURIComponent(document.location) +
          '&title=' +
          encodeURIComponent(doc.title) +
          '&description=' +
          (doc.querySelector("meta[name='description']") != null
            ? doc.querySelector("meta[name='description']").content
            : '') +
          '&bookmarklet_version=1';
        window.location.assign(target_url);
      });
  } else {
    await fill_clipboard(document);
    const target_url =
      'https://taaabs.com/library#url=' +
      encodeURIComponent(document.location) +
      '&title=' +
      encodeURIComponent(document.title) +
      '&description=' +
      (document.querySelector("meta[name='description']") != null
        ? document.querySelector("meta[name='description']").content
        : '') +
      '&bookmarklet_version=1';
    window.location.assign(target_url);
  }
});
