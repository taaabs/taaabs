export const url_parser = (url: string): string => {
  if (url.startsWith('https://www.youtube.com/watch')) {
    return `https://www.youtube.com/watch?v=${new URL(url).searchParams.get(
      'v',
    )}`
  } else {
    return url
  }
}