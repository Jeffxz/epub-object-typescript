import Epub from './Epub'
import { DIR } from './OPF/Types'
import { Itemref } from './OPF/Spine'
import Language from './OPF/metadata/Language'
import Title from './OPF/metadata/Title'
import ManifestItem from './OPF/Manifest/ManifestItem'

import { RENDITIONSPREAD } from './OPF/Types'
import { DCTERMS_CONFORMS_TO } from './OPF/constants/DCMI'
import {
  A11Y_CONFORM_TO_IRI_A,
  A11Y_CONFORM_TO_IRI_AA,
  A11Y_CONFORM_TO_IRI_AAA,
  MANIFEST_PROPERTY_COVER_IMAGE,
  MANIFEST_PROPERTY_MATHML,
  MANIFEST_PROPERTY_NAV,
} from './OPF/constants/EpubConstants'

export class ReadingOrderItem {
  spineItem: Itemref
  resourceItem: ManifestItem
  hasMathML = false

  constructor(spineItem: Itemref, resourceItem: ManifestItem) {
    this.spineItem = spineItem
    this.resourceItem = resourceItem
    if (
      resourceItem.properties &&
      resourceItem.properties.includes(MANIFEST_PROPERTY_MATHML)
    ) {
      this.hasMathML = true
    }
  }
}

type WCAG_LEVEL = 'a' | 'aa' | 'aaa'

export default class EpubHelper {
  epub: Epub
  readingOrderList: ReadingOrderItem[]
  isFixedLayout: boolean
  spreadMode: RENDITIONSPREAD | null = null
  nav: ManifestItem | null = null
  coverImage: ManifestItem | null = null
  a11yLevel: WCAG_LEVEL | null = null
  toc: ManifestItem | null = null

  constructor(epub: Epub) {
    this.epub = epub
    this.readingOrderList = []
    for (const spineItem of epub.epubPackage.spine.items) {
      const id = spineItem.idref
      for (const resourceItem of epub.epubPackage.manifest.items) {
        if (resourceItem.id == id) {
          this.readingOrderList.push(
            new ReadingOrderItem(spineItem, resourceItem)
          )
          break
        }
      }
    }

    const tocId = epub.epubPackage.spine.toc
    for (const resourceItem of epub.epubPackage.manifest.items) {
      if (
        resourceItem.properties &&
        resourceItem.properties.includes(MANIFEST_PROPERTY_NAV)
      ) {
        this.nav = resourceItem
      }
      if (
        resourceItem.properties &&
        resourceItem.properties.includes(MANIFEST_PROPERTY_COVER_IMAGE)
      ) {
        this.coverImage = resourceItem
      }
      if (tocId) {
        if (resourceItem.id == tocId) {
          this.toc = resourceItem
        }
      }
    }

    this.isFixedLayout = false
    for (const meta of epub.epubPackage.metadata.metaList) {
      if (meta.property && meta.property == 'rendition:layout') {
        if (meta.contentText == 'pre-paginated') {
          this.isFixedLayout = true
        }
      }
      if (meta.property && meta.property == 'rendition:spread') {
        switch (meta.contentText) {
          case 'none': {
            this.spreadMode = RENDITIONSPREAD.NONE
            break
          }
          case 'landscape': {
            this.spreadMode = RENDITIONSPREAD.LANDSCAPE
            break
          }
          case 'portrait': {
            this.spreadMode = RENDITIONSPREAD.PORTRAIT
            break
          }
          case 'auto': {
            this.spreadMode = RENDITIONSPREAD.AUTO
          }
          default: {
            this.spreadMode = null
          }
        }
      }
    }

    for (const link of epub.epubPackage.metadata.linkList) {
      if (link.rel == DCTERMS_CONFORMS_TO) {
        if (link.href == A11Y_CONFORM_TO_IRI_A) {
          this.a11yLevel = 'a'
        }
        if (link.href == A11Y_CONFORM_TO_IRI_AA) {
          this.a11yLevel = 'aa'
        }
        if (link.href == A11Y_CONFORM_TO_IRI_AAA) {
          this.a11yLevel = 'aaa'
        }
      }
    }
  }

  titles(): Title[] {
    return this.epub.epubPackage.metadata.titles
  }

  title(): string {
    return this.epub.epubPackage.metadata.titles[0].contentText || ''
  }

  languages(): Language[] {
    return this.epub.epubPackage.metadata.languages
  }

  language(): string {
    return this.epub.epubPackage.metadata.languages[0].contentText || 'en'
  }

  readingDirection(): DIR {
    return this.epub.epubPackage.spine.pageProgressionDirection
  }
}
