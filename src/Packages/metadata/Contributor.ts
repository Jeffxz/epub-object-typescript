import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_CONTRIBUTOR } from '../constants/DCMI'

export default class Contributor extends BasicElement {
  static elementName = DC_CONTRIBUTOR

  dir?: DIR
  xmlLang?: string
}
