import {DIR, Itemref, Language, ManifestItem, Package, Title} from './Packages'
import { Ocf } from './OCF'

export class ReadingOrderItem {
  spineItem: Itemref
  resourceItem: ManifestItem

  constructor(spineItem: Itemref, resourceItem: ManifestItem) {
    this.spineItem = spineItem
    this.resourceItem = resourceItem
  }
}

export default class Epub {
  epubPackage: Package
  ocf: Ocf

  constructor(ocf: Ocf, epubPackage: Package) {
    this.ocf = ocf
    this.epubPackage = epubPackage
  }

  titles(): Title[] {
    return this.epubPackage.metadata.titles
  }

  title(): string {
    return this.epubPackage.metadata.titles[0].content
  }

  languages(): Language[] {
    return this.epubPackage.metadata.languages
  }

  language(): string {
    return this.epubPackage.metadata.languages[0].content
  }

  readingDirection(): DIR {
    return this.epubPackage.spine.pageProgressionDirection
  }

  readingOrderList(): ReadingOrderItem[] {
    let itemList: ReadingOrderItem[] = []
    for (let spineItem of this.epubPackage.spine.items) {
      const id = spineItem.idref
      for (let resourceItem of this.epubPackage.manifest.items) {
        if (resourceItem.id == id) {
          itemList.push(new ReadingOrderItem(spineItem, resourceItem))
          break
        }
      }
    }
    return itemList
  }
}
