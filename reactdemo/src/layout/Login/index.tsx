import { Form, Input, Icon, Tooltip, Button, message } from 'antd';
import './style.less';
import React, { Component } from 'react';
import request from '../../utils/request';

class Login extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            account: '',
            password: '',
            code: '',
            loading: false
        };
    }
    //登录
    login = async () => {
        let data = {
            account: this.props.form.getFieldValue('account'),
            password: this.props.form.getFieldValue('password'),
            code: this.props.form.getFieldValue('code')
        };
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                let res = await request('/api/user/login', {
                    method: 'POST',
                    body: data
                });
                console.log(res);
                if (res.code == 200) {
                    this.setState({ loading: false });
                    localStorage.setItem('pushToken', res.msg.token); //存入token
                    localStorage.setItem('user', JSON.stringify(res.msg.user));
                    localStorage.setItem('userid', res.msg.user.userid);
                    localStorage.setItem(
                        'leftmenu',
                        JSON.stringify(res.msg.role)
                    );
                    this.props.history.push('/home'); //跳转到主页面
                } else if (res.code == 2102) {
                    localStorage.setItem('url', res.msg);
                    setTimeout(() => {
                        this.props.history.push('/GoogleQRcode');
                    }, 500);
                } else {
                    this.setState({ loading: false });
                    message.error(res.err);
                }
            }
        });
    };
    handleKeydown = e => {
        if (e.keyCode === 13) {
            this.login();
            e.preventDefault();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { Item } = Form;
        return (
            <div className="login-wrapper">
                <div className="container">
                    <h2>直推管理系统</h2>
                    <Form className="login-form">
                        <Item>
                            {getFieldDecorator('account', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入您的账号!'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder="账号"
                                    size="large"
                                    prefix={
                                        <Icon
                                            type="user"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                />
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入您的密码!'
                                    }
                                ]
                            })(
                                <Input.Password
                                    size="large"
                                    placeholder="密码"
                                    prefix={
                                        <Icon
                                            type="lock"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    suffix={
                                        <Tooltip title="Extra information">
                                            <Icon
                                                type="eye"
                                                style={{
                                                    color: 'rgba(0,0,0,.45)'
                                                }}
                                            />
                                        </Tooltip>
                                    }
                                />
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入您的验证码!'
                                    },
                                    {
                                        pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                                        max: 6,
                                        message: '请输入6位的数字验证码'
                                    }
                                ]
                            })(
                                <div className="alone">
                                    <Input
                                        style={{ width: '100%' }}
                                        size="large"
                                        placeholder="验证码"
                                        prefix={
                                            <Icon
                                                type="mail"
                                                style={{
                                                    color: 'rgba(0,0,0,.25)'
                                                }}
                                            />
                                        }
                                    />
                                </div>
                            )}
                        </Item>
                        <Item>
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.login}
                                loading={this.state.loading}
                                onKeyDown={this.handleKeydown.bind(this)}
                                style={{ width: '100%' }}
                            >
                                登陆
                            </Button>
                        </Item>
                    </Form>
                </div>
            </div>
        );
    }
}
const LoginForm = Form.create({})(Login as any);
export default LoginForm;
