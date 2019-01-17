import Vue from 'vue';
import validation from '../utilities/validation';


function validateMessage(validateTypes, value) {
    var result = validation.valide(validateTypes, value);
    if (result.passed) {
        return '';
    }
    if (result.type === 'required') {
        return `The field is ${result.type}`;
    }
    return `Invalide ${result.type}`;
}
export default () => {
    Vue.directive('validation', {
        bind(el, binding, vnode) {
            var component = vnode.componentInstance;
            var $input = $(component.getInput());
            var validateTypes = binding.modifiers;
            var customeMessage = binding.expression;
            $input.on('change', function () {
                var value = component.getValue();
                var msg = validateMessage(validateTypes, value);
                component.setError(customeMessage || msg);
            });
        }
    });
};