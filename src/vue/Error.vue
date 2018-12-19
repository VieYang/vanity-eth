<template>
    <div class="panel">
        <p v-if="error === 'workers_unsupported'">
            您的浏览器不支持多线程计算。<br>
            请使用其它浏览器。
        </p>

        <div v-if="error === 'insecure_location'">
            <h3>安全警报</h3>

            您正在使用来自未知网站的vNEW，这可能会窃取您的私钥。<br>
            为了保持安全，请访问网站<a href="https://vieyang.github.io/NewAddress/" target="_blank">vanity-eth.tk</a>来使用。
        </div>
        <p v-else v-html="error.replace('\n', '<br>')"></p>
    </div>
</template>

<script>
    export default {
        props: {
            error: {
                type: String,
                required: true
            }
        }
    };
</script>

<style lang="sass" scoped>
    @import "../css/variables"
    .panel
        background-color: $error
        color: $text-opposite
        a, a:visited, a:hover
            text-decoration: underline
            color: $text-opposite
</style>
