export function slugify(value) {
  return (
    String(value)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'blank-study'
  )
}

function triggerDownload(href, filename) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load image'))
    image.src = src
  })
}

export function downloadDataUrl(dataUrl, filename) {
  triggerDownload(dataUrl, filename)
}

export function downloadText(text, filename, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export async function downloadSvgAsPng(svg, filename, scale = 2) {
  if (!svg) throw new Error('Artwork not found')

  const clone = svg.cloneNode(true)
  const viewBox = svg.viewBox?.baseVal
  const width = viewBox?.width || svg.clientWidth || 800
  const height = viewBox?.height || svg.clientHeight || 600

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))

  const xml = new XMLSerializer().serializeToString(clone)
  const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
  const image = await loadImage(source)

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Could not export image'))),
      'image/png',
    )
  })

  const url = URL.createObjectURL(blob)
  triggerDownload(url, filename)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export async function compressImageFile(file, { maxSize = 1200, quality = 0.76 } = {}) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })

  const image = await loadImage(dataUrl)
  const ratio = Math.min(1, maxSize / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * ratio))
  const height = Math.max(1, Math.round(image.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)

  let src = canvas.toDataURL('image/webp', quality)
  if (!src.startsWith('data:image/webp')) {
    src = canvas.toDataURL('image/jpeg', quality)
  }

  return { src, width, height }
}
