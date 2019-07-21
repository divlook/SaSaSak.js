import html2canvas from 'html2canvas'

const pageOriginOffset = { left: 0, top: 0 }

class SaSaSakJs {
    constructor(el, option = null) {
        this.isMounted = false
        this.isPlaying = false
        this.isComplete = false
        this.el = null
        this.wrapEl = null
        this.canvas = null
        this.ctx = null
        this._option = {}
        this.option = option
        this.lineMaxLength = 0
        this.lineMinLength = 0
        this.lastRotate = 0
        this.imageData = {
            total: 0,
            alphaKeys: [],
        }

        if (el && typeof el === 'object') {
            this.el = el
        } else if (el && typeof el === 'string') {
            this.el = document.querySelector(el)
        } else {
            console.error('파라미터를 확인해주세요.')
            return
        }

        this.init()
    }

    get defaultOptions() {
        return {
            wrapStyle: {
                position: 'relative',
            },
            useScrollRestoration: false,
            mounted: () => null,
            completed: () => null,
       }
    }
    get option() {
        return this._option
    }
    set option(option) {
        if (!option || typeof option !== 'object') option = {}

        // wrapStyle
        let wrapStyle = option.wrapStyle && typeof option.wrapStyle === 'object' ? option.wrapStyle : {}
        this._option.wrapStyle = {
            ...this.defaultOptions.wrapStyle,
            ...wrapStyle,
        }

        // Chrome 46+에서 스크롤 위치를 기억 못하게 하기
        this._option.useScrollRestoration = typeof option.useScrollRestoration === 'undefined'
            ? this.defaultOptions.useScrollRestoration
            : option.useScrollRestoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = this._option.useScrollRestoration === true ? 'auto' : 'manual'
        }

        this._option.mounted = option.mounted && typeof option.mounted === 'function'
            ? option.mounted.bind(this)
            : this.defaultOptions.mounted
        this._option.completed = option.completed && typeof option.completed === 'function'
            ? option.completed.bind(this)
            : this.defaultOptions.completed
    }

    async init() {
        // before
        pageOriginOffset.left = window.pageXOffset
        pageOriginOffset.top = window.pageYOffset
        document.body.style.overflow = 'hidden'
        window.scroll(0, 0)

        this.createWrapper()
        await this.createCanvas()
        this.wrapEl.classList.add('sasasak-mounted')
        this.isMounted = true
        this.option.mounted()

        // after
        document.body.style.overflow = ''
        window.scroll(pageOriginOffset)
    }
    createWrapper() {
        if (this.isMounted) return
        this.wrapEl = document.createElement('div')
        this.wrapEl.classList.add('sasasak')

        for (let key in this.option.wrapStyle) {
            if (key in this.wrapEl.style) this.wrapEl.style[key] = this.option.wrapStyle[key]
            else console.error(key, '지원하지 않는 속성')
        }

        this.el.parentNode.insertBefore(this.wrapEl, this.el)
        this.wrapEl.appendChild(this.el)
    }
    createCanvas() {
        return new Promise(resolve => {
            if (this.isMounted) {
                resolve()
                return
            }
            html2canvas(this.el, {
                backgroundColor: 'transparent',
                width: this.el.scrollWidth,
                height: this.el.scrollHeight,
            }).then(canvas => {
                let img = new Image()
                img.width = this.el.scrollWidth
                img.height = this.el.scrollHeight
                img.src = canvas.toDataURL()
                img.onload = () => {
                    this.canvas = document.createElement('canvas')
                    this.canvas.width = this.el.scrollWidth * window.devicePixelRatio
                    this.canvas.height = this.el.scrollHeight * window.devicePixelRatio
                    this.canvas.style.width = this.el.scrollWidth + 'px'
                    this.canvas.style.height = this.el.scrollHeight + 'px'

                    this.ctx = this.canvas.getContext('2d')
                    this.ctx.drawImage(img, 0, 0)

                    this.wrapEl.appendChild(this.canvas)
                    this.wrapEl.removeChild(this.el)

                    this.lineMaxLength = Math.max(this.canvas.width, this.canvas.height)
                    this.lineMinLength = Math.min(this.canvas.width, this.canvas.height)
                    this.ctx.lineCap = 'round'
                    this.ctx.globalCompositeOperation = 'destination-out'

                    resolve()
                }
            })
        })
    }
    play(cnt = 1, isClick = true) {
        if (isClick && (!this.isMounted || this.isPlaying || this.isComplete)) {
            return
        } else if (isClick && !this.isPlaying) {
            this.isPlaying = true
        }

        cnt += 100
        if (cnt > 5000) cnt = 5000

        for (let index = 0; index < cnt; index++) {
            let random = Math.random()
            let _percent = Math.floor(random * 100) % 20 + 1
            let _plusMinus = Math.floor(random * 10) % 2 === 0 ? 1 : -1
            let _zero = Math.pow(10, (this.lineMinLength.toString().length))

            let lineWidth = this.lineMinLength * 0.3 * Math.floor(random * 10) % 3
            let lineLength = this.lineMinLength + this.lineMinLength * (_percent/100) * _plusMinus
            let x = Math.floor(random * _zero) % this.lineMinLength * (_percent/100) * -2
            let y = Math.floor(random * _zero) % this.lineMaxLength + 1 + Math.floor(this.lineMaxLength / 100) * (_percent/100)
            let lineRotate = (365 - (Math.floor(random * 100) % 20 + 20)) * Math.PI / 180

            this.ctx.globalAlpha = Math.floor(random * 10) / 10;
            this.ctx.lineWidth = lineWidth
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(lineLength, y)
            if (this.lastRotate) this.ctx.rotate(-1 * this.lastRotate)
            this.lastRotate = lineRotate
            this.ctx.rotate(this.lastRotate)
            this.ctx.stroke()
            this.ctx.closePath()
        }

        cnt += Math.floor(cnt * 1.5)

        if (!this.checkEmptyCanvas()) {
            let ms = 1000 - cnt < 0 ? 150 : 1000 - Math.floor(cnt)
            setTimeout(() => {
                this.play(cnt, false)
            }, ms)
        } else {
            this.completed()
        }
    }
    checkEmptyCanvas() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let remainingPixelCnt = 0

        if (!this.imageData.total) {
            let alphas = imageData.data.filter((row, key) => {
                if ((key + 1) % 4 === 0) {
                    this.imageData.alphaKeys.push(key)
                    return true
                }
                return false
            })
            this.imageData.total = alphas.length
            remainingPixelCnt = alphas.filter(row => row > 25).length
        } else {
            remainingPixelCnt = this.imageData.alphaKeys.reduce((cnt, key) => {
                if (imageData.data[key] > 25) cnt++
                return cnt
            }, 0)
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`total: ${this.imageData.total}\nremainingPixelCnt: ${remainingPixelCnt}\nend: ${this.imageData.total * 0.4 > remainingPixelCnt}\n`)
        }
        return this.imageData.total * 0.4 > remainingPixelCnt
    }
    completed() {
        this.isPlaying = false
        this.isComplete = true
        this.imageData.total = 0
        this.imageData.alphaKeys = []
        this.option.completed()
    }
}

if (typeof window.SaSaSakJs === 'undefined') {
    window.SaSaSakJs = SaSaSakJs
} else {
    let currentAt = Date.now()
    let className = `SaSaSakJs_${currentAt}`
    window[className] = SaSaSakJs

    console.log(`'SaSaSakJs' has already been declared`)
    console.log(`be use '${className}' instead of 'SaSaSakJs'`)
}

export default SaSaSakJs
