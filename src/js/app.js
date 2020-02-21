class Flip {
    /**
     * Initialize a new instance of Flip
     * 
     * @param {Number} duration Duration in ms
     */
    constructor(duration = 500) {
        this.duration = duration
        this.positions = {}
    }

    /**
     * Read and cache bounding client rects of passed elements.
     * 
     * @param {HTMLElement[]} elements 
     */
    read (elements) {
        elements.forEach(element => {
            this.positions[element.id] = element.getBoundingClientRect()
        })
    }

    /**
     * Play the animation
     * 
     * @param {HTMLElement[]} elements 
     */
    play(elements) {
        return Promise.all(elements.map(element => 
            new Promise(resolve => {

                const oldPosition = this.positions[element.id]
                const newPosition = element.getBoundingClientRect()
                const diff = boundingRectSum(oldPosition, newPosition)

                // animate
                element.animate([{
                        transform: `translate(${diff.x}px, ${diff.y}px) scale(${diff.width}, ${diff.height})`
                    }, {
                        transform: `none`
                    }
                ], {
                    duration: this.duration,
                    easing: 'ease-in-out',
                    fill: 'both'
                })

                setTimeout(() => {
                // On retire la classe de transition
                    element.classList.remove('is-flipping')
                    resolve()
                }, this.duration)
        })))
    }
}

// Fetch elements
const elements = Array.from(document.querySelectorAll('.card'))

elements.forEach(element => 
    element.addEventListener('click', async () => {
        const flip = new Flip()
        flip.read(elements)
        element.classList.add('is-flipping-scale')
        await wait(200)
        element.classList.toggle('expanded')
        await flip.play(elements)
        element.classList.remove('is-flipping-scale')
    }))



/**
 * @param {DOMRect} a 
 * @param {DOMRect} b 
 * @return {DOMRect}
 */
function boundingRectSum (a, b) {
    return { x: a.x - b.x, y: a.y - b.y, width: a.width / b.width, height: a.height / b.height }
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} classToAdd 
 */
function addTransition (element, classToAdd) {

    return new Promise((resolve, reject) => {
        element.addEventListener('transitionend', resolve)
        element.classList.add(classToAdd)
        // element.removeEventListener('transitionend', resolve)
    })

}