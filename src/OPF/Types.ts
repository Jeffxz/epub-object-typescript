export enum DIR {
  LTR = 'ltr',
  RTL = 'rtl',
}

/**
 * Fixed-Layout Properties
 * https://www.w3.org/TR/epub-33/#sec-rendering-fxl
 */

export enum RENDITION_SPREAD {
  NONE = 'none',
  LANDSCAPE = 'langscape',
  PORTRAIT = 'portrait', // deprecated
  BOTH = 'both',
  AUTO = 'auto',
}

/**
 * https://w3c.github.io/epub-specs/epub33/core/#orientation
 */
export enum RENDITION_ORIENTATION {
  LANDSCAPE = 'langscape',
  PORTRAIT = 'portrait',
  AUTO = 'auto', // default
}

/**
 * https://w3c.github.io/epub-specs/epub33/core/#page-spread
 */
export enum RENDITION_PAGE_SPREAD {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * https://w3c.github.io/epub-specs/epub33/core/#viewport
 */
export type RENDITION_VIEWPORT = {
  width: number
  height: number
}
