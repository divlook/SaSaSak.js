# SaSaSak.js

**Element를 사사삭! 하고 지워보자**

SaSaSak.js는 [html2canvas](https://html2canvas.hertzen.com/) 라이브러리를 사용하여 Element를 canvas로 만든 뒤 사사삭!하고 지웁니다

## Notice

- scrollbar 문제

    페이지가 길어져서 scrollbar가 생기면 canvas가 그려질 때 scrollbar의 크기만큼 밀리는 현상이 발생합니다.

    이 문제를 해결하기 위해 인스턴스를 생성할 때 document.body의 overflow를 hidden으로 변경하였다가 canvas가 그려지면 overflow를 지워주고 있습니다.

    document.body에 overflow를 변경하고 싶으시면 [Mounted](#mounted) 옵션을 사용해주세요.

- scroll 문제

    동시에 여러개의 인스턴스를 생성시 마지막 스크롤 좌표를 기억 못하는 이슈가 있음.

## Demo

- https://divlook.github.io/SaSaSak.js

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
new SaSaSakJs(Element [, Options])
```
| 이름 | 타입 | 설명 |
| - | - | - |
| Element | HTMLElement or String | Element는 필수 인자값이며, <br>`document.querySelector('.sasasak')` 또는 `".sasasak"` 이런식으로 입력하시면 됩니다.|
| Options | Object | [Options](#options) |

## 예제

```html
<script type="text/javascript" src="dist/js/sasasak.min.js"></script>

<script>
    var sasasak = new SaSaSakJs(document.querySelector('.sasasak'), {
        wrapStyle: {
            display: 'inline-flex',
            border: '4px solid #eee',
            backgroundColor: '#eee',
        },
    })

    document.querySelector('#btn').addEventListener('click', () => {
        sasasak.play()
    })
</script>
```

## Options

| 이름 | 타입 | 설명 |
| - | - | - |
| wrapStyle | Object | [HTML DOM Style Object](https://www.w3schools.com/jsref/dom_obj_style.asp) |
| mounted | Function | `canvas`가 그려진 후 실행되는 이벤트입니다. [Mounted](#mounted) |
| completed | Function | play 애니메이션이 끝난 후 실행되는 이벤트입니다. [Completed](#completed) |

## Event

모든 이벤트는 정해진 상황에 발생하며 `this`를 통해 SaSaSakJs 인스턴스에 접근할 수 있습니다.

### Mounted

`mounted`는 `canvas`가 완전히 그려진 후 실행됩니다.

`mounted` 안에서 `this.play`를 실행하면 `canvas`가 그려진 후 바로 애니메이션이 재생됩니다.

```js
new SaSaSakJs(document.querySelector('.sasasak'), {
    mounted: function() {
        // this.play는 예제입니다. 원하는 내용으로 변경해주세요.
        this.play()
    },
})
```

### Completed

`play`가 끝난 후 실행됩니다.

```js
new SaSaSakJs(document.querySelector('.sasasak'), {
    completed: function() {
        // 원하는 내용을 입력해주세요.
        alert('애니메이션이 끝났습니다.')
    },
})
```

## Methods

| 이름 | 설명 |
| - | - |
| play | 애니메이션을 시작합니다 [Play](#play) |

### Play

애니메이션을 시작합니다

```js
var sasasak = new SaSaSakJs('.sasasak')
var btn = document.querySelector('button')

btn.addEventListener('click', function() {
    sasasak.play()
})
```

## Browser compatibility

브라우저 호환성은 html2canvas와 동일하며 아직 테스트를 진행하지 않아서 정확하지 않을 수 있습니다.

- Firefox 3.5+
- Google Chrome
- Opera 12+
- IE9+
- Edge
- Safari 6+
