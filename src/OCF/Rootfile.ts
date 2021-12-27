export default class Rootfile {
  static elementName = 'rootfile'
  fullPath: string
  mediaType: string

  constructor(fullPath: string) {
    this.fullPath = fullPath
    this.mediaType = 'application/oebps-package+xml'
  }

  toXmlString(): string {
    return `<${Rootfile.elementName} full-path="${this.fullPath}" media-type="${this.mediaType}"/>`
  }
}
