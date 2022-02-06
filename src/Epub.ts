import Package from './OPF/Package'
import Ocf from './OCF/Ocf'

export default class Epub {
  epubPackage: Package
  ocf: Ocf

  constructor(ocf: Ocf, epubPackage: Package) {
    this.ocf = ocf
    this.epubPackage = epubPackage
  }
}
