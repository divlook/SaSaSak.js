const html2canvas = require('html2canvas')

class SaSaSakJs {
    constructor(el, option = null) {
        let hasOption = option && typeof option === 'object'
        this.isMounted = false
        this.isPlaying = false
        this.isComplete = false
        this.el = null
        this.wrapEl = null
        this.canvas = null
        this.ctx = null
        this.option = {}
        this.defaultWrapStyle = {
            position: 'relative',
        }
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

        if (hasOption) {
            if (option.wrapStyle && typeof option.wrapStyle === 'object') this.option.wrapStyle = option.wrapStyle
            if (option.mounted && typeof option.mounted === 'function') this.option.mounted = option.mounted.bind(this)
            if (option.completed && typeof option.completed === 'function') this.option.completed = option.completed.bind(this)
        }

        this.init()
    }

    async init() {
        this.createWrapper()
        await this.createCanvas()
        this.wrapEl.classList.add('sasasak-mounted')
        this.isMounted = true
        if (typeof this.option.mounted === 'function') this.option.mounted()
    }
    createWrapper() {
        if (this.isMounted) return
        this.wrapEl = document.createElement('div')
        this.wrapEl.classList.add('sasasak')
        let wrapStyle = {
            ...this.defaultWrapStyle,
            ...this.option.wrapStyle,
        }
        for (let key in wrapStyle) {
            if (key in this.wrapEl.style) this.wrapEl.style[key] = wrapStyle[key]
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
                width: this.el.clientWidth,
                height: this.el.clientHeight,
            }).then(canvas => {
                let img = new Image()
                img.width = this.wrapEl.clientWidth
                img.height = this.wrapEl.clientHeight
                img.src = canvas.toDataURL()
                img.onload = () => {
                    this.canvas = document.createElement('canvas')
                    this.canvas.width = this.wrapEl.clientWidth * window.devicePixelRatio
                    this.canvas.height = this.wrapEl.clientHeight * window.devicePixelRatio
                    this.canvas.style.width = this.wrapEl.clientWidth + 'px'
                    this.canvas.style.height = this.wrapEl.clientHeight + 'px'

                    this.ctx = this.canvas.getContext('2d')
                    this.ctx.drawImage(img, 0, 0)

                    this.wrapEl.appendChild(this.canvas)
                    this.el.hidden = true // this.wrapEl.removeChild(this.el)

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
        if (typeof this.option.completed === 'function') this.option.completed()
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
