import {
  DIR,
  Itemref,
  Language,
  ManifestItem,
  Package,
  Title,
} from './Packages'
import { Ocf } from './OCF'
import { RENDITIONSPREAD } from './Packages/Types'

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

  _readingOrderList: ReadingOrderItem[]
  _isFixedLayout: boolean
  _spreadMode: RENDITIONSPREAD | null = null

  constructor(ocf: Ocf, epubPackage: Package) {
    this.ocf = ocf
    this.epubPackage = epubPackage

    this._readingOrderList = []
    for (const spineItem of this.epubPackage.spine.items) {
      const id = spineItem.idref
      for (const resourceItem of this.epubPackage.manifest.items) {
        if (resourceItem.id == id) {
          this._readingOrderList.push(
            new ReadingOrderItem(spineItem, resourceItem)
          )
          break
        }
      }
    }

    this._isFixedLayout = false
    for (const meta of this.epubPackage.metadata.meta) {
      if (meta.property && meta.property == 'rendition:layout') {
        if (meta.contentText == 'pre-paginated') {
          this._isFixedLayout = true
        }
      }
    }

    for (const meta of this.epubPackage.metadata.meta) {
      if (meta.property && meta.property == 'rendition:spread') {
        switch (meta.contentText) {
          case 'none': {
            this._spreadMode = RENDITIONSPREAD.NONE
            break
          }
          case 'landscape': {
            this._spreadMode = RENDITIONSPREAD.LANDSCAPE
            break
          }
          case 'portrait': {
            this._spreadMode = RENDITIONSPREAD.PORTRAIT
            break
          }
          case 'auto': {
            this._spreadMode = RENDITIONSPREAD.AUTO
          }
          default: {
            this._spreadMode = null
          }
        }
      }
    }
  }

  titles(): Title[] {
    return this.epubPackage.metadata.titles
  }

  title(): string {
    return this.epubPackage.metadata.titles[0].contentText || ''
  }

  languages(): Language[] {
    return this.epubPackage.metadata.languages
  }

  language(): string {
    return this.epubPackage.metadata.languages[0].contentText || 'en'
  }

  readingDirection(): DIR {
    return this.epubPackage.spine.pageProgressionDirection
  }

  readingOrderList(): ReadingOrderItem[] {
    return this._readingOrderList
  }

  isFixedLayout(): boolean {
    return this._isFixedLayout
  }

  spreadMode(): RENDITIONSPREAD | null {
    return this._spreadMode
  }
}
