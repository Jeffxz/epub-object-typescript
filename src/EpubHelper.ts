import Epub from './Epub'
import { DIR, RENDITION_ORIENTATION, RENDITION_SPREAD } from './OPF/Types'
import { Itemref } from './OPF/Spine'
import Language from './OPF/metadata/Language'
import Title from './OPF/metadata/Title'
import ManifestItem from './OPF/Manifest/ManifestItem'
import { DCTERMS_CONFORMS_TO } from './constants/DCMI'
import {
  A11Y_CONFORM_TO_IRI_A,
  A11Y_CONFORM_TO_IRI_AA,
  A11Y_CONFORM_TO_IRI_AAA,
  MANIFEST_PROPERTY_COVER_IMAGE,
  MANIFEST_PROPERTY_MATHML,
  MANIFEST_PROPERTY_NAV,
  META_RENDITION_LAYOUT_NAME,
  META_RENDITION_LAYOUT_VALUE_FXL,
  META_RENDITION_ORIENTATION_NAME,
  META_RENDITION_ORIENTATION_VALUE_AUTO,
  META_RENDITION_ORIENTATION_VALUE_LANDSCAPE,
  META_RENDITION_ORIENTATION_VALUE_PORTRAIT,
  META_RENDITION_SPREAD_NAME, META_RENDITION_SPREAD_VALUE_AUTO,
  META_RENDITION_SPREAD_VALUE_LANDSCAPE,
  META_RENDITION_SPREAD_VALUE_NONE,
  META_RENDITION_SPREAD_VALUE_PORTRAIT,
} from './constants/OPF'

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
  renditionOrientation: RENDITION_ORIENTATION = RENDITION_ORIENTATION.AUTO
  spreadMode: RENDITION_SPREAD | null = null
  nav: ManifestItem | null = null
  coverImage: ManifestItem | null = null
  a11yLevel: WCAG_LEVEL | null = null
  toc: ManifestItem | null = null
  pageMap: ManifestItem | null = null

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
    const pageMapId = epub.epubPackage.spine.pageMap
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
      if (pageMapId) {
        if (resourceItem.id == pageMapId) {
          this.pageMap = resourceItem
        }
      }
    }

    this.isFixedLayout = false
    for (const meta of epub.epubPackage.metadata.metaList) {
      if (meta.property && meta.property == META_RENDITION_LAYOUT_NAME) {
        if (meta.contentText == META_RENDITION_LAYOUT_VALUE_FXL) {
          this.isFixedLayout = true
        }
      }
      if (meta.property && meta.property == META_RENDITION_SPREAD_NAME) {
        switch (meta.contentText) {
          case META_RENDITION_SPREAD_VALUE_NONE: {
            this.spreadMode = RENDITION_SPREAD.NONE
            break
          }
          case META_RENDITION_SPREAD_VALUE_LANDSCAPE: {
            this.spreadMode = RENDITION_SPREAD.LANDSCAPE
            break
          }
          case META_RENDITION_SPREAD_VALUE_PORTRAIT: {
            this.spreadMode = RENDITION_SPREAD.PORTRAIT
            break
          }
          case META_RENDITION_SPREAD_VALUE_AUTO: {
            this.spreadMode = RENDITION_SPREAD.AUTO
          }
          default: {
            this.spreadMode = null
          }
        }
      }
      if (meta.property && meta.property == META_RENDITION_ORIENTATION_NAME) {
        switch (meta.contentText) {
          case META_RENDITION_ORIENTATION_VALUE_AUTO:
            this.renditionOrientation = RENDITION_ORIENTATION.AUTO
            break
          case META_RENDITION_ORIENTATION_VALUE_LANDSCAPE:
            this.renditionOrientation = RENDITION_ORIENTATION.LANDSCAPE
            break
          case META_RENDITION_ORIENTATION_VALUE_PORTRAIT:
            this.renditionOrientation = RENDITION_ORIENTATION.PORTRAIT
            break
          default:
            break
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
