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
    play(cnt = 10, isClick = true) {
        if (this.isMounted && isClick && this.isPlaying) {
            return
        } else if (isClick && !this.isPlaying) {
            this.isPlaying = true
        }

        cnt--

        for (let index = 0; index < 100; index++) {
            let random = Math.random()
            let _percent = Math.floor(random * 100) % 20 + 1
            let _plusMinus = Math.floor(random * 10) % 2 === 0 ? 1 : -1
            let _zero = Math.pow(10, (this.lineMinLength.toString().length))

            let lineWidth = Math.floor(random * 100) % 3 + 1
            let lineLength = this.lineMinLength + Math.floor(this.lineMinLength / 100) * _percent * _plusMinus
            let x = Math.floor(random * _zero) % this.lineMinLength * _percent * _plusMinus + 1
            let y = Math.floor(random * _zero) % this.lineMaxLength + 1 + Math.floor(this.lineMaxLength / 100) * _percent
            let lineRotate = (365 - (Math.floor(random * 100) % 15 + 20)) * Math.PI / 180

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

        if (cnt > 0) {
            setTimeout(() => {
                this.play(cnt, false)
            }, 10)
        } else if (!this.checkEmptyCanvas()) {
            setTimeout(() => {
                this.play(10, false)
            }, 10)
        } else {
            this.isPlaying = false
        }
    }
    checkEmptyCanvas() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        let total = imageData.data.length
        let remainingPixels = imageData.data.filter(row => row !== 0).length

        if (process.env.NODE_ENV !== 'production') {
            console.log(`total: ${total}\nremainingPixels: ${remainingPixels}\nend: ${total * 0.1 > remainingPixels}\n`)
        }
        return total * 0.1 > remainingPixels
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
