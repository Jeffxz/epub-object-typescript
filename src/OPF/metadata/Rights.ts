import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_RIGHTS } from '../../constants/DCMI'

export default class Rights extends BasicElement {
  static elementName = DC_RIGHTS

  dir?: DIR
  xmlLang?: string
}
