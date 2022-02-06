import Rootfile from './Rootfile'
import * as XML from 'xmldoc'

// https://www.w3.org/publishing/epub3/epub-ocf.html#sec-container-metainf-container.xml
// https://www.w3.org/publishing/epub3/epub-ocf.html#app-schema-container
export default class Container {
  elementName = 'container'
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

  static loadFromXML(xmlString: string): Container | null {
    let container: Container | null = null
    const document = new XML.XmlDocument(xmlString)
    const rootfiles = document.childNamed('rootfiles')
    if (rootfiles == null) {
      console.error('Could not find rootfiles')
      return container
    }
    const rootfile = rootfiles?.childrenNamed('rootfile')
    if (rootfile.length == 0) {
      console.error('Could not find rootfile inside rootfiles')
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
    let containerString = `<?xml version="1.0" encoding="utf-8" standalone="no"?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n\t<rootfiles>
  `
    this.rootfiles.forEach((item) => {
      containerString += '\t\t'
      containerString += item.toXmlString()
      containerString += '\n'
    })
    containerString += `\t</rootfiles>\n</container>`
    return containerString
  }
}
