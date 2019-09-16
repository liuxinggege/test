import React, { Component } from 'react';
import { Modal, Form, Button, Input, Tooltip, Icon, message } from 'antd';
import request from '../../../utils/request';
import url from '../../../utils/requrl';
class changeLogin extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            login: false,
            motion: false,
            loading: false,
            text: '获取验证码',
            time: 60
        };
    }

    componentDidMount() {
        this.props.onOpenChangelogin(this);
    }
    open = () => {
        this.setState({
            login: true
        });
        this.props.form.resetFields();
    };

    changeLogin = () => {
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                let Password = this.props.form.getFieldValue('new');
                let agin = this.props.form.getFieldValue('agin');
                if (Password !== agin) {
                    message.error('两次输入的密码不一样！请重新输入！');
                    return;
                }
                this.setState({
                    loading: true
                });
                let data = {
                    newPassword: agin,
                    smscode: this.props.form.getFieldValue('code')
                };
                console.log(data);
                let res = await request(`${url(10016)}`, {
                    method: 'POST',
                    body: data
                });
                if (res.code === 200) {
                    this.setState({
                        loading: false,
                        login: false
                    });
                    message.success(res.msg);
                } else {
                    this.setState({
                        loading: false,
                        login: true
                    });
                    message.error(res.err);
                }
            }
        });
    };

    sendCode = async () => {
        this.count();
        let data = {
            mobileNum: sessionStorage.getItem('phone')
        };
        await request(`${url(10017)}`, {
            method: 'POST',
            body: data
        });
    };

    //count计时
    count = () => {
        let time = this.state.time;
        const timer = setInterval(() => {
            this.setState(
                {
                    motion: true,
                    time: time--,
                    text: time + 's' + '后获取验证码'
                },
                () => {
                    if (time === 0) {
                        clearInterval(timer);
                        this.setState({
                            motion: false,
                            time: 60,
                            text: '重新获取验证码'
                        });
                    }
                }
            );
        }, 1000);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <Modal
                    visible={this.state.login}
                    title="修改登录密码"
                    onOk={this.changeLogin}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            login: false
                        });
                        this.props.form.resetFields();
                    }}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={this.state.loading}
                >
                    <Form layout={'horizontal'} {...formItemLayout}>
                        <Form.Item label="新密码">
                            {getFieldDecorator('new', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '新密码不能为空!'
                                    },
                                    {
                                        pattern: new RegExp(
                                            /^[A-Za-z0-9]+$/,
                                            'g'
                                        ),
                                        max: 20,
                                        message: '请输入新密码!'
                                    }
                                ]
                            })(
                                <Input.Password
                                    placeholder="请输入新密码"
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
                        </Form.Item>
                        <Form.Item label="确认密码">
                            {getFieldDecorator('agin', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '确认密码不能为空!'
                                    },
                                    {
                                        pattern: new RegExp(
                                            /^[A-Za-z0-9]+$/,
                                            'g'
                                        ),
                                        max: 20,
                                        message: '请输入确认密码!'
                                    }
                                ]
                            })(
                                <Input.Password
                                    placeholder="请输入确认密码"
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
                        </Form.Item>
                        <div style={{ position: 'relative' }}>
                            <Form.Item label="验证码">
                                {getFieldDecorator('code', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '验证码不能为空!'
                                        },
                                        {
                                            pattern: new RegExp(
                                                /^[0-9]\d*$/,
                                                'g'
                                            ),
                                            message: '输入正确的6位验证码!'
                                        }
                                    ]
                                })(<Input placeholder="请输入验证码" />)}
                            </Form.Item>
                            {
                                //     <Button
                                //     style={{
                                //         position: 'absolute',
                                //         top: 5,
                                //         right: 40
                                //     }}
                                //     type="primary"
                                //     disabled={this.state.motion}
                                //     onClick={this.sendCode}
                                // >
                                //     {this.state.text}
                                // </Button>
                            }
                        </div>
                        <p style={{ textAlign: 'center', color: 'red' }}>
                            密码由6-20个字母或数字组成，区分大小写
                        </p>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const changeLoginFrom = Form.create({})(changeLogin);
export default changeLoginFrom;
