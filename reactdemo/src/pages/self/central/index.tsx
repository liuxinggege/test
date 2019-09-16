import React from 'react';
import { Card, Alert, Form, Button, message, DatePicker } from 'antd';
import './style.less';
import ChangeLogin from './changeLogin';
import request from '../../../utils/request';
import url from '../../../utils/requrl';
import 'moment/locale/zh-cn';
import moment, { locale } from 'moment-timezone';
moment.locale('zh-cn');
moment.tz.setDefault('Asia/Shanghai');
const QRCode = require('qrcode.react');

class Central extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            money: 0,
            account: '',
            phone: '',
            roleID: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user') || '').roleId
                : '',
            url: '',
            show: 'none',
            month: ''
        };
    }

    componentDidMount() {
        this.getData();
    }
    //初始化data
    getData = async () => {
        this.setState({
            loading: true
        });
        let data = {
            userid: this.state.roleID
        };
        let res = await request(`${url(10013)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code == 200) {
            this.setState(
                {
                    money: res.msg.currentProfit,
                    account: res.msg.user.account,
                    phone: res.msg.user.mobileNum,
                    url: res.msg.domain
                },
                () => {
                    console.log(this.state.phone);
                }
            );
            sessionStorage.setItem('phone', res.msg.user.mobileNum);
            if (this.state.roleID === 4) {
                this.setState({
                    show: 'block'
                });
            }
        } else {
            message.error(res.err);
        }
    };

    //打开修改密码
    openChangeLogin = () => {
        this.openLogin.open();
    };

    onChange = (date, dateString) => {
        this.setState({
            month: date._d
        });
        console.log(date._d);
    };

    search = async () => {
        let data = {
            userid: JSON.parse(localStorage.getItem('user') || '').userid,
            time: this.state.month
        };
        let res = await request(`${url(10024)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            this.setState({
                money: res.msg
            });
        } else {
            message.error('查询错误！');
        }
    };
    render() {
        const { MonthPicker } = DatePicker;
        return (
            <div id="central">
                <Card style={{ width: '100%' }}>
                    <Alert message="个人中心" type="info" showIcon={true} />
                    <div className="withdraw">
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 18,
                                marginRight: 20
                            }}
                        >
                            本期利润:
                            <span className="same">
                                {Number(this.state.money).toFixed(2)}
                            </span>
                            元
                        </div>
                        <div style={{ marginRight: 20 }}>
                            <MonthPicker
                                locale={locale}
                                onChange={this.onChange}
                                placeholder="请选择月份"
                            />
                        </div>
                        <div>
                            <Button icon="search" onClick={this.search}>
                                搜索
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card style={{ width: '100%', marginTop: 10 }}>
                    <Alert message="账号信息" type="info" showIcon={true} />
                    <div className="bassFater">
                        <div style={{ width: '50%' }} className="bass">
                            <h2>基本信息</h2>
                            <ul>
                                <li>账号:{this.state.account}</li>
                                <li>
                                    <span>密码:{'*******'}</span>
                                    <span>
                                        <Button onClick={this.openChangeLogin}>
                                            修改密码
                                        </Button>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div style={{ display: this.state.show, width: '50%' }}>
                            <div className="code">
                                <div className="codeLeft">
                                    我的推广二维码
                                    <div id="">
                                        {
                                            <QRCode
                                                className="QRcode"
                                                includeMargin={true}
                                                value={this.state.url} //url状态值 的地址
                                                level="Q" //二维码等级
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="codeRight">
                                    我的推广链接
                                    <p style={{ marginTop: '10px' }}>
                                        {this.state.url}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <ChangeLogin
                    onOpenChangelogin={(ref: any) => {
                        this.openLogin = ref;
                    }}
                    getData={this.getData.bind(this)}
                />
            </div>
        );
    }
}
const CentralFrom = Form.create({})(Central);
export default CentralFrom;
