const html2canvas = require('html2canvas')

class SaSaSakJs {
    constructor(el, option = null) {
        let hasOption = option && typeof option === 'object'

        this.el = el
        this.wrapEl = null
        this.oriCanvas = null
        this.img = null
        this.canvas = null
        this.option = {}
        this.defaultWrapStyle = {
            display: 'inline-flex',
            position: 'relative',
        }

        if (hasOption) {
            if (option.wrapStyle && typeof option.wrapStyle === 'object') this.option.wrapStyle = option.wrapStyle
        }

        this.init()

        setTimeout(() => {
            this.updateImg((canvas => {
                let ctx = canvas.getContext('2d')
                ctx.save()
                // Create a shape, of some sort
                ctx.beginPath()
                ctx.moveTo(30, 30)
                ctx.lineTo(100, 30)
                ctx.lineTo(130, 10)
                ctx.lineTo(160, 60)
                ctx.arcTo(40, 70, 120, 0, 10)
                ctx.lineTo(160, 130)
                ctx.lineTo(100, 150)
                ctx.lineTo(70, 130)
                ctx.lineTo(20, 130)
                ctx.lineTo(50, 70)
                ctx.closePath()
                // Clip to the current path
                ctx.clip()
                ctx.drawImage(this.img, 0, 0)
                // Undo the clipping
                ctx.restore()
            }))
        }, 2000)
    }

    async init() {
        if (this.el) {
            this.createWrapper()
            await this.createCanvas()
            this.createImg()
        }
    }
    createWrapper() {
        this.wrapEl = document.createElement('div')
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
    async createCanvas() {
        this.oriCanvas = await html2canvas(this.el, {
            width: this.wrapEl.clientWidth,
            height: this.wrapEl.clientHeight,
        }).then(canvas => {
            return canvas
        })
    }
    createImg() {
        this.img = new Image()
        this.img.width = this.wrapEl.clientWidth
        this.img.height = this.wrapEl.clientHeight
        this.img.onload = () => {
            this.canvas = document.createElement('canvas')
            this.canvas.width = this.wrapEl.clientWidth * window.devicePixelRatio
            this.canvas.height = this.wrapEl.clientHeight * window.devicePixelRatio
            this.canvas.style.width = this.wrapEl.clientWidth + 'px'
            this.canvas.style.height = this.wrapEl.clientHeight + 'px'

            let ctx = this.canvas.getContext('2d')
            ctx.save()
            // Create a shape, of some sort
            ctx.beginPath()
            ctx.moveTo(10, 10)
            ctx.lineTo(100, 30)
            ctx.lineTo(130, 10)
            ctx.lineTo(160, 60)
            ctx.arcTo(130, 70, 120, 0, 10)
            ctx.lineTo(160, 130)
            ctx.lineTo(100, 150)
            ctx.lineTo(70, 130)
            ctx.lineTo(20, 130)
            ctx.lineTo(50, 70)
            ctx.closePath()
            // Clip to the current path
            ctx.clip()
            ctx.drawImage(this.img, 0, 0)
            // Undo the clipping
            ctx.restore()

            this.wrapEl.removeChild(this.el)
            this.wrapEl.appendChild(this.canvas)
        }
        this.img.src = this.oriCanvas.toDataURL()
    }
    updateImg(setPath = (canvas) => null) {
        let canvas = document.createElement('canvas')
        canvas.width = this.wrapEl.clientWidth * window.devicePixelRatio
        canvas.height = this.wrapEl.clientHeight * window.devicePixelRatio
        canvas.style.width = this.wrapEl.clientWidth + 'px'
        canvas.style.height = this.wrapEl.clientHeight + 'px'

        if (typeof setPath === 'function') {
            setPath(canvas)
        }

        this.wrapEl.replaceChild(canvas, this.canvas)
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
