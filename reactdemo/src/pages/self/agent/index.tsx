import React from 'react';
import {
    Card,
    Alert,
    Form,
    Button,
    Select,
    Table,
    Input,
    Modal,
    Tooltip,
    Icon,
    Radio,
    message
} from 'antd';
import './style.less';
import request from '../../../utils/request';
import url from '../../../utils/requrl';
import moment from 'moment';
class Agent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            columns: [
                {
                    title: '管理者账号',
                    dataIndex: 'account',
                    align: 'center'
                },
                {
                    title: '管理者名称',
                    dataIndex: 'nickname',
                    align: 'center'
                },
                {
                    title: '管理级别',
                    dataIndex: 'level',
                    align: 'center'
                },
                {
                    title: '直属上级',
                    dataIndex: 'parentName',
                    align: 'center'
                },
                {
                    title: '上级账号',
                    dataIndex: 'parentAccount',
                    align: 'center'
                },
                {
                    title: '账户状态',
                    dataIndex: 'state',
                    align: 'center',
                    render: text => {
                        return text === 1 ? (
                            <span style={{ color: 'green' }}>正常</span>
                        ) : (
                            <span style={{ color: 'red' }}>冻结</span>
                        );
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return record.createdAt === undefined
                            ? ''
                            : (text = moment(text).format(
                                  'YYYY-MM-DD HH:mm:ss'
                              ));
                    }
                },
                {
                    title: '修改时间',
                    dataIndex: 'modifyAt',
                    align: 'center',
                    render: (text: any, record: any) => {
                        return record.modifyAt === undefined
                            ? ''
                            : (text = moment(text).format(
                                  'YYYY-MM-DD HH:mm:ss'
                              ));
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
                    dataIndex: '',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <Icon
                                type="edit"
                                onClick={() => {
                                    this.openEdit(record);
                                }}
                            />
                        );
                    }
                }
            ],
            visible: false,
            pageSize: 10,
            current: 1,
            total: 0,
            roleID: localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user') || '').roleId
                : '',
            disabled: false,
            butLoad: false,
            bind: true,
            defaData: {
                userid: 0,
                nickname: '',
                account: '',
                password: '',
                state: 1,
                remark: ''
            }
        };
    }
    componentDidMount() {
        this.getData();
        if (this.state.roleID === 4) {
            this.setState({
                hide: true
            });
        }
    }
    //初始化data
    getData = async () => {
        this.setState({
            loading: true
        });
        let data = {
            page: this.state.current,
            pageSize: this.state.pageSize,
            roleId: this.props.form.getFieldValue('levels')
        };
        if (this.props.form.getFieldValue('keyWord')) {
            data['keyword'] = this.props.form.getFieldValue('keyWord');
        }
        let res = await request(`${url(10010)}`, {
            method: 'POST',
            body: data
        });
        console.log(res);
        if (res.code == 200) {
            this.setState({
                total: res.count,
                data: res.msg,
                loading: false
            });
        } else {
            this.setState({
                loading: false
            });
            message.error(res.err);
        }
    };
    // 搜索
    search = () => {
        this.getData();
    };

    //重置
    sync = () => {
        this.setState(
            {
                current: 1,
                pageSize: 10
            },
            () => {
                this.props.form.resetFields();
                this.getData();
            }
        );
    };

    //分页
    changePage = (current, pageSize) => {
        this.setState(
            {
                current: current,
                pageSize: pageSize
            },
            () => {
                this.getData();
            }
        );
    };
    //新增
    addOpen = () => {
        this.props.form.resetFields();
        this.setState({
            visible: true,
            title: '新增下级',
            disabled: false,
            hiding: false
        });
    };
    openEdit = (e: any) => {
        this.setState({
            visible: true,
            title: '修改下级',
            disabled: true,
            hiding: true,
            defaData: {
                userid: e.userid,
                nickname: e.nickname,
                account: e.account,
                password: '',
                state: e.state,
                remark: e.remark
            }
        });
        this.props.form.resetFields();
    };
    //确认
    handleOk = () => {
        this.props.form.validateFields(async (err: any, values: any) => {
            if (!err) {
                console.log(values);
                let data = {
                    ...values,
                    userid: this.state.defaData.userid
                };
                this.setState({
                    butLoad: true
                });
                if (values.password) {
                    data['password'] = this.props.form.getFieldValue(
                        'password'
                    );
                }
                if (this.state.title === '新增下级') {
                    delete data['userid'];
                    this.add(data);
                } else if (this.state.title === '修改下级') {
                    this.update(data);
                } else if (this.state.title === '绑定玩家') {
                    this.handleBind();
                }
            }
        });
    };
    //新增
    add = async (data: any) => {
        let res = await request(`${url(10011)}`, {
            method: 'POST',
            body: data
        });

        if (res.code == 200) {
            this.setState({
                butLoad: false,
                visible: false
            });
            message.success(res.msg);
            this.getData();
            this.props.form.resetFields();
        } else {
            this.setState({
                butLoad: false,
                visible: true
            });
            message.error(res.err);
        }
    };
    //修改
    update = async (data: any) => {
        let res = await request(`${url(10012)}`, {
            method: 'POST',
            body: data
        });
        if (res.code == 200) {
            this.setState({
                butLoad: false,
                visible: false,
                defaData: {
                    userid: 0,
                    nickname: '',
                    account: '',
                    password: '',
                    state: 1,
                    remark: ''
                }
            });
            message.success(res.msg);
            this.getData();
        } else {
            this.setState({
                butLoad: false,
                visible: true
            });
            message.error(res.err);
        }
    };

    getLevel = e => {
        if (this.state.roleID === 1 && e === 4) {
            this.setState({
                bind: false
            });
        } else {
            this.setState({
                bind: true
            });
        }
    };

    bindPlay = () => {
        this.setState({
            title: '绑定玩家',
            visible: true
        });
    };
    //绑定玩家确定
    handleBind = async () => {
        let data = {
            xgUserId: Number(this.props.form.getFieldValue('agentID')),
            playerUserId: Number(this.props.form.getFieldValue('playerID'))
        };
        let res = await request(`${url(10023)}`, {
            method: 'POST',
            body: data
        });

        if (res.code == 200) {
            this.setState({
                butLoad: false,
                visible: false
            });
            message.success(res.msg);
            this.getData();
            this.props.form.resetFields();
        } else {
            this.setState({
                butLoad: false,
                visible: true
            });
            message.error(res.err);
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { defaData } = this.state;
        const { TextArea } = Input;
        const { Option } = Select;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        let list = [
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
        const newList = list.slice(this.state.roleID - 1, list.length);
        return (
            <div id="agent">
                <Card style={{ width: '100%' }}>
                    <Alert message="团队管理" type="info" showIcon={true} />
                    <div className="search">
                        <Form layout="inline">
                            <Form.Item label="层级">
                                {getFieldDecorator('levels', {
                                    initialValue: this.state.roleID + 1
                                })(
                                    <Select
                                        style={{ width: 150 }}
                                        onChange={this.getLevel}
                                    >
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
                                    <span style={{ marginRight: 30 }}>
                                        <Button
                                            type="primary"
                                            icon="sync"
                                            onClick={this.sync}
                                        >
                                            重置
                                        </Button>
                                    </span>
                                    <span style={{ marginRight: 30 }}>
                                        <Button
                                            type="primary"
                                            icon="plus"
                                            disabled={this.state.hide}
                                            onClick={this.addOpen}
                                        >
                                            新增下级
                                        </Button>
                                    </span>
                                    <span>
                                        <Button
                                            type="primary"
                                            icon="plus"
                                            disabled={this.state.bind}
                                            onClick={this.bindPlay}
                                        >
                                            绑定玩家
                                        </Button>
                                    </span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <Table
                        style={{ marginTop: 20 }}
                        bordered
                        rowKey="_id"
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
                    <Modal
                        visible={this.state.visible}
                        title={this.state.title}
                        onOk={this.handleOk}
                        confirmLoading={this.state.butLoad}
                        maskClosable={false}
                        onCancel={() => {
                            this.setState({
                                visible: false,
                                defaData: {
                                    userid: 0,
                                    nickname: '',
                                    account: '',
                                    password: '',
                                    state: 1,
                                    remark: ''
                                },
                                bind: true
                            });
                            this.props.form.resetFields();
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        {this.state.title === '绑定玩家' ? (
                            <Form layout={'horizontal'} {...formItemLayout}>
                                <Form.Item label="直推ID">
                                    {getFieldDecorator('agentID', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '直推ID不能为空!'
                                            }
                                        ]
                                    })(<Input placeholder="请输入直推ID" />)}
                                </Form.Item>
                                <Form.Item label="玩家ID">
                                    {getFieldDecorator('playerID', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '玩家ID不能为空!'
                                            }
                                        ]
                                    })(<Input placeholder="请输入玩家ID" />)}
                                </Form.Item>
                            </Form>
                        ) : (
                            <Form layout={'horizontal'} {...formItemLayout}>
                                <Form.Item label="账号">
                                    {getFieldDecorator('account', {
                                        initialValue: defaData.account,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入账号!'
                                            },
                                            {
                                                pattern: new RegExp(
                                                    /^[A-Za-z0-9]+$/,
                                                    'g'
                                                ),
                                                message:
                                                    '只能输入字母和数字，不能包含中文和特殊字符！'
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder="请输入账号"
                                            disabled={this.state.disabled}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="名称">
                                    {getFieldDecorator('nickname', {
                                        initialValue: defaData.nickname,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入名称!'
                                            }
                                        ]
                                    })(<Input placeholder="请输入名称" />)}
                                </Form.Item>

                                <Form.Item label="账户密码">
                                    {getFieldDecorator('password', {
                                        initialValue: defaData.password,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入账户密码!'
                                            }
                                        ]
                                    })(
                                        <Input.Password
                                            size="large"
                                            disabled={this.state.hiding}
                                            placeholder="请输入密码"
                                            suffix={
                                                <Tooltip title="Extra information">
                                                    <Icon
                                                        type="eye"
                                                        style={{
                                                            color:
                                                                'rgba(0,0,0,.45)'
                                                        }}
                                                    />
                                                </Tooltip>
                                            }
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="账号状态">
                                    {getFieldDecorator('state', {
                                        initialValue: defaData.state,
                                        rules: [
                                            {
                                                required: true,
                                                message: '状态不能为空!'
                                            }
                                        ]
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>正常</Radio>
                                            <Radio value={2}>冻结</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item label="其他备注">
                                    {getFieldDecorator('remark', {
                                        initialValue: defaData.remark
                                    })(
                                        <TextArea
                                            autosize={{
                                                minRows: 4,
                                                maxRows: 8
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Form>
                        )}
                    </Modal>
                </Card>
            </div>
        );
    }
}

const agentFrom = Form.create({})(Agent);
export default agentFrom;
