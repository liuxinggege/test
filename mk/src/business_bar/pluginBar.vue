<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .contents{
      width: 500px;
      background-color:#FFFFFF;
      z-index: 999999;
      display: inline-block;
      left:10px;
      top:45px;
      height:400px;
      border:1px solid #dddee1;
    }
   .video-js{
   	 width: 500px !important;
   	 height: 400px !important;
   }
</style>

<template>
    <div>
         <div class="contents">
         	  <video id="my_video_1" class="video-js vjs-default-skin" controls preload="metadata" width="500" height="400" data-setup='{}'>
			        browser not supported.
			  </video>
         </div>
  </div>
</template>
<script>
var player;
export default {
  name:'pluginBar',
  data () {
    return {
        url:""
     }
  },
  computed: {
    
  },
  methods: {
        init(){
            let me = this
            player = videojs('my_video_1');
            player.on("error", function() {
                player.setTimeout(function() {
                    me.startplay(this)
                }, 2000)
            });
            player.on("stalled", function() {
                player.setTimeout(function() {
                    me.startplay(this)
                }, 2000)
            });
            player.ready(function(){
              
            });
        },
        changeUrl(url){
            this.url = url
            this.startplay(player)
        },
        startplay(myPlayer) {
            myPlayer.reset();
            myPlayer.src({ type: "application/x-mpegURL", src: "http://192.168.0.151:1935/"+this.url+'.m3u8'});
            myPlayer.load("http://192.168.0.151:1935/"+this.url+'.m3u8');
            setTimeout(function() {
              myPlayer.play()
            },1000)
        }
   },
  mounted () { 	 
        this.init()
  }
}
</script>

