import Container from './Container'

export default class Ocf {
  static dictory = 'META-INF'
  static mimetype = 'application/epub+zip'

  container: Container

  constructor(container: Container) {
    this.container = container
  }
}
