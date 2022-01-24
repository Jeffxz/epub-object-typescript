import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_COVERAGE } from '../constants/DCMI'

export default class Coverage extends BasicElement {
  static elementName = DC_COVERAGE

  dir?: DIR
  xmlLang?: string
}
