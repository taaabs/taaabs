// Video urls must be supported by VideoEmbedModal
export const is_video_url = (url: string): boolean => {
  const youtube_regex = /^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/
  const pornhub_regex =
    /^https:\/\/(?:[a-z0-9-]+\.)?pornhub\.com\/view_video\.php\?viewkey=[a-zA-Z0-9]+$/
  const twitch_regex = /^https:\/\/www\.twitch\.tv\/videos\/\d+$/

  return (
    youtube_regex.test(url) || pornhub_regex.test(url) || twitch_regex.test(url)
  )
}
