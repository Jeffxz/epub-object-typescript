export default class Link {
  name = 'link'

  href: string
  id?: string
  mediaType: string
  properties?: string
  refines?: string
  rel: string

  constructor(href: string, rel: string, mediaType: string) {
    this.href = href
    this.rel = rel
    this.mediaType = mediaType
  }
}
