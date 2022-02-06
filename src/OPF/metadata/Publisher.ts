import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_PUBLISHER } from '../constants/DCMI'

export default class Publisher extends BasicElement {
  static elementName = DC_PUBLISHER

  dir?: DIR
  xmlLang?: string
}
