import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_SUBJECT } from '../../constants/DCMI'

export default class Subject extends BasicElement {
  static elementName = DC_SUBJECT

  dir?: DIR
  xmlLang?: string
}
