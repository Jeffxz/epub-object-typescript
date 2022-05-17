import Epub from './Epub'
import {
  DIR,
  RENDITION_ORIENTATION,
  RENDITION_PAGE_SPREAD,
  RENDITION_SPREAD,
} from './OPF/Types'
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
  META_RENDITION_SPREAD_NAME,
  META_RENDITION_SPREAD_VALUE_AUTO,
  META_RENDITION_SPREAD_VALUE_LANDSCAPE,
  META_RENDITION_SPREAD_VALUE_NONE,
  META_RENDITION_SPREAD_VALUE_PORTRAIT, SPINE_ITEM_PROPERTY_PAGE_SPREAD_LEFT, SPINE_ITEM_PROPERTY_PAGE_SPREAD_RIGHT,
  SPINE_LAYOUT_OVERRIDES_VALUE_FXL,
  SPINE_LAYOUT_OVERRIDES_VALUE_FXL_PREFIX,
  SPINE_LAYOUT_OVERRIDES_VALUE_REFLOWABLE,
  SPINE_LAYOUT_OVERRIDES_VALUE_REFLOWABLE_PREFIX,
  SPINE_ORIENTATION_OVERRIDES_VALUE_AUTO,
  SPINE_ORIENTATION_OVERRIDES_VALUE_AUTO_PREFIX,
  SPINE_ORIENTATION_OVERRIDES_VALUE_LANDSCAPE,
  SPINE_ORIENTATION_OVERRIDES_VALUE_LANDSCAPE_PREFIX,
  SPINE_ORIENTATION_OVERRIDES_VALUE_PORTRAIT,
  SPINE_ORIENTATION_OVERRIDES_VALUE_PORTRAIT_PREFIX,
  SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_CENTER,
  SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_LEFT,
  SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_RIGHT,
} from './constants/OPF'

export enum BookSubType {
  'imageOnly',
}

export class ReadingOrderItem {
  spineItem: Itemref
  resourceItem: ManifestItem
  hasMathML = false
  isFixedLayout = false
  orientationOverride: RENDITION_ORIENTATION | null = null
  syntheticSpreadOverride: RENDITION_SPREAD | null = null
  pageSpread: RENDITION_PAGE_SPREAD | null = null

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
  bookSubType: BookSubType | null = null
  renditionOrientation: RENDITION_ORIENTATION = RENDITION_ORIENTATION.AUTO
  spreadMode: RENDITION_SPREAD | null = null
  nav: ManifestItem | null = null
  coverImage: ManifestItem | null = null
  a11yLevel: WCAG_LEVEL | null = null
  toc: ManifestItem | null = null
  pageMap: ManifestItem | null = null
  id: string

  constructor(epub: Epub) {
    this.epub = epub
    this.readingOrderList = []
    this.id = epub.epubPackage.uniqueIdentifier
    epub.epubPackage.metadata.identifiers.forEach(identifier => {
      if (identifier.id === epub.epubPackage.uniqueIdentifier && identifier.contentText) {
        this.id = identifier.contentText
      }
    })
    for (const spineItem of epub.epubPackage.spine.items) {
      const id = spineItem.idref
      for (const resourceItem of epub.epubPackage.manifest.items) {
        if (resourceItem.id == id) {
          const readingOrderItem = new ReadingOrderItem(spineItem, resourceItem)
          if (spineItem.properties) {
            if (spineItem.properties.includes(SPINE_LAYOUT_OVERRIDES_VALUE_FXL) || spineItem.properties.includes(SPINE_LAYOUT_OVERRIDES_VALUE_FXL_PREFIX)) {
              readingOrderItem.isFixedLayout = true
            } else if (spineItem.properties.includes(SPINE_LAYOUT_OVERRIDES_VALUE_REFLOWABLE) || spineItem.properties.includes(SPINE_LAYOUT_OVERRIDES_VALUE_REFLOWABLE_PREFIX)) {
              readingOrderItem.isFixedLayout = false
            }
            if (spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_AUTO) || spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_AUTO_PREFIX)) {
              readingOrderItem.orientationOverride = RENDITION_ORIENTATION.AUTO
            } else if (spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_LANDSCAPE) || spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_LANDSCAPE_PREFIX)) {
              readingOrderItem.orientationOverride = RENDITION_ORIENTATION.LANDSCAPE
            } else if (spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_PORTRAIT) || spineItem.properties.includes(SPINE_ORIENTATION_OVERRIDES_VALUE_PORTRAIT_PREFIX)) {
              readingOrderItem.orientationOverride = RENDITION_ORIENTATION.PORTRAIT
            }
            if (spineItem.properties.includes(SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_CENTER)) {
              readingOrderItem.pageSpread = RENDITION_PAGE_SPREAD.CENTER
            } else if (spineItem.properties.includes(SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_LEFT) || spineItem.properties.includes(SPINE_ITEM_PROPERTY_PAGE_SPREAD_LEFT)) {
              readingOrderItem.pageSpread = RENDITION_PAGE_SPREAD.LEFT
            } else if (spineItem.properties.includes(SPINE_SPREAD_PLACEMENT_OVERRIDES_VALUE_RIGHT) || spineItem.properties.includes(SPINE_ITEM_PROPERTY_PAGE_SPREAD_RIGHT)) {
              readingOrderItem.pageSpread = RENDITION_PAGE_SPREAD.RIGHT
            }
          }
          this.readingOrderList.push(readingOrderItem)
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
