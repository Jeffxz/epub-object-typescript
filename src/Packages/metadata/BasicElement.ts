import * as XML from "xmldoc";

export default abstract class BasicElement {
  nameSpace = 'http://purl.org/dc/elements/1.1/'
  id?: string
  content: string

  constructor(content: string) {
    this.content = content
  }
}
