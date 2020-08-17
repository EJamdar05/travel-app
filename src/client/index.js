import { performAction } from './js/app.js'
import { checkForName } from './js/properInput.js'

import './styles/style.scss'

document.getElementById('generate').addEventListener('click', performAction)
export {
    performAction,
    checkForName
}