import 'github-markdown-css/github-markdown.css'
import './css/app.scss'

if (typeof window.SaSaSakJs !== 'undefined') {
    document.querySelectorAll('.play-zone').forEach((playZone) => {
        let options = {}

        if (playZone.classList.contains('ticket')) {
            options.strokeMinWidth = 2
            options.strokeMaxWidth = 5
            options.strokeMinRotate = -10
            options.strokeMaxRotate = 30
            options.maxCountOfOnceScratch = 500
        }

        new SaSaSakJs(playZone.querySelector('.sasasak'), {
            ...options,
            mounted() {
                playZone.classList.add('mounted')
                playZone.querySelector('.play').addEventListener('click', () => {
                    this.play()
                })
            },
        })
    })
}
