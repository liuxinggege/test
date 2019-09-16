declare var require: any
import axios from '../../../utils/request'



/**
 * 用户信息  查询
 */
export function getAdminUserManager(data) {
    return axios.post(`/api/admin/user/getUsers`,data);
}
export function getAdminUseUrl(data) {
    return axios.post(`/api/admin/user/getUsersUrl`,data);
}
/**
 * 用户信息   添加
 */
export function addAdminUserManager(data) {
    return axios.post(`/api/admin/user/create`, data);
}
/**
 * 用户信息   修改密码
 */
export function updateAdminUserManager(data) {
    return axios.post(`/api/admin/user/changePwd`, data);
}

/**
 * 用户信息   修改密码
 */
export function updateAdminUserRole(data) {
    return axios.post(`/api/admin/user/grantRole`, data);
}

/**
 * 用户信息   删除
 */
export function deleteAdminUserManager(data) {
    return axios.post(`/api/admin/user/delete`, data);
}




/**
 * 角色  查询
 */
export function getRoleEdit(data) {
    return axios.post(`/api/admin/role/getByType`,data);
}

export function getRoleEditByParentName(data) {
    return axios.post(`/api/admin/role/getByParent`,data);
}
/**
 * 角色   添加
 */
export function addRoleEdit(data) {
    return axios.post(`/api/admin/role/create`, data);
}
/**
 * 角色   编辑
 */
export function updateRoleEdit(data) {
    return axios.post(`/api/admin/role/update`, data);
}

/**
 * 角色   删除
 */
export function deleteRoleEdit(id) {
    return axios.post(`/api/admin/agent/deleteRoleEdit`, { id: id });
}

/**
 * 可供编辑的权限   查询
 */
export function getPower() {
    return axios.get(`/api/admin/role/privileges`);
}



export function addAllowLoginIp(data) {
    return axios.post(`/api/admin/user/addAllowIp`, data );
}

export function deleteAllowIp(data) {
    return axios.post(`/api/admin/user/deleteAllowIp`, data );
}

export function getAllowLoginIp() {
    return axios.get(`/api/admin/user/getAllowIp`);
}

export function googleAuth(data) {
    return axios.post(`/api/admin/user/googleAuth`,data);
}
