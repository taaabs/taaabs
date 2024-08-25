export const send_message = (message: any) => {
  window.postMessage({ from: 'preactApp', ...message }, '*')
}