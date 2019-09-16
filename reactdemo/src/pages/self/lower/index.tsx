import React, { Component } from 'react';
import {
    Card,
    Form,
    Button,
    DatePicker,
    Alert,
    Table,
    Modal,
    Input,
    message,
    Tooltip,
    Select
} from 'antd';
import moment, { locale } from 'moment-timezone';
import './style.less';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import NumberPic from './number';
import MoneyPic from './money';
import request from '../../../utils/request';
import url from '../../../utils/requrl';
moment.tz.setDefault('Asia/Shanghai');

class Lower extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: false,
            pic: false,
            pageSize: 10,
            total: 0,
            current: 1,
            visible: false,
            butLoad: false,
            childID: 0,
            activityBouns: 0,
            betNumTotal: 0,
            betAmount: 0,
            grossProfit: 0,
            playerCount: 0,
            winTotal: 0,
            withdrawTotal: 0,
            rechargeTotal: 0,
            numList: [],
            amountList: [],
            roleID: localStorage.getItem('user')
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
            defaData: {
                userid: 0,
                name: '',
                account: '',
                password: '',
                state: 1,
                mark: ''
            },
            columns: [
                {
                    title: '管理者名称',
                    dataIndex: 'nickname',
                    align: 'center',
                    width: 100,
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
                    title: '管理级别',
                    dataIndex: 'roleId',
                    align: 'center',
                    width: 100
                },
                {
                    title: '管理者账号',
                    dataIndex: 'account',
                    align: 'center',
                    width: 100
                },
                {
                    title: '直属上级',
                    dataIndex: 'parentNickname',
                    align: 'center',
                    width: 150
                },
                {
                    title: '上级账号',
                    dataIndex: 'parentAccount',
                    align: 'center',
                    width: 150
                },

                {
                    title: '下级数量',
                    width: 150,
                    dataIndex: 'subordinateAgentNum',
                    align: 'center'
                },
                {
                    title: '新增客户数量',
                    width: 150,
                    dataIndex: 'playerNum',
                    align: 'center'
                },
                {
                    title: '下注数量',
                    width: 150,
                    dataIndex: 'betNumTotal',
                    align: 'center'
                },
                {
                    title: '利润',
                    width: 150,
                    dataIndex: 'grossProfit',
                    align: 'center'
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
        let res = await request(`${url(10003)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code === 200) {
            let sa = res.msg;
            this.setState({
                activityBouns: sa.activityBouns,
                betNumTotal: sa.betNumTotal,
                betAmount: sa.betAmount,
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
    //获取tabel数据
    getTable = async () => {
        this.setState({
            loading: true
        });
        let time = this.props.form.getFieldValue('timer');
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
            roleId: this.props.form.getFieldValue('levels'),
            page: this.state.current,
            pageSize: this.state.pageSize,
            keyword: this.props.form.getFieldValue('keyWord')
        };
        if (this.props.form.getFieldValue('keyWord') === '') {
            delete data['keyword'];
        }
        let res = await request(`${url(10004)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code == 200) {
            this.setState({
                total: res.msg.count,
                data: res.msg.result,
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
    searchTable = () => {
        this.getTable();
    };
    //重置
    sync = () => {
        this.props.form.resetFields();
        this.getData();
    };
    syncTable = () => {
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
                this.getData();
                this.getTable();
            }
        );
    };

    //打开图表
    openPic = async (e: any) => {
        this.setState({
            childID: e.userid
        });
        setTimeout(() => {
            this.secondData();
            this.setState({
                pic: true
            });
        }, 500);
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
        //console.log(data);
        let res = await request(`${url(10005)}`, {
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

    searching = () => {
        this.secondData();
    };

    syncing = () => {
        this.props.form.resetFields();
        this.secondData();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { RangePicker } = DatePicker;
        const { Option } = Select;
        let lists = [
            {
                label: '管理账号',
                value: 2
            },
            {
                label: '组长',
                value: 3
            },
            {
                label: '组员',
                value: 4
            }
        ];
        const newList = lists.slice(this.state.roleID - 1, lists.length);
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
                color: '#F2853D'
            },
            {
                title: '用户提现',
                value: Number(this.state.withdrawTotal).toFixed(2) + '元',
                color: '#F2853D'
            }
        ];
        return (
            <div id="lower">
                <Card style={{ width: '100%' }}>
                    <Alert message="小组收益" type="info" showIcon={true} />
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
                            <Form.Item label="层级">
                                {getFieldDecorator('levels', {
                                    initialValue: this.state.roleID + 1
                                })(
                                    <Select style={{ width: 150 }}>
                                        {newList.map((item, i) => (
                                            <Option key={i} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="查询">
                                {getFieldDecorator('keyWord', {})(
                                    <Input
                                        placeholder="代理名称、账号关键字搜索"
                                        style={{ width: 250 }}
                                    />
                                )}
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
                                            onClick={this.searchTable}
                                        >
                                            搜索
                                        </Button>
                                    </span>
                                    <span>
                                        <Button
                                            type="primary"
                                            icon="sync"
                                            onClick={this.syncTable}
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
                    width={1300}
                    visible={this.state.pic}
                    title="图表详情"
                    onOk={() => {
                        this.setState({
                            pic: false
                        });
                    }}
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({
                            pic: false
                        });
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
                            <div className="money">
                                <MoneyPic amountList={this.state.amountList} />
                            </div>
                            <div className="number">
                                <NumberPic numList={this.state.numList} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const lowerFrom = Form.create({})(Lower);
export default lowerFrom;
