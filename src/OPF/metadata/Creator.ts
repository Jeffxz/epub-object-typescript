import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_CREATOR } from '../constants/DCMI'

export default class Creator extends BasicElement {
  static elementName = DC_CREATOR

  dir?: DIR
  xmlLang?: string
}
