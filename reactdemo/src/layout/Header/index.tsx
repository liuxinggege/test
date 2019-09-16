import React, { PureComponent } from 'react';
import { Layout, Icon, Modal, Form, Input, Tooltip, message } from 'antd';
import './style.less';
const { Header } = Layout;
import request from '../../utils/request';
import url from '../../utils/requrl';

class HeaderWapper extends PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user'))
                : '',
        };
    }

    logOut = () => {
        window.location.href = '/login';
        localStorage.clear();
        sessionStorage.clear();
    };
 
    render() {
        return (
            <Header className="lotto-header">
                <div>
                    <Icon
                        className="trigger"
                        type={
                            this.props.collapsed ? 'menu-unfold' : 'menu-fold'
                        }
                        onClick={this.props.toggle}
                    />
                    {this.props.children}
                </div>
                <div className="right">
                    <p>当前用户：{this.state.user.nickname}</p>
                    <p>
                        <a onClick={this.logOut}>退出登录</a>
                    </p>
                </div>
            </Header>
        );
    }
}
const HeaderWapperFrom = Form.create({})(HeaderWapper);
export default HeaderWapperFrom;
