import Rootfile from './Rootfile'

// https://www.w3.org/publishing/epub3/epub-ocf.html#sec-container-metainf-container.xml
// https://www.w3.org/publishing/epub3/epub-ocf.html#app-schema-container
export default class Container {
  name = 'container'
  version = '1.0'
  xmlns = 'urn:oasis:names:tc:opendocument:xmlns:container'
  rootfiles: Rootfile[]
  // links?

  constructor(opfPaths: string[]) {
    this.rootfiles = []
    opfPaths.forEach((url) => {
      const rootfile = new Rootfile(url)
      this.rootfiles.push(rootfile)
    })
  }

  defaultRendition(): Rootfile {
    return this.rootfiles[0]
  }
}
