const html2canvas = require('html2canvas')

class SaSaSakJs {
    constructor(el, option = null) {
        let hasOption = option && typeof option === 'object'
        this.isMounted = false
        this.isPlaying = false
        this.el = el
        this.wrapEl = null
        this.canvas = null
        this.ctx = null
        this.option = {}
        this.defaultWrapStyle = {
            display: 'inline-flex',
            position: 'relative',
        }
        this.lineMaxLength = 0
        this.lineMinLength = 0
        this.lastRotate = 0

        if (hasOption) {
            if (option.wrapStyle && typeof option.wrapStyle === 'object') this.option.wrapStyle = option.wrapStyle
        }

        this.init()
    }

    async init() {
        if (this.el) {
            this.createWrapper()
            await this.createCanvas()
        }
        this.wrapEl.classList.add('sasasak-mounted')
        this.isMounted = true
    }
    createWrapper() {
        if (this.isMounted) return
        this.wrapEl = document.createElement('div')
        this.wrapEl.classList.add('sasasak')
        let wrapStyle = {
            ...this.wrapEl.style,
            ...this.defaultWrapStyle,
            ...this.option.wrapStyle,
        }
        for (let key in wrapStyle) {
            this.wrapEl.style[key] = wrapStyle[key]
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
                width: this.wrapEl.clientWidth,
                height: this.wrapEl.clientHeight,
            }).then(canvas => {
                let img = new Image()
                img.width = this.wrapEl.clientWidth
                img.height = this.wrapEl.clientHeight
                img.onload = () => {
                    this.canvas = document.createElement('canvas')
                    this.canvas.width = this.wrapEl.clientWidth * window.devicePixelRatio
                    this.canvas.height = this.wrapEl.clientHeight * window.devicePixelRatio
                    this.canvas.style.width = this.wrapEl.clientWidth + 'px'
                    this.canvas.style.height = this.wrapEl.clientHeight + 'px'
                    this.lineMaxLength = Math.max(this.canvas.width, this.canvas.height)
                    this.lineMinLength = Math.min(this.canvas.width, this.canvas.height)
                    this.ctx = this.canvas.getContext('2d')
                    this.ctx.drawImage(img, 0, 0)
                    this.ctx.lineCap = 'round'
                    this.ctx.globalCompositeOperation = 'destination-out'
                    this.wrapEl.removeChild(this.el)
                    this.wrapEl.appendChild(this.canvas)
                    resolve()
                }
                img.src = canvas.toDataURL()
            })
        })
    }
    play(cnt = 1, isClick = true) {
        if (isClick && (!this.isMounted || this.isPlaying)) {
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
            this.isPlaying = false
        }
    }
    checkEmptyCanvas() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let alphas = imageData.data.filter((row, key) => (key + 1) % 4 === 0)
        let total = alphas.length
        let remainingPixels = alphas.filter(row => row > 25).length

        if (process.env.NODE_ENV !== 'production') {
            console.log(`total: ${total}\nremainingPixels: ${remainingPixels}\nend: ${total * 0.4 > remainingPixels}\n`)
        }
        return total * 0.4 > remainingPixels
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
module.exports = SaSaSakJs
