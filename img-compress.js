

export default class ImgCompress {

  constructor(pageContext) {
    this.page = pageContext;
    this.page.drawCanvas = this.drawCanvas.bind(this);
    const systemInfo = wx.getSystemInfoSync();
    this.pixelRatio = systemInfo.pixelRatio;
    this.page.setData({ //构造画板宽高
      canWidth: systemInfo.screenWidth,
      canHeight: systemInfo.screenHeight
    })
  }

  // 压缩
  compress(src, aspectRatio = 0.5, quality = 0.5) {
    return this.page.drawCanvas(src, aspectRatio, quality);
  }

  // 获取图片文件信息
  getImageFileInfo(imgPath) {
    let info = {};
    return _.promise(wx.getImageInfo, {
      src: imgPath
    }).then(res => {
      info.height = res.height;
      info.width = res.width;
      info.type = res.type;
      info.path = res.path;
      return _.promise(wx.getFileInfo, {
        filePath: imgPath,
      })
    }).then(res => {
      info.size = res.size;
      return _.resolve(info);
    })
  }

  // 绘制图片
  drawCanvas(src, aspectRatio, quality){
    const ctx = wx.createCanvasContext('compressCanvasId');
    let that = this.page;
    let imgInfo = {
      result: 1, // 0 压缩失败，1未压缩， 2压缩成功
      origin: {}, // 图片原始信息
      compress: {}, // 图片压缩后的信息
    };
    return this.getImageFileInfo(src)
    .then(res => {
      imgInfo.origin = res;
      if (res.width > 300 || res.height > 300) { //判断图片是否超过300px
        return new Promise((resolve , reject) => {
          let cW = res.width * aspectRatio;
          let cH = res.height * aspectRatio;
          //画出压缩图片
          ctx.drawImage(src, 0, 0, cW, cH);
          ctx.draw(false, __ => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: cW,
              height: cH,
              destWidth: cW,
              destHeight: cH,
              fileType: 'jpg',
              quality, 
              canvasId: 'compressCanvasId',
              fail: e => {
                imgInfo.result = 0;
                reject(imgInfo);
              },
              success: function success(res) {
                imgInfo.result = 2;
                resolve(res.tempFilePath);
              },
            });
          });
        })
      } else {
        imgInfo.result = 1;
        return _.resolve(src);
      }
    }).then(res => {
      return this.getImageFileInfo(res);
    }).then(res => {
      imgInfo.compress = res;
      return _.resolve(imgInfo);
    })
  }

}

const _ = {
  /**
   * 重写微信的异步API,返回promise对象
   * 
   * param fn:微信api; options:可选参数
   */
  promise(fn, options) {
    return new Promise((resolve, reject) => {
      let params = {
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
        complete(res) {
          //...
        }
      }
      if (options) {
        params = Object.assign(params, options);
      }
      if (fn) {
        fn(params);
      }
    })
  },

  /**
   * 返回promise对象
   * 
   * param s:回调参数
   */
  resolve(s) {
    return Promise.resolve(s);
  },

  /**
   * 返回promise对象
   * 
   * param j:回调参数
   */
  reject(j){
    return Promise.reject(j);
  }
}
