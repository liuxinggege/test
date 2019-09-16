import Vue from 'vue'

export default {
	signin(data) {
		return Vue.http.post('user/login', data)
	},
	signout() {
		return Vue.http.get('user/logout')
	},
	me() {
		return Vue.http.get('user/islogin')
	},
	all() {
		return Vue.http.get('user/all')
	},
	del(data) {
		return Vue.http.post('user/delete', data)
	},
	addup(data) {
		return Vue.http.post('user/addup', data)
	},
	getAllLog(data) {
		return Vue.http.post('user/getAllLog', data)
	},
	getMoreAlarm() {
		return Vue.http.get('baseinfo/test')
	},
	getLogtype() {
		return Vue.http.get('user/getLogtype')
	},
	addLicense(data){
		return Vue.http.post('license/addup',data)
	},
	getAlltype(){
		return Vue.http.get('static/alltype')
	},
	addMap(data){
		return Vue.http.post('maporg/addup',data)
	},
	getMap(){
		return Vue.http.get('maporg/get')
	},
	verifyPassword(data){
		return Vue.http.post('user/verifyPassword',data)
	},
	store(data){
		return Vue.http.post('backup/data',data)
	},
	getProcess(){
		return Vue.http.get('backup/flag')
	},
	importdb(data){
		return Vue.http.post('backup/importdb',data)
	},
	getImport(){
		return Vue.http.get('backup/importflag')
	},
	getlogs(data){
		return Vue.http.post('backup/getlogs',data)
	},
	getProperty(){
		return Vue.http.get('backup/getProperty')
	},
	autostore(data){
		return Vue.http.post('backup/updateProperty',data)
	},
	stopCron(){
		return Vue.http.get('backup/stopCron')
	},
	startCron(){
		return Vue.http.get('backup/startCron')
	},
	deleteRule(id){
		return Vue.http.get('editor/delete/'+id)
	},
	editorAdd(data){
		return Vue.http.post('editor/addup',data)
	},
	editorGet(data){
		return Vue.http.post('editor/get',data)
	},
	editorGetAll(){
		return Vue.http.get('editor/all')
	},
	encodePost(data){
		return Vue.http.post('static/encode',data)
	},
	getColor(){
		return Vue.http.get('curve/all')
	},
	addColor(data){
		return Vue.http.post('curve/addup',data)
	},
	getStatus(){
		return Vue.http.get('license/getStatus')
	},
	getTopo(){
		return Vue.http.get('topologyEquipment/getall')
	},
	getFiles(data){
		return Vue.http.post('backup/getFiles',data)
	},
	getAllFiles(data){
		return Vue.http.get('license/showAll',data)
	},
	testWebsocketStart(data){
		return Vue.http.post('testwebsocket/start',data)
	},
	testWebsocketStop(data){
		return Vue.http.post('testwebsocket/stop',data)
	}
}