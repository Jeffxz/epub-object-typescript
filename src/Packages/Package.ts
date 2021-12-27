/*
 * https://www.w3.org/publishing/epub3/epub-packages.html
 */
import Metadata from './metadata/Metadata'
import Manifest from './Manifest'
import Spine from './Spine'
import { DIR } from './Types'
import * as XML from 'xmldoc'

export default class Package {
  static PREFIX_DCTERMS = 'http://purl.org/dc/terms/'
  static PREFIX_OPF = 'http://www.idpf.org/2007/opf'
  static PREFIX_RENDITION = 'http://www.idpf.org/vocab/rendition/#'
  version: string
  uniqueIdentifier: string
  dir?: DIR
  id?: string
  prefix?: string
  xmlLang?: string

  metadata: Metadata // exactly 1
  manifest: Manifest // exactly 1
  spine: Spine // exactly 1
  // TODO: guide, bindings and collection

  constructor(
    metadata: Metadata,
    manifest: Manifest,
    spine: Spine,
    uniqueIdentifier: string,
    version: string
  ) {
    this.metadata = metadata
    this.manifest = manifest
    this.spine = spine
    this.uniqueIdentifier = uniqueIdentifier
    this.version = version
  }

  static loadFromXML(xmlString: string): Package | null {
    let epubPackage: Package | null = null
    try {
      const document = new XML.XmlDocument(xmlString)
      const metadataNode = document.childNamed(Metadata.elementName)
      if (metadataNode == null)
        throw new Error(`missing ${Metadata.elementName} from opf file`)
      const metadata = Metadata.loadFromXMLElement(metadataNode)
      const manifestNode = document.childNamed('manifest')
      if (manifestNode == null)
        throw new Error(`missing ${Manifest.elementName} from opf file`)
      const manifest = Manifest.loadFromXMLElement(manifestNode)
      const spineNode = document.childNamed('spine')
      if (spineNode == null)
        throw new Error(`missing ${Spine.elementName} from opf file`)
      const spine = Spine.loadFromXMLElement(spineNode)
      const uniqueIdentifier = document.attr['unique-identifier']
      const version = document.attr.version
      if (metadata && manifest && spine) {
        epubPackage = new Package(
          metadata,
          manifest,
          spine,
          uniqueIdentifier,
          version
        )
      }
    } catch (error) {
      throw error
    }
    return epubPackage
  }

  toXmlString(): string {
    const metadataString = this.metadata.toXmlString()
    console.log(metadataString)
    return ''
  }
}
