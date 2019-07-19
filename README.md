# SaSaSak.js

**Element를 사사삭! 하고 지워보자**

SaSaSak.js는 [html2canvas](https://html2canvas.hertzen.com/) 라이브러리를 사용하여 Element를 canvas로 만든 뒤 사사삭!하고 지웁니다

## Scripts

```
$ npm install --only=prod
$ npm run start
```

or

```
$ npm install
$ npm run dev
```

or

```
$ npm install
$ npm run build
$ npm run start
```

## USE

```js
new SaSaSakJs(document.querySelector('el')[, options])
```

## 예제

```js
var sasasak = new SaSaSakJs(document.querySelector('el'), {
    wrapStyle: {
        display: 'inline-flex',
        border: '4px solid #eee',
        backgroundColor: '#eee',
    },
})

sasasak.play()
```

## Options

| 이름 | 타입 | 설명 |
| - | - | - |
| wrapStyle | Object | [HTML DOM Style Object](https://www.w3schools.com/jsref/dom_obj_style.asp) |

## Methods

| 이름 | 설명 |
| - | - |
| play | 애니메니션을 시작합니다 |


## Browser compatibility

브라우저 호환성은 html2canvas와 동일하며 아직 테스트를 진행하지 않아서 정확하지 않을 수 있습니다.

- Firefox 3.5+
- Google Chrome
- Opera 12+
- IE9+
- Edge
- Safari 6+
