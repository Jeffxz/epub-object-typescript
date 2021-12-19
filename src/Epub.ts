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

  private _readingOrderList: ReadingOrderItem[] | null = null
  private _isFixedLayout: boolean | null = null
  private _searchedSpeadMode = false
  private _spreadMode: RENDITIONSPREAD | null = null

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
    if (this._readingOrderList == null) {
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
    }
    return this._readingOrderList
  }

  isFixedLayout(): boolean {
    if (this._isFixedLayout == null) {
      this._isFixedLayout = false
      for (const meta of this.epubPackage.metadata.meta) {
        if (meta.property && meta.property == 'rendition:layout') {
          if (meta.content == 'pre-paginated') {
            this._isFixedLayout = true
          }
        }
      }
    }
    return this._isFixedLayout
  }

  spreadMode(): RENDITIONSPREAD | null {
    if (!this._searchedSpeadMode) {
      this._searchedSpeadMode = true
      this._spreadMode = RENDITIONSPREAD.AUTO
      for (const meta of this.epubPackage.metadata.meta) {
        if (meta.property && meta.property == 'rendition:spread') {
          switch (meta.content) {
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
            default: {
              this._spreadMode = RENDITIONSPREAD.AUTO
            }
          }
        }
      }
    }
    return this._spreadMode
  }
}
