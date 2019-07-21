import html2canvas from 'html2canvas'

const privateOptions = {
    pageOriginOffset: { left: 0, top: 0 },
    generatingCnt: 0,
    showLog: process.env.NODE_ENV !== 'production',
}

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
        this.logData = {}

        if (el && typeof el === 'object') {
            this.el = el
        } else if (el && typeof el === 'string') {
            this.el = document.querySelector(el)
        } else {
            console.error('파라미터를 확인해주세요.')
            return
        }

        this._init()
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

    async _init() {
        // beforeCreate
        privateOptions.generatingCnt++
        if (privateOptions.generatingCnt === 1) {
            privateOptions.pageOriginOffset.left = window.pageXOffset
            privateOptions.pageOriginOffset.top = window.pageYOffset
            document.body.style.overflow = 'hidden'
            window.scroll(0, 0)
        }

        this._createWrapper()
        await this._createCanvas()

        // created
        privateOptions.generatingCnt--
        if (privateOptions.generatingCnt === 0) {
            document.body.style.overflow = ''
            window.scroll(privateOptions.pageOriginOffset)
        }

        // mounted
        this.wrapEl.classList.add('sasasak-mounted')
        this.isMounted = true
        this.option.mounted()
    }

    _createWrapper() {
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

    _createCanvas() {
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
                    this.ctx.imageSmoothingQuality = 'high'
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

    _checkEmptyCanvas() {
        let logData = this._setLogData('_checkEmptyCanvas')
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
        logData()
        this._setLogData('_checkEmptyCanvas_result')({
            total: this.imageData.total,
            remains: remainingPixelCnt,
            percent: Math.floor((remainingPixelCnt / this.imageData.total) * 100),
            end: this.imageData.total * 0.4 > remainingPixelCnt,
        })

        return this.imageData.total * 0.4 > remainingPixelCnt
    }

    _completed() {
        this.isPlaying = false
        this.isComplete = true
        this.imageData.total = 0
        this.imageData.alphaKeys = []
        this.option.completed()
        this._printLogData()
    }

    _scratch(cnt = 0) {
        cnt += 100
        if (cnt > 1000) cnt = 1000

        let logData = this._setLogData('_scratch')
        for (let index = 0; index < cnt; index++) {
            let random = Math.random()
            let _percent = Math.floor(random * 100) % 20 + 1
            let _plusMinus = Math.floor(random * 10) % 2 === 0 ? 1 : -1
            let _zero = Math.pow(10, (this.lineMaxLength.toString().length - 1))

            let lineWidth = this.lineMaxLength / _zero * (Math.floor(random * 10) % 4 + 1)
            let lineLength = this.lineMaxLength + this.lineMaxLength * (_percent/100) * _plusMinus
            let x = Math.floor(random * _zero * 10) % this.lineMaxLength * (_percent/100) * -3
            let y = Math.floor(random * _zero * 10) % this.lineMaxLength + 1 + Math.floor(this.lineMaxLength / 100) * (_percent/100)
            let lineRotate = (365 - (Math.floor(random * 100) % 20 + 10)) * Math.PI / 180
            let lineAlpha = Math.floor(random * 10) / 10

            this.ctx.globalAlpha = lineAlpha
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
        logData(cnt)

        cnt += Math.floor(cnt * 1.5)

        if (!this._checkEmptyCanvas()) {
            let ms = 1000 - cnt < 0 ? 0 : 1000 - Math.floor(cnt)
            setTimeout(() => {
                this._scratch(cnt)
            }, ms)
        } else {
            this._completed()
        }
    }

    _resetLogData() {
        if (!privateOptions.showLog) return
        Object.keys(this.logData).forEach(key => {
            this.logData[key] = []
        })
    }
    _setLogData(label) {
        let ms = Date.now()
        if (!(label in this.logData)) this.logData[label] = []
        return (value) => {
            if (privateOptions.showLog) {
                let msg = `${Date.now() - ms}ms`
                if (!value) {
                    value = { time: msg }
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        value.push(msg)
                    } else {
                        value['time'] = msg
                    }
                } else {
                    value = {
                        value,
                        time: msg,
                    }
                }
                this.logData[label].push(value)
            }
        }
    }
    _printLogData() {
        if (!privateOptions.showLog) return
        for (let key in this.logData) {
            console.log(key, this.logData[key].reduce((sum, row) => sum + parseFloat(row.time), 0) + 'ms')
            console.table(this.logData[key])
        }
    }

    play() {
        if (!this.isMounted) return 'is_not_mounted'
        if (this.isPlaying) return 'is_playing'
        if (this.isComplete) return 'is_complete'
        this.isPlaying = true
        this._resetLogData()
        this._scratch()
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
