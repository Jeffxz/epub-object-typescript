import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Relation extends BasicElement {
  name = 'dc:relation'

  dir?: DIR
  xmlLang?: string
}
