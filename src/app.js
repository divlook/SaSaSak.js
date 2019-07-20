import 'github-markdown-css/github-markdown.css'
import './css/app.scss'

if (typeof window.SaSaSakJs !== 'undefined') {
    const playZone = document.querySelector('.play-zone')
    const sasasak = new SaSaSakJs(playZone.querySelector('.sasasak'), {
        mounted() {
            playZone.classList.add('mounted')
        },
    })

    document.querySelector('.play').addEventListener('click', () => {
        sasasak.play()
    })
}