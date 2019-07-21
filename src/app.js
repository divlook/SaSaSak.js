import 'github-markdown-css/github-markdown.css'
import './css/app.scss'

if (typeof window.SaSaSakJs !== 'undefined') {
    document.querySelectorAll('.play-zone').forEach((playZone) => {
        let options = {}

        if (playZone.classList.contains('ticket')) {
            options.strokeMinWidth = 6
            options.strokeMaxWidth = 10
            options.strokeMinRotate = 0
            options.strokeMaxRotate = 20
            options.maxCountOfOnceScratch = 600
            options.completionRate = 0.4
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
