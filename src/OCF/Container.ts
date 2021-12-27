import Rootfile from './Rootfile'
import * as XML from 'xmldoc'

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

  static loadFromXML(xmlString: string): Container | null {
    let container: Container | null = null
    const document = new XML.XmlDocument(xmlString)
    const rootfiles = document.childNamed('rootfiles')
    if (rootfiles == null) {
      return container
    }
    const rootfile = rootfiles?.childrenNamed('rootfile')
    if (rootfile.length == 0) {
      return container
    }
    const opfPathList: string[] = []
    for (const node of rootfile) {
      if (node?.attr['full-path']) {
        opfPathList.push(node?.attr['full-path'])
      }
    }

    if (opfPathList) {
      container = new Container(opfPathList)
    }
    return container
  }

  toXmlString(): string {
    return `
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
    `
  }
}
