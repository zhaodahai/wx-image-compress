# wx-image-compress

[![npm version](https://img.shields.io/npm/v/wx-image-compress.svg?style=flat)](https://www.npmjs.com/package/wx-image-compress)

### 微信图片压缩

## 安装
- npm

```shell
  npm install wx-image-compress
```

## 使用
#### 1、引入
```js
  import ImgCompress from '../../wx-image-compress/img-compress.js';
```

#### 2、初始化
```js
  this.imgCompress = new ImgCompress(this);
```

#### 3、引入图片压缩组件
```html
  <!-- 在你的.wxml文件中引入图片压缩组件 -->
  <import src="../../wx-image-compress/img-compress.wxml"/>
  <template is="img-compress" data="{{ canWidth, canHeight }}"></template>
```
#### 4、压缩
```js
  /* 
   * imgPath：图片路径
   * aspectRatio：图片宽高压缩比，0～1，默认0.5
   * quality：图片质量，0～1，默认0.5
   */
  this.imgCompress.compress(imgPath , aspectRatio, quality)
  .then(res => {
    console.log('压缩成功',res);
  }).catch(e => {e
    console.log('压缩失败',e);
  })
```
Tips：
- aspectRatioss表示图片压缩后的宽高 / 压缩前的宽高，quality表示图片的压缩质量，越小压的越狠。iOS系统，在宽高缩小，质量为1的情况下，压缩后的图片大小会减小，但是在Android中反而大小会变大。<br>
- 在使用默认的aspectRatio:0.5 ,quality:0.5 情况下，能正常压缩，使大小变小。但是我们仍然不能精准的控制压缩后的大小。

















