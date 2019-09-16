<style type="text/css">
#myOverviewDiv {
    position: absolute;
    width:200px;
    height:120px;
    bottom: 5px;
    right: 20px;
    background-color: aliceblue;
    z-index: 300; /* make sure its in front */
    border: solid 1px blue;
    cursor: pointer;
  }
  #searchInfo{
  	position: absolute;
  	top: 420px;
  	left: 10px;
  	z-index: 20000;
  }
  #myInspector{
  	position: absolute;
  	top:180px;
  	left: 10px;
  	background-color: #808080;
  }
  #infoBoxHolder {
    z-index: 300;
    position: absolute;
    left: 5px;
  }

  #infoBox {
    border: 1px solid #999;
    padding: 8px;
    background-color: whitesmoke;
    opacity:0.9;
    position: relative;
    font-family: arial, helvetica, sans-serif;
    font-weight: bold;
    font-size: 11px;
  }
  #infoBox:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }

  div.infoTitle {
    max-width: 250px;
    font-weight: normal;
    color:  #000;
    margin-left: 4px;
  }
  #showtype{
  	position: absolute;
  	bottom:150px;
  	background-color: #C0C0C0;
  	width: 200px;
  	right: 20px;
  	z-index: 900;
  }
  .OverviewDiv{
  	right:20px;
  	bottom: 200px;
  	position: absolute;
  	z-index: 1000;
  }
</style>
<template>
    <div id="sample" style="position: relative;top:-55px">
	  <div id="myDiagramDiv" :style="{backgroundColor:'#B2EFF8',border: 'solid 1px #ccc',width: '100%',top:'90px',overflow: 'auto'}"></div>
	  <div id="myOverviewDiv"></div>
	  <el-button class="OverviewDiv" @click="showData" type="primary" size="mini">
          <i :class="showdata?'el-icon-caret-right':'el-icon-caret-left'"></i>
       </el-button>
	  <div id="infoBoxHolder" style="display: inline-block; vertical-align: top;">
	  </div>
	  <div id="showtype" v-if="showdata">
      	  <h4 class="tagcss">一级报警:<Tag  :style="{backgroundColor:state.colorData.level1,marginLeft:'90px'}"></Tag></h4>
      	  <h4 class="tagcss">二级报警:<Tag  :style="{backgroundColor:state.colorData.level2,marginLeft:'90px'}"></Tag></h4>
      	  <h4 class="tagcss">三级报警:<Tag  :style="{backgroundColor:state.colorData.level3,marginLeft:'90px'}"></Tag></h4>
      	  <h4 class="tagcss">四级报警:<Tag  :style="{backgroundColor:state.colorData.level4,marginLeft:'90px'}"></Tag></h4>
      	  <h4 class="tagcss">正常：<span style="color: blue">————</span>中断：<span style="color: red;">-----------</span></h4>
    </div>
    <short-cut style="position: absolute" ref="shortCut"></short-cut>
</div>
</template>
<script>
import api from 'src/api'
import store from 'src/store'
import _ from 'lodash'
import ShortCut from '../../business_bar/shortcut.vue'

