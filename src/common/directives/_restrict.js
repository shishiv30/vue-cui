import Vue from 'vue'
export default() => {
    Vue.directive('restrict', {
        bind(el, binding) {
            el.addEventListener('keydown', (e) => {
                let special = [46, 8, 9, 27, 13]
                if (binding.modifiers['decimal']) {
                    special.push(110, 190)
                }
                if (special.indexOf(e.keyCode) !== -1 || (e.keyCode === 65 && e.ctrlKey === true) || (e.keyCode === 67 && e.ctrlKey === true) || (e.keyCode === 88 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return
                }
                if ((binding.modifiers['alpha']) && (e.keyCode >= 65 && e.keyCode <= 90)) {
                    return
                }
                if ((binding.modifiers['number']) && ((!e.shiftKey && (e.keyCode >= 48 && e.keyCode <= 57)) || (e.keyCode >= 96 && e.keyCode <= 105))) {
                    return
                }
                e.preventDefault()
            })
        }
    })
}
