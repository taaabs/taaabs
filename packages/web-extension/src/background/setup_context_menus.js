export function setup_context_menus() {
  chrome.contextMenus.create({
    id: 'save_to_taaabs',
    title: 'Save to taaabs',
    contexts: ['page'],
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (
      tab.url.startsWith('https://taaabs.com') ||
      tab.url.startsWith('chrome://')
    ) {
      return
    }
    if (info.menuItemId == 'save_to_taaabs') {
      execute_bookmarklet_script(tab)
    }
  })

  chrome.action.onClicked.addListener((tab) => {
    console.log('action menu clicked')
    if (
      tab.url.startsWith('https://taaabs.com') ||
      tab.url.startsWith('chrome://')
    ) {
      chrome.tabs.update(tab.id, { url: 'https://taaabs.com/library' })
      return
    }
    execute_bookmarklet_script(tab)
  })
}

function execute_bookmarklet_script(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const fill_clipboard = async (doc) => {
        const get_og_image_url = () => {
          const meta_tags = doc.getElementsByTagName('meta')
          for (let i = 0; i < meta_tags.length; i++) {
            if (meta_tags[i].getAttribute('property') == 'og:image') {
              return meta_tags[i].getAttribute('content')
            }
          }
        }
        const get_favicon_url = () => {
          const link_tags = doc.getElementsByTagName('link')
          const favicon_rels = ['icon', 'shortcut icon', 'apple-touch-icon']
          for (let i = 0; i < link_tags.length; i++) {
            if (favicon_rels.includes(link_tags[i].getAttribute('rel'))) {
              return link_tags[i].getAttribute('href')
            }
          }
          return new URL(window.location.href).origin + '/favicon.ico'
        }
        const get_base64_of_image_url = async (url, width, height) => {
          const img = doc.createElement('img')
          img.src = url
          img.setAttribute('crossorigin', 'anonymous')
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = () => reject(new Error('Image not found'))
          })
          const canvas = doc.createElement('canvas')
          canvas.width = width || img.width
          canvas.height = height || img.height
          const ctx = canvas.getContext('2d')
          if (width && height) {
            ctx.drawImage(img, 0, 0, width, height)
          } else {
            ctx.drawImage(img, 0, 0)
          }
          return canvas.toDataURL('image/webp')
        }
        const og_image_url = get_og_image_url()
        let og_image = undefined
        if (og_image_url) {
          try {
            og_image = await get_base64_of_image_url(og_image_url)
          } catch {}
        }
        let favicon = undefined
        try {
          favicon = await get_base64_of_image_url(get_favicon_url(), 32, 32)
        } catch {}
        const html = doc.getElementsByTagName('html')[0].outerHTML
        navigator.clipboard.writeText(
          JSON.stringify({ favicon, og_image, html }),
        )
      }

      const check_iframe_support = async () => {
        const title = document.title
        const og_title_element = document.querySelector(
          'meta[property="og:title"]',
        )
        const og_title_content = og_title_element
          ? og_title_element.getAttribute('content')
          : null
        if (
          og_title_content &&
          title.toLowerCase().includes(og_title_content.toLowerCase())
        )
          return false

        try {
          const response = await fetch(window.location.href)
          const headers = response.headers

          const x_frame_options = headers.get('X-Frame-Options')
          if (x_frame_options) {
            if (x_frame_options === 'DENY') {
              return false
            }
          }

          const csp = headers.get('Content-Security-Policy')
          if (csp && csp.includes('frame-ancestors')) {
            const frame_ancestors = csp.match(/frame-ancestors\s+([^;]+)/)
            if (frame_ancestors) {
              const sources = frame_ancestors[1].split(' ')
              if (!sources.includes('*') && !sources.includes('self')) {
                return false
              }
            }
          }

          return true
        } catch (error) {
          console.error('Error checking iframe support:', error)
          return false
        }
      }

      check_iframe_support().then(async (supports_iframe) => {
        navigator.clipboard.writeText('')

        if (supports_iframe) {
          const iframe = document.createElement('iframe')
          iframe.src = location.href
          iframe.style.visibility = 'hidden'
          document.body.appendChild(iframe)

          iframe.addEventListener('load', async () => {
            const doc = iframe.contentWindow.document
            await fill_clipboard(doc)
            const target_url =
              'https://taaabs.com/library#url=' +
              encodeURIComponent(document.location) +
              '&title=' +
              encodeURIComponent(doc.title) +
              '&description=' +
              (doc.querySelector("meta[name='description']") != null
                ? doc.querySelector("meta[name='description']").content
                : '') +
              '&v=1'
            window.location.assign(target_url)
          })
        } else {
          await fill_clipboard(document)
          const target_url =
            'https://taaabs.com/library#url=' +
            encodeURIComponent(document.location) +
            '&title=' +
            encodeURIComponent(document.title) +
            '&description=' +
            (document.querySelector("meta[name='description']") != null
              ? document.querySelector("meta[name='description']").content
              : '') +
            '&v=1'
          window.location.assign(target_url)
        }
      })
    },
  })
}
