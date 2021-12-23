const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const epubPath = params.get('epub');

if (epubPath) {
  let ocf;
  let epub;
  let epubPackage;

  window.fetch(epubPath)
    .then(response => response.blob())
    .then(data => {
      JSZip.loadAsync(data).then(zip => {
        zip.files[epubObject.Ocf.containerPath].async('string').then(xmlString => {
          const container = epubObject.Container.loadFromXML(xmlString);
          if (container) {
            ocf = new epubObject.Ocf(container);
            return ocf;
          } else {
            console.error(`could not find epub container from path ${epubObject.Ocf.containerPath}`);
          }
        }).then(ocf => {
          if (ocf) {
            zip.files[ocf.container?.defaultRendition().fullPath].async('string').then(xmlString => {
              epubPackage = epubObject.Package.loadFromXML(xmlString)
              if (epubPackage) {
                epub = new epubObject.Epub(ocf, epubPackage);
              }
            }).then(() => {
              if (epub) {
                const elem = document.getElementById('output');
                elem.textContent = JSON.stringify(epub, null, 4);
              }
            })
          }
        })
      })
    })
}
