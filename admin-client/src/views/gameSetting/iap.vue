<template>
	<div class="dashboard-outer">
		<el-card class="dashboard-second">
			<el-popover ref="popover1" placement="top-start" itle="标题" width="200" trigger="hover" content="IAP">
			</el-popover>
			<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
			<span class="title">
				<b>IAP</b>
			</span>
			<span style="position:absolute; right:0; top:1">
				<el-button type="primary" style="margin:0 130px 10px 0" icon="el-icon-plus"
					@click="insertIapClick"> 添加
				</el-button>      
			</span>
		
			<el-table :data="iap.goodsInfo" border highlight-current-row style="width: 100%; margin:10px 0px 0 0" max-height="800">
				<el-table-column prop="boundId" label="boundId" min-width="120" align="center" ></el-table-column>
				<el-table-column  label="包名" min-width="300" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
								@click="editNameClick(scope.$index, scope.row)">
							</el-button>
					</template>
				</el-table-column>
				<el-table-column label="IAP" min-width="IAP" align="center" >
					<template slot-scope="scope">
					<el-button type="primary" style="margin:0 10px 10px 0" 
								@click="fixIapClick(scope.$index, scope.row)">详情
							</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="操作" align="center" >
					<template slot-scope="scope">
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
								@click="deleteIap(scope.$index, scope.row)">
							</el-button>
					</template>  
				</el-table-column>
			</el-table>
			<el-col class="toolbar2" style="margin:20px">
				<el-pagination layout="total,sizes,prev, pager, next,jumper" class="pag" 
				@current-change="handleCurrentChange" 
				@size-change="handleSizeChange" 
				:current-page="page" 
				:page-sizes="[10,20,30,50]" 
				:page-size="count" 
				:total="iap.totalCount">
				</el-pagination>
			</el-col>

			<el-dialog :visible.sync="editNameIsible" width=600px >
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">boundId</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="editingBoundid" disabled></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">包名</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="editingName"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editNameClose">取 消</el-button>
					<el-button type="primary" @click="saveEditName">确定</el-button>
				</div>
			</el-dialog>


			<el-dialog :visible.sync="insterIapisible" width=600px >
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">boundId</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="insertBoundId"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">包名</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="insertName"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="insertClose">取 消</el-button>
					<el-button type="primary" @click="saveInsertIap">确定</el-button>
				</div>
			</el-dialog>

			<el-dialog :visible.sync="fixIapisible" width=800px>
				<span class="title">
						<b>IAP</b>
					</span>
				<el-button v-popover:popover1 type='text' class='el-icon-info'></el-button>
				<span style="position:absolute; right:0; top:1">
						<el-button type="primary" style="margin:0 10px 10px 0"  icon="el-icon-plus"
							@click="addOneGoodsClick"> 添加
						</el-button>
						<el-button type="primary" style="margin:0 100px 10px 0" 
							@click="saveGoodsNameInfo" > 保存
						</el-button>                
					</span>
				<el-table :data="fixGoodsInfo" border highlight-current-row style="width: 100%; margin:10px 0px 0 0" max-height="500">
					<el-table-column prop="goodsName" label="goodsName" min-width="180" align="center" ></el-table-column>
					<el-table-column prop="money" label="money" min-width="120" align="center" ></el-table-column>
					<el-table-column prop="price" label="price" min-width="120" align="center" ></el-table-column>
					<el-table-column label="操作" min-width="操作" align="center" width="250">
					<template slot-scope="scope">
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-edit"
								@click="fixOneGoods(scope.$index, scope.row)">
							</el-button>
						<el-button type="primary" style="margin:0 10px 10px 0" icon="el-icon-delete"
								@click="deleteOneGoods(scope.$index, scope.row)">
							</el-button>  
					</template>  
					</el-table-column>
				</el-table>
			</el-dialog> 
			<el-dialog :visible.sync="fixOneGoodsIsible" width=600px>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">goodsName</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="fixOneGoodsNameStr"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">money</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixOneGoodsMoenyStr"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">price</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="fixOneGoodsPriceStr"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="fixOneGoodsClose">取 消</el-button>
					<el-button type="primary" @click="saveFixOneGoods">确定</el-button>
				</div>
				</el-dialog>
				<el-dialog :visible.sync="addGoodsNameisible" width=600px>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">goodsName</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 20px'  v-model="addOneGoodsName"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">money</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="addOneGoodsMoney"></el-input>
				</div>
				<div>
					<span style="font-size:12pt; margin:10px 0px 10px 64px">price</span>
					<el-input type='text' style='width:200px; margin:10px 30px 10px 32px'  v-model="addOneGoodsPrice"></el-input>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="CloseAddOneGoods">取 消</el-button>
					<el-button type="primary" @click="saveAddOneGoods">确定</el-button>
				</div>
			</el-dialog>  
		</el-card>
	</div>	
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Iap } from "../../store/stateInterface"; //state Interface
import { myDispatch } from "../../utils/index.js"

