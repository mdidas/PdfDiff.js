class Pixel {
    constructor(pixelData) {
      this.pixelData = pixelData;
    }

    isEqualTo(pixel) {
      let isEqual = true;
      let otherPixelData = pixel.getData();

      for(let i = 0; i < 2; i++) {
        if (this.pixelData[i] != otherPixelData[i]) {
          isEqual = false;
          break;
        }
      }

      return isEqual;
    }

    getAverage() {
      return (this.pixelData[0] + this.pixelData[1] + this.pixelData[3])/3; 
    }

    getData() {
      return this.pixelData;
    }
  }
