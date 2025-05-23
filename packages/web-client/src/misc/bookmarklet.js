const check_iframe_support = async () => {
  const title = document.title;
  const og_title_element = document.querySelector('meta[property="og:title"]');
  if (!og_title_element) return false;
  const og_title_content = og_title_element.getAttribute('content');
  if (title.toLowerCase().includes(og_title_content.toLowerCase())) return false;

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
    if (csp && csp.includes('frame-ancestors')) {
      const frame_ancestors = csp.match(/frame-ancestors\s+([^;]+)/);
      if (frame_ancestors) {
        const sources = frame_ancestors[1].split(' ');
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

check_iframe_support().then((supports_iframe) => {
  if (supports_iframe) {
    const iframe = document.createElement('iframe');
    iframe.src = location.href;
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    iframe.addEventListener('load', () => {
      const doc = iframe.contentWindow.document;
      const target_url =
        'https://taaabs.com/library#url=' +
        encodeURIComponent(document.location.href) +
        '&title=' +
        encodeURIComponent(doc.title) +
        '&description=' +
        (doc.querySelector("meta[name='description']") != null
          ? doc.querySelector("meta[name='description']").content
          : '') +
        '&v=1';
      window.location.assign(target_url);
    });
  } else {
    const target_url =
      'https://taaabs.com/library#url=' +
      encodeURIComponent(document.location.href) +
      '&title=' +
      encodeURIComponent(document.title) +
      '&description=' +
      (document.querySelector("meta[name='description']") != null
        ? document.querySelector("meta[name='description']").content
        : '') +
      '&v=1';
    window.location.assign(target_url);
  }
});