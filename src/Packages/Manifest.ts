import { lookup } from 'mime-types'

export const CoreMediaTypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'audio/mpeg',
  'audio/mp4',
  'text/css',
  'font/ttf',
  'application/font-sfnt',
  'font/otf',
  'application/vnd.ms-opentype',
  'font/woff',
  'application/font-woff',
  'font/woff2',
  'application/xhtml+xml',
  'application/javascript',
  'text/javascript',
  'application/x-dtbncx+xml',
  'application/smil+xml',
  'application/pls+xml',
]

export class ManifestItem {
  name = 'item'

  fallback?: string
  href: string
  id: string
  mediaOverlay?: string
  mediaType: string
  properties?: string[]

  constructor(id: string, href: string) {
    this.id = id
    this.href = href
    this.mediaType = this.detectMediaType(href)
  }

  setProperties(properties: string[]): void {
    this.properties = properties
  }

  detectMediaType(filePath: string): string {
    const result = lookup(filePath)
    return result ? result : ''
  }

  isCoreMedia(): boolean {
    return CoreMediaTypes.indexOf(this.mediaType) > -1
  }
}

export default class Manifest {
  name = 'manifest'
  id?: string
  items: ManifestItem[] // 1 or more
  nav?: number

  constructor(items: ManifestItem[], id?: string) {
    this.items = items
    this.id = id
  }
}
