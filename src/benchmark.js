
export default class Benchmark {
    constructor(useBenchmark = true) {
        this.log = {}
        this.useBenchmark = useBenchmark === true
    }

    clear() {
        this.log = {}
    }

    set(label) {
        let ms = Date.now()
        if (!(label in this.log)) this.log[label] = []
        return (value) => {
            if (this.useBenchmark) {
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
                        data: value,
                        time: msg,
                    }
                }
                this.log[label].push(value)
            }
        }
    }

    print() {
        if (!this.useBenchmark) return
        for (let key in this.log) {
            if (!this.log.hasOwnProperty(key)) continue
            console.log(key, this.log[key].reduce((sum, row) => sum + parseFloat(row.time), 0) + 'ms')
            console['table' in console ? 'table' : 'log'](this.log[key])
        }
    }
}
