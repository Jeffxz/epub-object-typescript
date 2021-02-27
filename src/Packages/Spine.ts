export class Itemref {
  name = 'itemref'

  id?: string
  idref: string
  linear?: string
  properties?: [string]

  constructor(idref: string) {
    this.idref = idref
  }
}

export default class Spine {
  name = 'spine'

  id?: string
  pageProgressionDirection?: string

  items: Itemref[]

  constructor(items: Itemref[]) {
    this.items = items
  }
}
