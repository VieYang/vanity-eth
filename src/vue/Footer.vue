<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6 links">
                    <a href="https://www.newtonproject.org/" target="_blank">
                        <i class="icon-star"></i>&nbsp;&nbsp;&nbsp;访问Newton官网
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style lang="sass" scoped>
    @import "../css/variables"
    footer
        padding: 1rem 0 0.5rem
        background-color: $panel-background
        color: $text-alt
        a
            text-decoration: none
        .address
            margin-bottom: 20px
            color: $text
            a
                font-family: $monospace-font
                margin-left: 15px
                word-break: break-all
        .links
            text-align: right
            a
                margin-right: 30px
                padding-bottom: 2px
                i
                    font-size: 1.2em

    @media screen and (max-width: 480px)
        footer
            padding-bottom: 1em
</style>
