class PdfRenderer {

    constructor(source) {
      this.source = source;
      this.imageData = [];
      this.canvasElements = [];
    }



    render = function(parentNodeId) {
      const self = this;

      this.imageData = [];
      this.canvasElements = [];

      return new Promise(function(resolve, reject) {
        const parentNode = document.getElementById(parentNodeId);
        const selector = parentNodeId;
        let successCount = 0;

        parentNode.innerHTML = '';

        let source = typeof this.source === 'string'
          ? this.source
          : this.source.result;

        pdfjsLib.getDocument(source).promise.then(function(pdf) {

            for (let p = 1; p <= pdf.numPages; p++) {

                pdf.getPage(p).then(function(page) {

                    const scale = 2;
                    const pdfViewport = page.getViewport({ scale: scale });
                    let pageIndex = parseInt(page._pageIndex) + 1;

                    // prepare canvas 
                    const canvasWrapper = document.createElement('div');
                    canvasWrapper.setAttribute('class', 'canvas-wrapper');
                    parentNode.appendChild(canvasWrapper);
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvasWrapper.appendChild(canvas);

                    canvas.id = selector + '-p' + (parseInt(page._pageIndex) + 1);
                    canvas.height = pdfViewport.height;
                    canvas.width = pdfViewport.width;
                  
                    self.canvasElements[p] = canvas;

                    // render page to canvas
                    const task = page.render({ canvasContext: context, viewport: pdfViewport });
                
                    task.promise.then(function() {
                        successCount++;

                        if (successCount === pdf.numPages) {
                            self.imageData = self.getPdfData(pdf, selector);
                            resolve(self);
                        }
                    });
                });
            }

        }.bind(self), function(errorMsg){
            reject(errorMsg);
        });

      }.bind(self));
    }

    getNumberOfPages() {
      return this.canvasElements.length - 1;
    }

    getCanvasElements() {
      return this.canvasElements;
    }

    getImageData() {
      return this.imageData;
    }

    getPdfData(pdf, selector) {
      let pageData = [];
      for (let p = 1; p <= pdf.numPages; p++) {
          let canvas = document.getElementById(selector + '-p' + p);
          pageData[p] = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);    
      }

      return pageData;
    }
  }