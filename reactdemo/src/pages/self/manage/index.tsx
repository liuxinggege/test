import React from 'react';
import { Card, Alert, Form, DatePicker, Button, message } from 'antd';
import moment, { locale } from 'moment-timezone';
import NumberPic from './number';
import MoneyPic from './money';
import './style.less';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import request from '../../../utils/request';
import url from '../../../utils/requrl';
moment.tz.setDefault('Asia/Shanghai');

class Manage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            userID: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user') || '').userid
                : '',
            activityPrizeTotal: 0,
            betNumTotal: 0,
            betTotal: 0,
            grossProfit: 0,
            playerCount: 0,
            winTotal: 0,
            withdrawTotal: 0,
            rechargeTotal: 0,
            mode: ['month', 'month'],
            value: undefined,
            numList: [],
            amountList: [],
            dafaTime: [
                moment()
                    .startOf('day')
                    .subtract(1, 'days'),
                moment()
                    .endOf('day')
                    .subtract(1, 'days')
            ],
            defaultTime: [
                moment()
                    .startOf('day')
                    .subtract(1, 'days'),
                moment()
                    .endOf('day')
                    .subtract(1, 'days')
            ]
        };
    }
    componentDidMount() {
        console.log('dafaTime', this.state.dafaTime);
        this.getData();
        let line = this.state.defaultTime;
        let data = {
            startTime: line[0].set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            }),
            endTime: line[1].set({
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 999
            }),
            type: 'day'
        };
        this.getLine(data);
    }
    //初始化数据
    getData = async () => {
        let time = this.props.form.getFieldValue('time');
        let data = {
            startTime: time[0].set({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            }),
            endTime: time[1].set({
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 999
            })
        };
        let res = await request(`${url(10001)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            let sa = res.msg;
            this.setState({
                activityPrizeTotal: sa.activityBouns,
                betNumTotal: sa.betNumTotal,
                betTotal: sa.betAmount,
                grossProfit: sa.grossProfit,
                playerCount: sa.playerCount,
                winTotal: sa.winTotal,
                withdrawTotal: sa.withdrawAmount,
                rechargeTotal: sa.rechargeTotal
            });
        } else {
            message.error(res.err);
        }
    };

    //折线图数据
    getLine = async (data: any) => {
        let res = await request(`${url(10002)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            this.setState({
                numList: res.msg.numberStatistics,
                amountList: res.msg.amountStatistics
            });
        } else {
            message.error(res.err);
        }
    };

    //第一个搜索
    search = () => {
        this.getData();
    };
    //第一个重置
    sync = () => {
        this.props.form.resetFields();
        this.getData();
    };
    //第二个搜索
    searching = () => {
        const day = this.props.form.getFieldValue('day');
        const month = this.props.form.getFieldValue('month');
        if (day !== undefined && month === undefined) {
            let data = {
                startTime: day[0].set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                }),
                endTime: day[1].set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999
                }),
                type: 'day'
            };
            this.getLine(data);
        } else if (day === undefined && month !== undefined) {
            let data = {
                startTime: month[0].set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                }),
                endTime: month[1].set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999
                }),
                type: 'month'
            };
            this.getLine(data);
        } else {
            message.error('不能同时选择两个数值！');
        }
    };
    //第二个重置
    syncing = () => {
        this.props.form.resetFields();
        this.setState({
            value: undefined,
            defaultTime: [
                moment()
                    .startOf('day')
                    .subtract(1, 'days'),
                moment()
                    .startOf('day')
                    .subtract(1, 'days')
            ]
        });
        setTimeout(() => {
            const day = this.props.form.getFieldValue('day');
            let data = {
                startTime: day[0].set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0
                }),
                endTime: day[1].set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 999
                }),
                type: 'day'
            };
            this.getLine(data);
        }, 500);
    };
    //月份处理
    handlePanelChange = (value, mode) => {
        this.setState({
            value,
            mode: [
                mode[0] === 'date' ? 'month' : mode[0],
                mode[1] === 'date' ? 'month' : mode[1]
            ]
        });
    };
    handleChange = value => {
        this.setState({ value });
    };
    handleFous = () => {
        this.setState({
            defaultTime: undefined
        });
    };
    changeMonth = () => {
        this.setState({
            value: undefined
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { RangePicker } = DatePicker;
        const { value, mode } = this.state;
        const list = [
            {
                title: '毛利=下注-中奖-活动领取金额',
                value: Number(this.state.grossProfit).toFixed(2) + '元',
                color: '#99ff99'
            },
            {
                title: '下注金额',
                value: Number(this.state.betTotal).toFixed(2) + '元',
                color: '#66ffff'
            },
            {
                title: '中奖金额',
                value: Number(this.state.winTotal).toFixed(2) + '元',
                color: '#ffcc03'
            },
            {
                title: '活动领取金额',
                value: Number(this.state.activityPrizeTotal).toFixed(2) + '元',
                color: '#CC32CC'
            },

            {
                title: '新增客户数量',
                value: this.state.playerCount + '个',
                color: '#CC99CC'
            },
            {
                title: '下注数量',
                value: this.state.betNumTotal + '注',
                color: '#0499FF'
            },
            {
                title: '用户充值',
                value: Number(this.state.rechargeTotal).toFixed(2) + '元',
                color: '#9832CC'
            },
            {
                title: '用户提现',
                value: Number(this.state.withdrawTotal).toFixed(2) + '元',
                color: '#6532CC'
            }
        ];
        return (
            <div id="manage">
                <Card style={{ width: '100%' }}>
                    <Alert message="收益汇总" type="info" showIcon={true} />
                    <div className="search">
                        <Form layout={'inline'}>
                            <Form.Item label="时间">
                                {getFieldDecorator('time', {
                                    initialValue: this.state.dafaTime
                                })(
                                    <RangePicker
                                        style={{ width: 400 }}
                                        locale={locale}
                                        format="YYYY-MM-DD"
                                        placeholder={['开始时间', '结束时间']}
                                        allowClear={false}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <div>
                                    <span style={{ marginRight: 30 }}>
                                        <Button
                                            type="primary"
                                            icon="search"
                                            onClick={this.search}
                                        >
                                            搜索
                                        </Button>
                                    </span>
                                    <span>
                                        <Button
                                            type="primary"
                                            icon="sync"
                                            onClick={this.sync}
                                        >
                                            重置
                                        </Button>
                                    </span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="block">
                        {list.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={'Item' + index}
                                    style={{ background: item.color }}
                                >
                                    <p className="unusual">{item.value}</p>
                                    <p>{item.title}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <div className="searching">
                            <Form layout={'inline'}>
                                <Form.Item label="按天查询">
                                    {getFieldDecorator('day', {
                                        initialValue: this.state.defaultTime
                                    })(
                                        <RangePicker
                                            style={{ width: 400 }}
                                            locale={locale}
                                            format="YYYY-MM-DD"
                                            placeholder={[
                                                '开始时间',
                                                '结束时间'
                                            ]}
                                            allowClear={false}
                                            onOpenChange={this.changeMonth}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="按月查询">
                                    {getFieldDecorator('month', {
                                        initialValue: value
                                    })(
                                        <RangePicker
                                            style={{ width: 400 }}
                                            locale={locale}
                                            format="YYYY-MM"
                                            mode={mode}
                                            onChange={this.handleChange}
                                            onPanelChange={
                                                this.handlePanelChange
                                            }
                                            onOpenChange={this.handleFous}
                                            placeholder={[
                                                '开始月份',
                                                '结束月份'
                                            ]}
                                            allowClear={false}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <div>
                                        <span style={{ marginRight: 30 }}>
                                            <Button
                                                type="primary"
                                                icon="search"
                                                onClick={this.searching}
                                            >
                                                搜索
                                            </Button>
                                        </span>
                                        <span>
                                            <Button
                                                type="primary"
                                                icon="sync"
                                                onClick={this.syncing}
                                            >
                                                重置
                                            </Button>
                                        </span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="image">
                            <div className="money">
                                <MoneyPic amountList={this.state.amountList} />
                            </div>
                            <div className="number">
                                <NumberPic numList={this.state.numList} />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}
const manageFrom = Form.create({})(Manage);
export default manageFrom;
