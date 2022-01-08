import { Container } from '../index'

describe('Container', () => {
  it('should can parse rootfile', () => {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n' +
      '<rootfiles>\n' +
      '<rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>\n' +
      '</rootfiles>\n' +
      '</container>'
    const container = Container.loadFromXML(xml)
    expect(container?.rootfiles.length).toEqual(1)
    expect(container?.defaultRendition().fullPath).toEqual('OPS/package.opf')
  })

  it('should can return two rootfile and the first one is default rendition', () => {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n' +
      '<rootfiles>\n' +
      '<rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>\n' +
      '<rootfile full-path="OPS/package-test.opf" media-type="application/oebps-package+xml"/>\n' +
      '</rootfiles>\n' +
      '</container>'
    const container = Container.loadFromXML(xml)
    expect(container?.rootfiles.length).toEqual(2)
    expect(container?.defaultRendition().fullPath).toEqual('OPS/package.opf')
  })

  it('should return null if rootfile does not exist', () => {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n' +
      '<rootfiles>\n' +
      '</rootfiles>\n' +
      '</container>'
    const container = Container.loadFromXML(xml)
    expect(container).toBeNull()
  })

  it('should return null if container xml is empty', () => {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n' +
      '</container>'
    const container = Container.loadFromXML(xml)
    expect(container).toBeNull()
  })
})
