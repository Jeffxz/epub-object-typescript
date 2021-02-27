export default class Rootfile {
  name = 'rootfile'
  fullPath: string
  mediaType: string

  constructor(fullPath: string) {
    this.fullPath = fullPath
    this.mediaType = 'application/oebps-package+xml'
  }
}
