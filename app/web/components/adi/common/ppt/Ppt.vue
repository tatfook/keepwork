<template>
    <div class="comp comp-ppt">Hello World!!!</div>
</template>

<script>
import ppt from 'reveal.js'

export default {
    name: 'AdiPpt',
    create() {
        console.log(ppt)
    }
}
</script>

