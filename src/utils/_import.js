export default function (component) {
    if (component === 'Layout') {
        return require("@/layout").default
    } else if (component.indexOf("/") > -1) {
        return require('@/views/' + component).default
    } else {
        return require('@/views/' + component + '/index').default
    }
}
