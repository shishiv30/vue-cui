import _load from './_load';
import _loadmap from './_load.map';
import _localstorage from './_localstorage';
import _device from './_device';
import _delay from './_delay';
import createCss from './_createcss';
import utilities from './_utilities';

var jqext = {};
Object.assign(jqext, _load);
Object.assign(jqext, _loadmap);
Object.assign(jqext, _localstorage);
Object.assign(jqext, _device);
Object.assign(jqext, createCss);
Object.assign(jqext, _delay);
Object.assign(jqext, utilities);

export default jqext;