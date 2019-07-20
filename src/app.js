import 'github-markdown-css/github-markdown.css'
import './css/app.scss'

if (typeof window.SaSaSakJs !== 'undefined') {
    document.querySelectorAll('.play-zone').forEach(playZone => {
        new SaSaSakJs(playZone.querySelector('.sasasak'), {
            mounted() {
                playZone.classList.add('mounted')
                playZone.querySelector('.play').addEventListener('click', () => {
                    this.play()
                })
            },
        })
    })
}
