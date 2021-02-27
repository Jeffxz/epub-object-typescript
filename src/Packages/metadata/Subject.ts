import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Subject extends BasicElement {
  name = 'dc:subject'

  dir?: DIR
  xmlLang?: string
}
