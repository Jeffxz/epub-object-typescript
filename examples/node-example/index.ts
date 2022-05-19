import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as JSZip from 'jszip'
import { Container, Epub, Ocf, Package, PageMap } from '../../index'
import Ncx from '../../src/NCX/Ncx'
import EpubHelper from '../../src/EpubHelper';

const program = new Command()
program.option('-f, --file <epub>', 'convert a single epub file')
program.option('-o, --output <nav | metadata | readingOrder | resources | all>', 'output option, default will output all logs')

program.parse(process.argv)

const options = program.opts()
if (options.file) {
  let epub: Epub | null
  let ocf: Ocf | null
  let epubPackage: Package | null
  const fileName = options.file
  console.log(`loading file ${fileName}`)
  let outputOption = options.output
  if (!outputOption) {
    outputOption = 'all'
  }
  try {
    fs.readFile(fileName, (error, data) => {
      JSZip.loadAsync(data).then((zip) => {
        zip.files[Ocf.containerPath]
          .async('string')
          .then((xmlString) => {
            const container = Container.loadFromXML(xmlString)
            if (container) {
              ocf = new Ocf(container)
              return ocf
            } else {
              throw new Error(
                `could not find epub container from path ${Ocf.containerPath}`
              )
              return null
            }
          })
          .then((ocf) => {
            if (ocf) {
              zip.files[ocf.container?.rootfiles[0].fullPath]
                .async('string')
                .then((xmlString) => {
                  epubPackage = Package.loadFromXML(xmlString)
                  if (epubPackage != null) {
                    epub = new Epub(ocf, epubPackage)
                  }
                })
                .then(() => {
                  if (epub) {
                    const epubHelper = new EpubHelper(epub)
                    if (outputOption === 'all' || outputOption === 'metadata') {
                      console.log('id', epubHelper.id)
                    }
                    if (epubHelper.nav) {
                      if (outputOption === 'all' || outputOption === 'nav') {
                        console.log('nav file', JSON.stringify(epubHelper.nav))
                      }
                    }
                    const opfFolderPath = path.dirname(
                        ocf.container?.rootfiles[0].fullPath
                    )
                    if (epubHelper.toc && epubHelper.toc.href) {
                      if (outputOption === 'all' || outputOption === 'nav') {
                        console.log('toc file', epubHelper.toc.href)
                      }
                      const tocPath = path.join(opfFolderPath, epubHelper.toc.href)
                      zip.files[tocPath].async('string').then((xmlString) => {
                        const ncx = Ncx.loadFromXML(xmlString)
                        if (outputOption === 'all' || outputOption === 'nav') {
                          console.log('page list', JSON.stringify(ncx?.navMap))
                        }
                        if (ncx?.pageList) {
                          console.log(JSON.stringify(ncx.pageList))
                        }
                      })
                    }
                    if (epubHelper.pageMap && epubHelper.pageMap.href) {
                      const pageMapPath = path.join(opfFolderPath, epubHelper.pageMap.href)
                      zip.files[pageMapPath].async('string').then((xmlString) => {
                        const pageMap = PageMap.loadFromXML(xmlString)
                        if (outputOption === 'all' || outputOption === 'nav') {
                          console.log('page map', JSON.stringify(pageMap))
                        }
                      })
                    }
                    if (epubHelper.coverImage) {
                      if (outputOption === 'all' || outputOption === 'metadata') {
                        console.log( 'cover Image', JSON.stringify(epubHelper.coverImage))
                      }
                    }
                    if (epubHelper.a11yInfo) {
                      if (outputOption === 'all' || outputOption === 'a11y') {
                        console.log('a11y information', epubHelper.a11yInfo)
                      }
                    }
                    if (outputOption === 'all' || outputOption === 'readingOrder') {
                      console.log('readingOrder', JSON.stringify(epubHelper.readingOrderList, null, 2))
                    }
                  }
                })
                .catch((error) => {
                  throw error
                })
            }
          })
          .catch((error) => {
            console.error(error)
          })
      })
    })
  } catch (error) {
    console.error(error)
  }
} else {
  console.error('Usage: yarn load -f <epub file path>')
}
