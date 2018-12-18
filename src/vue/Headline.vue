<template>
    <!--Github corner-->
    <div>
        <h1>NewChain选号中心</h1>
        <p>选择你喜欢的NewChain地址</p>
    </div>
</template>

<script>
    export default {};
</script>

<style lang="sass" scoped>
    @import "../css/variables"

    div
        margin-bottom: 0em
        color: $logo
        font-family: 'Montserrat', sans-serif
        text-align: center

        h1
            font-size: 3em
            font-weight: 700
            border: 4px solid $logo
            width: 9.8em
            margin: 0 auto

        p
            font-size: 1.5em
            letter-spacing: 2px
            font-weight: 400
            margin-top: 1em

    /*-- Responsive design --

    @media screen and (max-width: 1280px)
        h1
            font-size: 2.8em

    @media screen and (max-width: 1024px)
        div
            margin-bottom: 0em
            h1
                font-size: 2.5em
                border-width: 3px
            p
                font-size: 1.4em
                margin-top: 0.8em

    @media screen and (max-width: 640px)
        div
            margin-bottom: 0em
            h1
                font-size: 2.2em
            p
                font-size: 1.3em
                margin-top: 0.7em

    @media screen and (max-width: 480px)
        h1
            font-size: 2em
            border-width: 2px
        p
            font-size: 1.2em

    @media screen and (max-width: 320px)
        h1
            font-size: 1.6em
        p
            font-size: 1em
</style>
