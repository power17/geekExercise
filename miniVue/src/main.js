import { createApp } from './mini-vue'
import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: 'hello mini Vue11'
        }
    },
    mounted() {
        setTimeout(() => {
            this.title = 'data change'
        }, 1000)
    },
    render() {
        let node = document.createElement('h2')
        node.textContent = this.title
        return node

    }
}).mount('#app')
