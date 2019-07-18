const SaSaSakJs = require('./sasasak')

const sasasak = new SaSaSakJs(document.querySelector('.sasasak'))

document.querySelector('#btn').addEventListener('click', () => {
    sasasak.play()
})