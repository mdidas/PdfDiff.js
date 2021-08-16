class CanvasDiff {

    constructor(canvas1, canvas2) {
        this.canvas1 = canvas1;
        this.canvas2 = canvas2;
        this.percentage = -1;
    }

    getCanvasData(canvas) {
        return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    }

    renderMessages(parentElement, messages) {
        let diffMsg = document.createElement('div');
        
        diffMsg.className = 'diff-msg';
        diffMsg.innerText = messages.join('<br>');
        
        parentElement.appendChild(diffMsg);

        return diffMsg;
    }

    render(parentElement) {
        let diffMessages = [];
        let diff = [];

        if (this.canvas1 == undefined) {
            diffMessages.push('Canvas 1 is undefined');
        }

        if (this.canvas2 == undefined) {
            diffMessages.push('Canvas 2 is undefined');
        }

        if (diffMessages.length > 0) {
            return this.renderMessages(parentElement, diffMessages);
        }

        if (this.canvas1.width !== this.canvas2.width) {
            diffMessages.push('Canvas width is different: ' + this.canvas1.width + ' <-> ' + this.canvas2.width);
        }

        if (this.canvas1.height !== this.canvas2.height) {
            diffMessages.push('Canvas height is different: ' + this.canvas1.height + ' <-> ' + this.canvas2.height);
        }

        if (diffMessages.length > 0) {
            return this.renderMessages(parentElement, diffMessages);
        }

        const data1 = this.getCanvasData(this.canvas1).data;
        const data2 = this.getCanvasData(this.canvas2).data;

        const canvasWrapper = document.createElement('div');
        canvasWrapper.setAttribute('class', 'canvas-wrapper');
        parentElement.appendChild(canvasWrapper);

        const canvas = document.createElement('canvas');
        
        canvas.width = this.canvas1.width;
        canvas.height = this.canvas1.height;

        canvasWrapper.appendChild(canvas);

        let diffCount = 0;
        let diffData = this.getCanvasData(canvas);

        for(let y = 0; y < diffData.height; y++) {
            for (let x = 0; x < diffData.width; x++) {
            
                const index = 4 * (y * diffData.width + x);

                const pixel1 = new Pixel([ data1[index], data1[index+1], data1[index+2], data1[index+3] ]);
                const pixel2 = new Pixel([ data2[index], data2[index+1], data2[index+2], data2[index+3] ]);

                if (!pixel1.isEqualTo(pixel2)) {

                    diffCount++;

                    diffData.data[index] = pixel2.getAverage();
                    diffData.data[index+1] = pixel1.getAverage();
                    diffData.data[index+2] = 0;
                    diffData.data[index+3] = 255;
                }
                else {
                    diffData.data[index] = data1[index];
                    diffData.data[index+1] = data1[index+1];
                    diffData.data[index+2] = data1[index+2];
                    diffData.data[index+3] = data1[index+3];
                }
            }
        }

        this.percentage = diffCount / (diffData.height * diffData.width);

        if (this.canvas1.style.display == 'none') {
            this.canvas1.remove();
        }

        canvas.getContext('2d').putImageData(diffData, 0, 0);

        return canvasWrapper;
    }

    getPercentage() {
        return this.percentage;
    }
  }