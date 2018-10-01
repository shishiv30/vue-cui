import _load from './_load'
import _loadmap from './_load.map'
import _localstorage from './_localstorage'
import _device from './_device'
import _delay from './_delay'

var jqext = {}
Object.assign(jqext, _load)
Object.assign(jqext, _loadmap)
Object.assign(jqext, _localstorage)
Object.assign(jqext, _device)
Object.assign(jqext, _delay)

export default jqext