export default {
    name: 'topo',
    components: {
    	ShortCut
    },
    data () {
    	return {
    		state:store.state,
    		action:store.actions,
    		nodeDataArray:[],
    		hashList:{},
    		myDiagram:'',
    		showdata:false,
    		columns:[],
    		tabdata:[],
    		contentHeight:'',
    		intervalId:'',
    	}
    },
    watch: {
	},
    methods: {
    	showData(){
    		this.showdata = !this.showdata
    	},
    	init(){
    		  var nodeDataArray = JSON.parse(window.localStorage.getItem('nodeDataArray'))
    		  //先取出拓扑图的关系数据结构
    		  var lastStroked = null;
		      var $ = go.GraphObject.make;  // for conciseness in defining templates
		      var myToolTip = $(go.HTMLInfo, {
			      show: showToolTip,
			      // do nothing on hide: This tooltip doesn't hide unless the mouse leaves the diagram
			  })
		      var myDiagram =
		        $(go.Diagram, "myDiagramDiv",
		          {
		            initialDocumentSpot: go.Spot.Left,//页面靠左显示
		            initialViewportSpot: go.Spot.Left,
		            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,//允许缩放
		            mouseOver: doMouseOver,//鼠标悬浮事件
		            nodeTemplate:
		              $(go.Node, "Spot",
		                {
				          selectable: false,
				          toolTip: myToolTip
				        },
		                { width: 160, height:26},//块显示的宽高
		                $(go.Shape, "Rectangle",
		                   new go.Binding("fill", "",showColor),//传感器的背景颜色
		                   //new go.Binding("fill", "isHighlighted", function(h) { return h ? "#F44336" : "#A7E7FC"; }).ofObject()
		                ),
		              $(go.Panel, "Table",
			          {maxSize: new go.Size(160, NaN) },
			          $(go.RowColumnDefinition,
			            {
			              column: 0,
			              stretch: go.GraphObject.Horizontal,
			              alignment: go.Spot.Left
			            }),
			          // the name
			          $(go.Picture,
			            {
			              row: 0, column: 1,margin: 2,
			              imageStretch: go.GraphObject.Uniform,
			              alignment: go.Spot.Left
			            },
			            // only set a desired size if a flag is also present:
			            new go.Binding("desiredSize", "", function(){ return new go.Size(14, 14) }),//图标大小
			            new go.Binding("source", "", theNationFlagConverter)),//显示对应的图标
			           $(go.TextBlock,
			            {
			              row: 0, column: 2,margin: 2,
			              maxSize: new go.Size(160, NaN),
			              font: "530 9px Roboto, sans-serif",
			              alignment: go.Spot.Left
			            },
			            new go.Binding("text", "",theNameConverter)),//显示的文字
			        )),

		            // Define the template for Links, just a simple line
		            linkTemplate:
		              $(go.Link,
		              	  {
				            routing: go.Link.AvoidsNodes,
				            curve: go.Link.JumpOver,
		//		            corner: 3,
				            relinkableFrom: true, relinkableTo: true,
		//		            selectionAdorned: false, // Links are not adorned when selected so that their color remains visible.
		//		            shadowOffset: new go.Point(0, 0), shadowBlur: 5, shadowColor: "blue",
				          },
		                $(go.Shape,
			            { name: "SHAPE", strokeWidth: 2, stroke: 'blue',strokeDashArray:[]},
			            new go.Binding("strokeDashArray", "now_status", linkProblemConverter),//虚线 now_status==5 且为红色
			            new go.Binding("stroke", "now_status", linkcolorConverter)  //实线  now_status！=5
			            )),
		            layout: $(go.TreeLayout,{nodeSpacing:1.6})
		          });
			      myDiagram.model =
			      $(go.TreeModel,
			        {   // this property refers to the parent node data
			          isReadOnly: true,
			          nodeParentKeyProperty: "parent",//parent 为连接点
			          nodeDataArray: nodeDataArray
			        });
			     var myOverview =
			      $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
			        { observed: myDiagram, contentAlignment: go.Spot.Center });
			    function theNationFlagConverter(info) {
			      //console.log(info)
			      if(info.path){
			        return "./static/svg/" + info.path;
			      }else{
			      	return ''
			      }
			    }
			    function theNameConverter(info){
			   	  if(info.path){
			        return info.name
			      }else{
			      	return info.name2
			      }
			    }
			    //悬浮显示信息
			    function doMouseOver(e) {
			      if (e === undefined) e = myDiagram.lastInput;
			      var doc = e.documentPoint;
			      //console.log(myDiagram)
			      var list = myDiagram.findObjectsNear(doc, 100, null, function(x) { return x instanceof go.Node; });
			      // now find the one that is closest to e.documentPoint
			      var closest = null;
			      list.each(function(node) {
			          closest = node;
			      });
			      showToolTip(closest, myDiagram);
			    }
			    function showToolTip(obj, diagram) {
			      if (obj !== null) {
			        var node = obj.part;
			        var e = diagram.lastInput;
			        if(node.data.path){
			          updateInfoBox(e.viewPoint, node.data);
			        }
			      } else {
			        if (lastStroked !== null) lastStroked.stroke = null;
			        lastStroked = null;
			        document.getElementById("infoBoxHolder").innerHTML = "";
			      }
			    }
			    function showColor(info){
					if(info.showColor){
						return info.showColor
					}else{
						return '#A7E7FC'
					}
				}
			    function linkProblemConverter(status) {
			        if (status==5) {
			        	return [4,2]//虚线
			        }else{
			         	return []//实线
			         }
			    }
			    function linkcolorConverter(status){
			      	if (status==5) {
			      		return 'red'
			      	}else{
			      		return 'blue'
			      	}
			      }
			    function updateInfoBox(mousePt, data) {
				    var box = document.getElementById("infoBoxHolder");
				    box.innerHTML = "";
					var infobox = document.createElement("div");
					infobox.id = "infoBox";
					box.appendChild(infobox);
					if (data.alais) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "简称:" + data.alais;
						infobox.appendChild(child);
					}
					if (data.name) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "名称:" + data.name;
						infobox.appendChild(child);
					}
					if (data.statusText) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "状态:" + data.statusText;
						infobox.appendChild(child);
					}
					if (data.currentText) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "交流/直流:" + data.currentText + '(' + data.percent + ')';
						infobox.appendChild(child);
					}
					if (data.now_value) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "当前值:" + data.now_value;
						infobox.appendChild(child);
					}
					if (data.position) {
						var child = document.createElement("div");
						child.className = "infoTitle";
						child.textContent = "安装位置:" + data.position;
						infobox.appendChild(child);
					}
					box.style.left = mousePt.x + 10 + "px";
					box.style.top = mousePt.y + 20 + "px";
				}
			    // Make sure the infoBox is momentarily hidden if the user tries to mouse over it
			    var infoBoxH = document.getElementById("infoBoxHolder");
			    infoBoxH.addEventListener("mousemove", function() {
			      var box = document.getElementById("infoBoxHolder");
			      box.style.left = parseInt(box.style.left) + "px";
			      box.style.top = parseInt(box.style.top)+30 + "px";
			    }, false);

			    var diagramDiv = document.getElementById("myDiagramDiv");
			     var height = (document.body.clientHeight - 150)+'px'
			     diagramDiv.style.height = height
			     //考虑到全屏  自适应屏幕
			     window.addEventListener('resize', function(e){
			     	var height = (document.body.clientHeight - 150)+'px'
			        diagramDiv.style.height = height
			     })
			    // Make sure the infoBox is hidden when the mouse is not over the Diagram
			    diagramDiv.addEventListener("mouseout", function(e) {
			      if (lastStroked !== null) lastStroked.stroke = null;
			      lastStroked = null;

			      var infoBox = document.getElementById("infoBox");
			      var elem = document.elementFromPoint(e.clientX, e.clientY);
			      if (elem !== null && (elem === infoBox || elem.parentNode === infoBox)) {
			        var box = document.getElementById("infoBoxHolder");
			        box.style.left = parseInt(box.style.left) + "px";
			        box.style.top = parseInt(box.style.top)+30 + "px";
			      } else {
			        var box = document.getElementById("infoBoxHolder");
			        box.innerHTML = "";
			      }
			    }, false);
			    function loop(){
//			    	console.log('update')
			    	var model = myDiagram.model;//获取所有数据
			   	    var arr = model.nodeDataArray;
			        for (var i = 0; i < arr.length; i++) {
//			        	console.log(window.vuef)
                       //通过hash表的更新 实时更新连线状态等
				        if(window.vuef.state.AllhashSensor[arr[i].k]){
			          	   var k = arr[i].k
				          	arr[i].alais = window.vuef.state.AllhashSensor[k].alais
				          	arr[i].now_value = window.vuef.state.AllhashSensor[k].now_value
				          	arr[i].showColor = window.vuef.state.AllhashSensor[k].showColor
				          	arr[i].now_status = window.vuef.state.AllhashSensor[k].now_status
				          	arr[i].statusText = window.vuef.state.AllhashSensor[k].statusText
				          	arr[i].position = window.vuef.state.AllhashSensor[k].position
				          	if(window.vuef.state.AllhashSensor[k].currentText){
				          	   arr[i].currentText = window.vuef.state.AllhashSensor[k].currentText
				          	}
				          	if(window.vuef.state.AllhashSensor[k].percent){
				          	  arr[i].percent = window.vuef.state.AllhashSensor[k].percent
				          	}
			                model.updateTargetBindings(arr[i])
			          }else{
			          	model.updateTargetBindings(arr[i])//更新每个节点对应的连线和内容
			          }
			        }
			    }
			    window.vuef.intervalId = setInterval(() => {
					loop()//每六秒检查一次连接状态
				},6000)
        },
    },
    beforeDestroy: function (){
       //console.log('clean')
       clearInterval(this.intervalId)//清除定时器
    },
    mounted () {
       window.vuef = this
       window.vuef.state.Kindex = window.localStorage.getItem('storeIndex')
       window.vuef.init()
       //初始化构建拓扑图 关键是实时监听传感器之间的连接状态  传感器的实时值、图标状态的显示 颜色的显示
    }
};
</script>
