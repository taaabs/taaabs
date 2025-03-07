export const is_youtube_video = (url: string) => {
  return (
    url.startsWith('https://www.youtube.com/watch') ||
    url.startsWith('https://m.youtube.com/watch')
  )
}
