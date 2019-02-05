import 'babel-polyfill'
import 'coffeekraken-sugar/js/features/all'
import SCursorComponent from '../../../dist/index'
import SIconComponent from 'coffeekraken-s-icon-component'

SCursorComponent.applyHandlerOn('fit-square', '.btn')

// document.querySelector('s-cursor').addEventListener('sticked', e => {
//   console.log('sticked', e.detail.$sticked, e.detail.$target)
// })
// document.querySelector('s-cursor').addEventListener('unsticked', e => {
//   console.warn('unsticked', e.detail.$sticked, e.detail.$target)
// })
