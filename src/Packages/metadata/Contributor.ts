import BasicElement from './BasicElement'
import { DIR } from '../Types'

export default class Contributor extends BasicElement {
  name = 'dc:contributor'

  dir?: DIR
  xmlLang?: string
}