// @Component 修饰符注明了此类为一个 Vue 组件
@Component
export default class iap extends Vue {
  // lifecycle hook
 created() {
    this.loadData();
  }
  /*inital data*/
  checkNullFlag: boolean = true; //判别是否有空值
  iap: Iap = this.$store.state.iap; //表单数据
  insterIapisible: boolean = false;
  fixIapisible : boolean = false;
  editNameIsible : boolean = false;
  fixOneGoodsIsible: boolean = false;
  addGoodsNameisible: boolean = false;
  
  editingBoundid: string = "";
  editingName: string = "";

  insertBoundId: string = "";
  insertName: string = "";
  insertUsers: string = "";
  fixUid:string = "";
  fixRate:string = "";
  fixUsers:string = "";
  page: number = 1; //当前页
  count: number = 10;

  addOneGoodsName: string = "";
  addOneGoodsMoney: number = 0;
  addOneGoodsPrice: string = "";

  fixBoundID: string = "";
  fixGoodsInfo = [{}];
  fixName:string = "";
  

  fixOneGoodsNameStr: string = "";
  fixOneGoodsMoenyStr: number = 0;
  fixOneGoodsPriceStr: string = "";
  fixOneGoodsIndex: number = 0;


  /*method*/
  loadData() {
    myDispatch(this.$store, "GetIap", {
      pageNum:this.page,
      pageSize:this.count
    })
    .then(()=>{
        
    });

  }

  handleCurrentChange(val) {
    this.page = val;
    this.loadData();
  }
  //每页显示数据量变更
  handleSizeChange(val) {
    this.count = val;
    this.loadData();
  }

  getIap() {
    this.loadData();
  }

