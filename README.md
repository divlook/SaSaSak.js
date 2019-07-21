# SaSaSak.js

**Element를 사사삭! 하고 지워보자**

SaSaSak.js는 [html2canvas](https://html2canvas.hertzen.com/) 라이브러리를 사용하여 Element를 canvas로 만든 뒤 사사삭!하고 지웁니다

## Notice

- scrollbar 문제

    페이지가 길어져서 scrollbar가 생기면 canvas가 그려질 때 scrollbar의 크기만큼 밀리는 현상이 발생합니다.

    이 문제를 해결하기 위해 인스턴스를 생성할 때 document.body의 overflow를 hidden으로 변경하였다가 canvas가 그려지면 overflow를 지워주고 있습니다.

    document.body에 overflow를 변경하고 싶으시면 [Mounted](#mounted) 옵션을 사용해주세요.

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

| 이름 | 타입 | 기본값 | 설명 |
| - | - | - | - |
| wrapStyle | Object | [Default wrapStyle](#default-wrapStyle) | [HTML DOM Style Object](https://www.w3schools.com/jsref/dom_obj_style.asp) |
| strokeMinWidth | Number | 2 | 선의 최소 두께 (단위: px) |
| strokeMaxWidth | Number | 4 | 선의 최대 두께 (단위: px) |
| strokeMinRotate | Number | 15 | 선의 최소 회전각도 |
| strokeMaxRotate | Number | 30 | 선의 최대 회전각도 |
| maxCountOfOnceScratch | Number | 1000 | 한 번 스크래치할 때 그리는 선의 최대 개수 (최소 `10`)<br>개수가 `100`보다 적거나 `1000`이 넘어가면 성능상 좋지 않습니다. |
| completionRate | Number | 0.6 | play 애니메이션을 종료할 완성도. (범위: 0 < completionRate <= 1) |
| completed | Function | | play 애니메이션이 끝난 후 실행되는 이벤트입니다. [Completed](#completed) |
| useScrollRestoration | Boolean | false | Chrome 46+에서 스크롤 위치를 기억했다가 자동으로 복원하는 기능의 사용여부입니다.<br>이 기능을 사용하시면 `canvas`가 제대로 그려지지 않을 수 있습니다. |
| showLog | Boolean | false | Chrome console에서 play 애니메이션의 로그를 볼 수 있습니다. |

### Default wrapStyle

```json
{
    "position": "relative"
}
```

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

## Property

| 이름 | 타입 | |
| - | - | - |
| isMounted | Boolean | 실행이 준비되었는지에 대한 여부 |
| isPlaying | Boolean | 실행이 진행중인지에 대한 여부 |
| isComplete | Boolean | 실행이 완료되었는지에 대한 여부 |
| wrapEl | Element | canvas를 감싸고 있는 Element.<br>`sasasak` className을 가지고 있으며 mounted시 `sasasak-mounted` className이 추가 됩니다. |
| canvas | Element | |

## Methods

### sasasak.play()

애니메이션을 시작합니다

- Return value

    play에 실패하면 ErrorCode를 반환합니다.

    |ErrorCode| |
    |-|-|
    | is_not_mounted | mounted가 되지 않음 |
    | is_playing | 이미 실행중 |
    | is_complete | 실행이 완료됨 |

```js
var sasasak = new SaSaSakJs('.sasasak')
var btn = document.querySelector('button')

btn.addEventListener('click', function() {
    var errorCode = sasasak.play()

    switch (errorCode) {
        case 'is_not_mounted':
            alery('아직 준비되지 않았습니다.')
            break
        case 'is_playing':
            alery('실행중입니다.')
            break
        case 'is_complete':
            alery('실행이 완료되었습니다.')
            break
        default:
            alery('실행이 시작되었습니다.')
            break
    }
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
