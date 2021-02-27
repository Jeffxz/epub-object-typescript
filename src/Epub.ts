import { Package } from './Packages'
import { Ocf } from './OCF'

export default class Epub {
  epubPackage: Package
  ocf: Ocf

  constructor(ocf: Ocf, epubPackage: Package) {
    this.ocf = ocf
    this.epubPackage = epubPackage
  }
}
