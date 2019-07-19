import 'github-markdown-css/github-markdown.css'

if (typeof window.SaSaSakJs !== 'undefined') {
    const sasasak = new SaSaSakJs(document.querySelector('.sasasak'), {
        wrapStyle: {
            display: 'inline-flex',
            border: '4px solid #eee',
            backgroundColor: '#eee',
        }
    })

    document.querySelector('#btn').addEventListener('click', () => {
        sasasak.play()
    })
}