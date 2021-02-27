/*
 * https://www.w3.org/publishing/epub3/epub-packages.html
 */
import Metadata from './Metadata/Metadata'
import Manifest from './Manifest'
import Spine from './Spine'
import { DIR } from './Types'

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
}
