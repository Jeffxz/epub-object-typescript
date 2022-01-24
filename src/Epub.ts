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
import { DCTERMS_CONFORMS_TO } from './Packages/constants/DCMI'
import {
  A11Y_CONFORM_TO_IRI_A,
  A11Y_CONFORM_TO_IRI_AA,
  A11Y_CONFORM_TO_IRI_AAA,
} from './Packages/constants/EpubConstants'

export class ReadingOrderItem {
  spineItem: Itemref
  resourceItem: ManifestItem
  hasMathML = false

  constructor(spineItem: Itemref, resourceItem: ManifestItem) {
    this.spineItem = spineItem
    this.resourceItem = resourceItem
    this.hasMathML = resourceItem.isMathML()
  }
}

type WCAG_LEVEL = 'a' | 'aa' | 'aaa'

export default class Epub {
  epubPackage: Package
  ocf: Ocf

  _readingOrderList: ReadingOrderItem[]
  _isFixedLayout: boolean
  _spreadMode: RENDITIONSPREAD | null = null
  _nav: ManifestItem | null = null
  _coverImage: ManifestItem | null = null
  _a11yLevel: WCAG_LEVEL | null = null

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

    for (const resourceItem of this.epubPackage.manifest.items) {
      if (resourceItem.isNav()) {
        this._nav = resourceItem
      }
      if (resourceItem.isCoverImage()) {
        this._coverImage = resourceItem
      }
    }

    this._isFixedLayout = false
    for (const meta of this.epubPackage.metadata.metaList) {
      if (meta.property && meta.property == 'rendition:layout') {
        if (meta.contentText == 'pre-paginated') {
          this._isFixedLayout = true
        }
      }
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

    for (const link of this.epubPackage.metadata.linkList) {
      if (link.rel == DCTERMS_CONFORMS_TO) {
        if (link.href == A11Y_CONFORM_TO_IRI_A) {
          this._a11yLevel = 'a'
        }
        if (link.href == A11Y_CONFORM_TO_IRI_AA) {
          this._a11yLevel = 'aa'
        }
        if (link.href == A11Y_CONFORM_TO_IRI_AAA) {
          this._a11yLevel = 'aaa'
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
