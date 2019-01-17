import _fullscreen from './_fullscreen';
import _inital from './_inital';
import _restrict from './_restrict';
import _scrollerx from './_scrollerx';
import validation from './_validation';

export default () => {
    _fullscreen();
    _inital();
    _restrict();
    _scrollerx();
    validation();
};