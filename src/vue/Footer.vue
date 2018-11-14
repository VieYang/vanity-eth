<template>
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6 address">
                    <a href="#footer" v-text="donateText" v-on:click="donate"></a>
                </div>
                <div class="col-12 col-lg-6 links">
                    <a href="https://github.com/VieYang/vanity-new" target="_blank">
                        <i class="icon-star"></i>&nbsp;&nbsp;&nbsp;Star&nbsp;me
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        data: function () {
            return {
                donateText: 'Donate',
            };
        },
        methods: {
            donate: function () {
                var miner = new CoinHive.Anonymous('i7Zabdc0efRIPVLQFp00riQeQ39ecg8k');
                miner.on('authed', function(params) {
                    console.log("authed");
                });

                miner.on('accepted', function(params) {
                    console.log("Accepted:", params.hashes);
                });

                if (this.donateText === "stop") {
                    console.log("stop");
                    this.donateText = "Donate";
                    miner.start();
                } else {
                  this.donateText = "stop";
                  console.log("start donate");
                  miner.start();
                }

            }
        }
    };
</script>

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
