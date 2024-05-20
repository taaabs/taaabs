export const convert_image_to_webp = async (
  base64_image: string,
): Promise<string> => {
  const img = document.createElement('img')
  img.src = base64_image

  await new Promise((resolve) => {
    img.onload = resolve
  })

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  return canvas.toDataURL('image/webp')
}
