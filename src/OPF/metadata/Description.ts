import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_DESCRIPTION } from '../constants/DCMI'

export default class Description extends BasicElement {
  static elementName = DC_DESCRIPTION

  dir?: DIR
  xmlLang?: string
}
