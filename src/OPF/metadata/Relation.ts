import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_RELATION } from '../../constants/DCMI'

export default class Relation extends BasicElement {
  static elementName = DC_RELATION

  dir?: DIR
  xmlLang?: string
}
