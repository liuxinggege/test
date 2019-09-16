<style type="text/css">
	#shortcuts{
			position: absolute;
			background-color: #FFF;
			border: 1px solid #C0C0C0;
			transform-origin: center top 0px;
			min-width: 150px;
			z-index: 20000;
		}
		#shortcuts ul{
			margin-top: 10px;
			margin:0;
			padding: 0;
			min-width: 150px;
		}
		#shortcuts li{
			list-style: none;
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;
			white-space: nowrap;
			line-height: normal;
			font-size: 12px!important;
			clear: both;
		}
		#shortcuts li:hover{
			background-color: #adcdef;
		}
</style>
<template>
	<div  id="shortcuts">		
	  <ul>	  	
	  	<li v-for="item in Menudata">
	  		<router-link :to="item.name">{{item.title}}</router-link>
	  	</li>
	  </ul>
	</div>
</template>

<script>
export default {
	data () {
        return {
        	Menudata:[
	    		{
	    			title:'实时报警列表',
	    			name:'/watching-index/nowtimestate/1'
	    		},
	    		{
	    			title:'实时设备故障列表',
	    			name:'/watching-index/nowtimestate/4'
	    	    },
	    	    {
	    			title:'实时状态变动列表',
	    			name:'/watching-index/statechange'
	    	     },
	    	    {
	    			title:'实时报警曲线',
	    			name:'/watching-index/nowtimestate/4'
	    	    },
	    	    {
	    			title:'设备故障查询',
	    			name:{
	    				 name: '/watching-index/analyze', params: {aname: "communicat/1"}
	    			}
	    	    }
	    	],
        }
 	},
	methods:{
		showCut(x,y){
			var wrap = document.getElementById('shortcuts');
			document.oncontextmenu = function(){
			　　return false;
		 	}
			wrap.style.left = x+'px';
			wrap.style.top = y +'px';
			wrap.style.display = 'block';
		},
		cancel(){
			var wrap = document.getElementById('shortcuts');
			wrap.style.display = 'none';
		}
	},
    mounted () {    	
	  	var wrap = document.getElementById('shortcuts'); 
	  	document.oncontextmenu = function(){
		　　return false;
	 	}
	  	wrap.style.display = 'none';  		 
	   	document.onmouseup= function(e){
	   	var e = event || window.event;
	   	 	if(e.button==2){
		   	 	wrap.style.left = e.offsetX+'px';
		     	wrap.style.top = e.offsetY +'px';
		     	wrap.style.display = 'block';
	     	}else{
		     	wrap.style.display = 'none';
		    }
	  	}
    }
};
</script>