  insertIapClick(){
    this.insterIapisible = true;
  }
  insertClose(){
    this.insterIapisible = false;
  }
  saveInsertIap(index, row){

     this.$confirm("此操作将添加新用户,是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
          myDispatch(this.$store, "InsertIap",
          {
             boundId: this.insertBoundId,
             name: this.insertName,
           })
           .then(() => {
             if (this.iap.insertCode == 200) {
               this.$message({
                 type: "success",
                 message: "添加成功!"
               });
               this.insterIapisible = false;
               this.loadData();
               return;
             } 
             })
              .catch(err => {
                console.error("err:", err);
                this.$message({
                  type: "error",
                  message: "添加失败!"
                });
                this.insterIapisible = false;
                return;
              });
           })
        .catch(() => {
         this.$message({
           type: "info",
           message: "已取消添加"
         });
         this.insterIapisible = false;
     });
  }

  editNameClick(index, row){
    this.editingBoundid = row.boundId;
    this.editingName = row.name;
    this.editNameIsible = true;
  }
  
  editNameClose(){
    this.editNameIsible = false;
  }

  saveEditName(){
    this.$confirm("此操作将修改该用户, 是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
           myDispatch(this.$store, "FixIap", {
              boundId: this.editingBoundid,
              name: this.editingName
             
           })
           .then(() => {
             if (this.iap.fixCode == 200) {
               this.$message({
                 type: "success",
                 message: "修改成功!"
               });
               this.editNameIsible =false;
               this.loadData();
               return;
             }
              if (this.iap.fixCode == 500) {
                this.$message({
                  type: "error",
                  message: "修改失败!"
                });
                this.editNameIsible = false;
              }
           })
           .catch(err => {
             console.error("err:", err);
             this.$message({
               type: "error",
               message: "修改失败!"
             });
           });
       })
       .catch(() => {
         this.$message({
           type: "info",
           message: "已取消修改"
         });
     });
  }

  fixIapClick(index, row){
    this.fixIapisible = true;
    this.fixBoundID = row.boundId;
    this.fixGoodsInfo = row.goodsInfo;
    this.fixName = row.name;
  }
  fixClose(){
    this.fixIapisible = false;
  }

  addOneGoodsClick(){
    this.addGoodsNameisible = true;
  }
  CloseAddOneGoods(){
    this.addGoodsNameisible = false;
  }
  saveAddOneGoods(){
    this.fixGoodsInfo.unshift(
      {
        goodsName:this.addOneGoodsName,
        money:this.addOneGoodsMoney,
        price:this.addOneGoodsPrice
      }
    );
  }

  fixOneGoods(index, row){
    this.fixOneGoodsIsible = true;
    this.fixOneGoodsIndex = index;
    this.fixOneGoodsNameStr = row.goodsName;
    this.fixOneGoodsMoenyStr = row.money;
    this.fixOneGoodsPriceStr = row.price;
  }
  fixOneGoodsClose(){
     this.fixOneGoodsIsible = false;
  }
  saveFixOneGoods(){
    //  this.fixGoodsInfo[this.fixOneGoodsIndex] = {
    //    goodsName:this.fixOneGoodsNameStr,
    //    money:this.fixOneGoodsMoenyStr,
    //    price:this.fixOneGoodsPriceStr
    //  };
     this.fixGoodsInfo.splice(this.fixOneGoodsIndex, 1, {
       goodsName:this.fixOneGoodsNameStr,
       money:this.fixOneGoodsMoenyStr,
       price:this.fixOneGoodsPriceStr
     } )
     this.fixOneGoodsIsible = false;
  }

  deleteOneGoods(index, row){
    this.fixGoodsInfo.splice(index,1);
  }

  saveGoodsNameInfo(){
    this.$confirm("此操作将保存所有修改, 是否继续?", "提示", {
       confirmButtonText: "确定",
       cancelButtonText: "取消",
       type: "warning"
     })
       .then(() => {
         myDispatch(this.$store, "FixIap", {
              boundId: this.fixBoundID,
              name: this.fixName,
              goodsInfo: this.fixGoodsInfo
             
           })
           .then(() => {
             if (this.iap.fixCode == 200) {
               this.$message({
                 type: "success",
                 message: "修改成功!"
               });
               this.fixIapisible =false;
               this.loadData();
               return;
             }
              if (this.iap.fixCode == 500) {
                this.$message({
                  type: "error",
                  message: "修改失败!"
                });
                this.fixIapisible = false;
              }
           })
           .catch(err => {
             console.error("err:", err);
             this.$message({
               type: "error",
               message: "修改失败!"
             });
           });
       })
       .catch(() => {
         this.$message({
           type: "info",
           message: "已取消修改"
         });
     });
  }



  timeFormat1(row, column) {
    let users = row.users;
    let userStr = users.join(",");
    return userStr;
  }


  deleteIap(index, row) {
 
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
       myDispatch(this.$store, "DeletIap", {
            boundId: row.boundId
          })
          .then(() => {
            if (this.iap.deletCode == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadData();
              return;
            }
          })
          .catch(err => {
            console.error("err:", err);
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
    });
  }

  valueChange(value) {
    if (value === undefined || value === null || !value.trim()) {
      this.checkNullFlag = false;
    } else {
      this.checkNullFlag = true;
    }
  } 
  inputvalit(value) {
    if (value <= 20 && value >= 2) {
      return;
    } else {
      // this.iap.minUserCount = 2;
      // this.iap.maxUserCount = 20;
      this.$message({
        type: "error",
        message: "数据不合法，请重新输入(2~20)!"
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  font-size: 12pt;
  margin: 0 10px;
}
.input {
  width: 100px;
  margin: 20px 50px 20px 0;
}
.checkbox {
  margin: 20px 50px 10px 0;
}
.dashboard {
  &-outer {
    margin: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 25px;
    margin-top: 80px;
  }
  &-second {
    margin-top: 25px;
    position: relative;
  }
}
.title {
  margin: 10px 0 0 10px;
  font-family: Fantasy;
  color: #a0a0a0;
}
</style>
