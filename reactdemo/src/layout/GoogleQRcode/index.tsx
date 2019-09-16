import { Button, Icon, Input, message } from 'antd';
import * as React from 'react';
import request from '../../utils/request';
import './GoogleQRcode.css';
const QRCode = require('qrcode.react');
interface IProps {
    history?: any;
}
interface IState {
    url: any;
    size: number;
    margin: boolean;
    account: string; //账号
    code: string; //验证码
}
class GoogleQRcode extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        // console.log(this.props)
        this.state = {
            url: '', //二维码的数据地址
            size: 1000,
            margin: true,
            account: '',
            code: ''
        };
    }
    componentDidMount() {
        //挂载组件时 传入url
        var codeUrl = localStorage.getItem('url');
        // console.log(codeurl);
        this.setState({
            url: codeUrl
        });
    }
    submit = async () => {
        //提交按钮
        const data = {
            account: this.state.account,
            code: this.state.code
        };
        let res = await request('/api/user/bindGoogleCode', {
            method: 'POST',
            body: data
        });
        if (res.code === 200) {
            message.success('绑定成功，请重新登录');
            this.props.history.push('/login');
        } else {
            message.error(res.err);
        }
    };
    Account = (e: any) => {
        //账号验证
        this.setState({
            account: e.target.value
        });
    };

    GoogleVerification = (e: any) => {
        this.setState({
            code: e.target.value
        });
    };
    render() {
        return (
            <div id="GoogleQRcode">
                <div className="QRcodeBox">
                    <QRCode
                        className="QRcode"
                        includeMargin={this.state.margin}
                        value={this.state.url} //url状态值 的地址
                        level="Q" //二维码等级
                    />
                    <div className="content">
                        <h4>请打开google验证APP扫描二维码</h4>
                        <Input
                            className="account"
                            placeholder="请输入账号"
                            size="large"
                            value={this.state.account}
                            onChange={this.Account}
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                        />
                        <Input
                            onChange={this.GoogleVerification}
                            value={this.state.code}
                            className="account"
                            placeholder="请输入google验证码"
                            size="large"
                            prefix={
                                <Icon
                                    type="lock"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={this.submit}
                        >
                            绑定谷歌验证
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default GoogleQRcode;
