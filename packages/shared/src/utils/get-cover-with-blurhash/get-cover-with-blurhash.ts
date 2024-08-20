import { encode } from 'blurhash'

export const get_cover_with_blurhash = async (
  image_base64: string,
): Promise<{ cover: string; blurhash: string }> => {
  const img = new Image()
  img.src = image_base64

  await new Promise((resolve) => {
    img.onload = resolve
  })

  const original_width = img.width
  const original_height = img.height

  // Calculate new dimensions
  const max_width = 1200
  let new_width = original_width
  let new_height = original_height

  if (original_width > max_width) {
    new_width = max_width
    new_height = Math.round((original_height / original_width) * max_width)
  }

  // Create canvas for full-size image
  const full_size_canvas = document.createElement('canvas')
  full_size_canvas.width = new_width
  full_size_canvas.height = new_height
  const full_size_ctx = full_size_canvas.getContext('2d')
  if (!full_size_ctx)
    throw new Error('Could not get 2D context from full-size canvas.')

  full_size_ctx.drawImage(img, 0, 0, new_width, new_height)
  const cover = full_size_canvas.toDataURL('image/webp')

  // Create smaller canvas for Blurhash calculation
  const blurhash_width = 50
  const blurhash_height = Math.round((new_height / new_width) * blurhash_width)

  const blurhashCanvas = document.createElement('canvas')
  blurhashCanvas.width = blurhash_width
  blurhashCanvas.height = blurhash_height
  const blurhash_ctx = blurhashCanvas.getContext('2d')
  if (!blurhash_ctx)
    throw new Error('Could not get 2D context from Blurhash canvas.')

  // Use built-in scaling of drawImage for better quality
  blurhash_ctx.drawImage(img, 0, 0, blurhash_width, blurhash_height)

  // Calculate Blurhash using the resized image
  const pixels = blurhash_ctx.getImageData(
    0,
    0,
    blurhash_width,
    blurhash_height,
  ).data
  const blurhash = encode(pixels, blurhash_width, blurhash_height, 4, 3)

  return {
    cover,
    blurhash,
  }
}
