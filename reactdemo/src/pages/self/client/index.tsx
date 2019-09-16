import React, { Component } from 'react';
import {
    Card,
    Alert,
    Form,
    Button,
    DatePicker,
    Table,
    Icon,
    Modal,
    Input,
    message,
    Tooltip
} from 'antd';
import moment, { locale } from 'moment-timezone';
import './style.less';
import 'moment/locale/zh-cn';
import NumberPic from './number';
import MoneyPic from './money';
import request from '../../../utils/request';
import url from '../../../utils/requrl';
moment.tz.setDefault('Asia/Shanghai');

class Client extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            withdrawTotal: 0,
            rechargeTotal: 0,
            loading: false,
            pageSize: 10,
            current: 1,
            total: 0,
            bind: false,
            pic: false,
            detail: false,
            childID: 0,
            activityBouns: 0,
            betNumTotal: 0,
            betAmount: 0,
            playerCount: 0,
            grossProfit: 0,
            rebateTotal: 0,
            winTotal: 0,
            withdrawAmount: 0,
            numList: [],
            amountList: [],
            old: '',
            customerID: '',
            income: '',
            exchange: '',
            remark: '',
            changeAgent: false,
            roleId: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user') || '').roleId
                : '',
            dafaTime: [
                moment()
                    .startOf('day')
                    .subtract(1, 'days'),
                moment()
                    .endOf('day')
                    .subtract(1, 'days')
            ],
            data: [],
            columns: [
                {
                    title: '玩家ID',
                    dataIndex: 'userid',
                    align: 'center'
                },
                {
                    title: '玩家昵称',
                    dataIndex: 'nickname',
                    align: 'center'
                },
                {
                    title: '绑定推广ID',
                    dataIndex: 'xgUserId',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <a
                                onClick={() => {
                                    this.openPic(record);
                                }}
                            >
                                {text}
                            </a>
                        );
                    }
                },
                {
                    title: '毛利',
                    dataIndex: 'grossProfit',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },
                {
                    title: '下注金额',
                    dataIndex: 'betTotal',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },
                {
                    title: '中奖金额',
                    dataIndex: 'winTotal',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },
                {
                    title: '下注量',
                    dataIndex: 'betNumTotal',
                    align: 'center'
                },
                {
                    title: '活动领取金额',
                    dataIndex: 'activityPrizeTotal',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },

                {
                    title: '用户充值',
                    dataIndex: 'rechargeTotal',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },
                {
                    title: '用户提现',
                    dataIndex: 'withdrawTotal',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return <span>{Number(text).toFixed(2)}</span>;
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    align: 'center',
                    width: 150,
                    render: (text: any, record: any) => {
                        return (
                            <Tooltip placement="top" title={text}>
                                <span
                                    style={{
                                        width: '100px',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        display: 'inline-block'
                                    }}
                                >
                                    {text}
                                </span>
                            </Tooltip>
                        );
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <div>
                                {
                                    //     this.state.roleId === 1 ? (
                                    //     <span style={{ marginRight: 10 }}>
                                    //         <Icon
                                    //             type="edit"
                                    //             onClick={() => {
                                    //                 this.editOpen(record);
                                    //             }}
                                    //         />
                                    //     </span>
                                    // ) : (
                                    //     ''
                                    // )
                                }
                                <span>
                                    <Icon
                                        type="eye"
                                        onClick={() => {
                                            this.checkOpen(record);
                                        }}
                                    />
                                </span>
                            </div>
                        );
                    }
                }
            ]
        };
    }
    componentDidMount() {
        this.getData();
        this.getTable();
    }
    //初始化
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
        let res = await request(`${url(10006)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            this.setState({ ...res.msg });
        } else {
            message.error(res.err);
        }
    };
    //列表
    getTable = async () => {
        this.setState({
            loading: true
        });
        let time = this.props.form.getFieldValue('timer');
        let keyWord = this.props.form.getFieldValue('keyWord');
        let data = {
            page: this.state.current,
            pageSize: this.state.pageSize,
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
        if (keyWord) {
            data['keyword'] = keyWord;
        }

        let res = await request(`${url(10007)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code == 200) {
            this.setState({
                total: res.msg.count,
                data: res.msg.data,
                loading: false
            });
        } else {
            this.setState({
                loading: false
            });
            message.error(res.err);
        }
    };
    //搜索
    search = () => {
        this.getData();
    };
    //重置
    sync = () => {
        this.props.form.resetFields();
        this.getData();
    };
    //搜索
    searchs = () => {
        this.getTable();
    };
    //重置
    syncs = () => {
        this.setState(
            {
                current: 1,
                pageSize: 10
            },
            () => {
                this.props.form.resetFields();
                this.getTable();
            }
        );
    };
    //分页
    changePage = (current: any, pageSize: any) => {
        this.setState(
            {
                current: current,
                pageSize: pageSize
            },
            () => {
                this.getTable();
            }
        );
    };
    //开页
    openPic = (e: any) => {
        console.log(e);
        this.setState(
            {
                childID: e.xgUserId
            },
            () => {
                this.secondData();
                this.setState({
                    pic: true
                });
            }
        );
    };
    //第二数据
    secondData = async () => {
        let time = this.props.form.getFieldValue('timing');
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
            }),
            type: 'day',
            userid: this.state.childID
        };

        let res = await request(`${url(10008)}`, {
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
    //第二搜索
    searching = () => {
        this.secondData();
    };
    //第二重置
    syncing = () => {
        this.props.form.resetFields();
        this.secondData();
    };
    //换绑定
    editOpen = (e: any) => {
        console.log(e);
        this.props.form.resetFields();
        sessionStorage.setItem('changeBindID', e.userid);
        this.setState({
            bind: true
        });
        this.setState({
            old: e.xgUserAccount
        });
    };
    //换绑确定
    changeBind = async () => {
        if (this.props.form.getFieldValue('account') === '') {
            message.error('新的上级代理账号不能为空！');
            return;
        }
        if (this.props.form.getFieldValue('password') === '') {
            message.error('管理员密码不能为空！');
            return;
        }
        this.setState({
            changeAgent: true
        });
        let data = {
            customerUserId: Number(sessionStorage.getItem('changeBindID')),
            oldParentAccount: this.props.form.getFieldValue('old'),
            newParentAccount: this.props.form.getFieldValue('account'),
            password: this.props.form.getFieldValue('password')
        };
        console.log(data);
        let res = await request(`${url(10022)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            message.success(res.msg);
            this.setState({
                bind: false,
                changeAgent: false
            });
            this.searchs();
        } else {
            this.setState({
                bind: true,
                changeAgent: false
            });
            message.error(res.err);
        }
    };
    //查看详情
    checkOpen = async (e: any) => {
        sessionStorage.setItem('remarkID', e.userid);
        this.props.form.resetFields();
        this.setState({
            detail: true,
            customerID: e.account
        });
        let data = {
            userid: e.userid
        };
        let res = await request(`${url(10021)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            this.setState({
                income: res.msg.rechaegeTotal,
                exchange: res.msg.withdrawTotal,
                remark: res.msg.remark
            });
            this.getTable();
        } else {
            message.error(res.err);
        }
    };
    //改变备注
    changeDetail = async () => {
        let data = {
            remark: this.props.form.getFieldValue('mark'),
            customerUserId: Number(sessionStorage.getItem('remarkID'))
        };
        if (this.props.form.getFieldValue('mark') === this.state.remark) {
            this.setState({
                detail: false
            });
            return;
        }
        let res = await request(`${url(10009)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            message.success(res.msg);
            this.setState({
                detail: false
            });
            this.props.form.resetFields();
            this.getTable();
        } else {
            message.error(res.err);
            this.setState({
                detail: true
            });
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { RangePicker } = DatePicker;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 }
        };
        const formItem = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { TextArea } = Input;
        const list = [
            {
                title: '毛利=下注-中奖-活动领取金额',
                value: Number(this.state.grossProfit).toFixed(2) + '元',
                color: '#99ff99'
            },
            {
                title: '下注金额',
                value: Number(this.state.betAmount).toFixed(2) + '元',
                color: '#66ffff'
            },
            {
                title: '中奖金额',
                value: Number(this.state.winTotal).toFixed(2) + '元',
                color: '#ffcc03'
            },
            {
                title: '活动领取金额',
                value: Number(this.state.activityBouns).toFixed(2) + '元',
                color: '#9932CC'
            },
            {
                title: '下注数量',
                value: this.state.betNumTotal + '注',
                color: '#0499FF'
            },
            {
                title: '新增客户数量',
                value: this.state.playerCount + '个',
                color: '#CC99CC'
            },
            {
                title: '用户充值',
                value: Number(this.state.rechargeTotal).toFixed(2) + '元',
                color: '#03CC33'
            },
            {
                title: '用户提现',
                value: Number(this.state.withdrawAmount).toFixed(2) + '元',
                color: '#03CC33'
            }
        ];
        return (
            <div id="client">
                <Card style={{ width: '100%' }}>
                    <Alert message="客户管理" type="info" showIcon={true} />
                    <div className="search">
                        <Form layout={'inline'}>
                            <Form.Item label="时间">
                                {getFieldDecorator('time', {
                                    initialValue: this.state.dafaTime
                                })(
                                    <RangePicker
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
                    <div className="search">
                        <Form layout={'inline'}>
                            <Form.Item label="关键字查询">
                                {getFieldDecorator('keyWord', {
                                    initialValue: ''
                                })(<Input placeholder="请输入关键字查询" />)}
                            </Form.Item>
                            <Form.Item label="时间">
                                {getFieldDecorator('timer', {
                                    initialValue: this.state.dafaTime
                                })(
                                    <RangePicker
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
                                            onClick={this.searchs}
                                        >
                                            搜索
                                        </Button>
                                    </span>
                                    <span>
                                        <Button
                                            type="primary"
                                            icon="sync"
                                            onClick={this.syncs}
                                        >
                                            重置
                                        </Button>
                                    </span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <Table
                        style={{ marginTop: 20 }}
                        bordered
                        rowKey="account"
                        loading={this.state.loading}
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        pagination={{
                            pageSize: this.state.pageSize,
                            current: this.state.current,
                            total: this.state.total,
                            onChange: this.changePage,
                            showTotal: () => `共${this.state.total}条`
                        }}
                        size="middle"
                    />
                </Card>
                <Modal
                    visible={this.state.bind}
                    title="换绑代理"
                    onOk={this.changeBind}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            bind: false
                        });
                        this.props.form.resetFields();
                    }}
                    okText="确认"
                    cancelText="取消"
                    confirmLoading={this.state.changeAgent}
                >
                    <Form layout={'horizontal'} {...formItemLayout}>
                        <Form.Item label="旧的上级代理账号">
                            {getFieldDecorator('old', {
                                initialValue: this.state.old
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="新的上级代理账号">
                            {getFieldDecorator('account', {
                                initialValue: ''
                            })(<Input placeholder="请输入新的上级代理账号" />)}
                        </Form.Item>
                        <Form.Item label="管理员密码">
                            {getFieldDecorator('password', {
                                initialValue: ''
                            })(
                                <Input.Password placeholder="请输入管理员密码" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={this.state.detail}
                    title="客户详情"
                    onOk={this.changeDetail}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            detail: false
                        });
                        this.props.form.resetFields();
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form layout={'horizontal'} {...formItem}>
                        <Form.Item label="客户账号">
                            {getFieldDecorator('user', {
                                initialValue: this.state.customerID
                            })(<Input readOnly />)}
                        </Form.Item>
                        <Form.Item label="累计充值">
                            {getFieldDecorator('income', {
                                initialValue: this.state.income
                            })(<Input readOnly addonAfter="元" />)}
                        </Form.Item>
                        <Form.Item label="累计兑换">
                            {getFieldDecorator('exchange', {
                                initialValue: this.state.exchange
                            })(<Input readOnly addonAfter="元" />)}
                        </Form.Item>
                        <Form.Item label="备注详情">
                            {getFieldDecorator('mark', {
                                initialValue: this.state.remark
                            })(
                                <TextArea
                                    autosize={{ minRows: 4, maxRows: 8 }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    width={1300}
                    visible={this.state.pic}
                    title="图表详情"
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            pic: false
                        });
                        this.props.form.resetFields();
                    }}
                    footer={false}
                >
                    <div className="together">
                        <div className="top">
                            <Form layout={'inline'}>
                                <Form.Item label="时间">
                                    {getFieldDecorator('timing', {
                                        initialValue: this.state.dafaTime
                                    })(
                                        <RangePicker
                                            locale={locale}
                                            format="YYYY-MM-DD"
                                            placeholder={[
                                                '开始时间',
                                                '结束时间'
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
                        <div
                            className="center"
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <div className="togeLeft">
                                <MoneyPic amountList={this.state.amountList} />
                            </div>
                            <div className="togeRight">
                                <NumberPic numList={this.state.numList} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const ClientFrom = Form.create({})(Client);
export default ClientFrom;
