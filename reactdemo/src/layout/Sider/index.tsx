import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import './style.less';
import { groupBy } from 'lodash';
import icon from './icon';
import index from './key';
import mapRoute from './menu';
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class Leftmenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: []
        };
    }
    componentDidMount() {
        let res = localStorage.getItem('leftmenu');
        if (res) {
            this.setState({
                list: JSON.parse(res)
            });
        }
    }
    render() {
        const { list } = this.state;
        const groupArr = groupBy(list, 'parentid');
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                width={(window as any).renderPx(256)}
                breakpoint="lg"
                className="sider light"
            >
                <div className="logo">
                    {this.props.collapsed ? (
                        <img
                            src={require('../../assets/img/logo.png')}
                            alt=""
                        />
                    ) : (
                        <h1 style={{ opacity: this.props.collapsed ? 0 : 1 }}>
                            直推后台系统
                        </h1>
                    )}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['0-0']}
                    defaultOpenKeys={['sub0']}
                >
                    {Object.keys(groupArr).map((item: any, i) => {
                        return groupArr[item][0]['isDisplay'] ? (
                            <SubMenu
                                key={`sub{${i}}`}
                                title={
                                    <span>
                                        <Icon type={`${icon[item]}`} />
                                        <span>
                                            {groupArr[item][0]['catalog']}
                                        </span>
                                    </span>
                                }
                            >
                                {groupArr[item].map(it => {
                                    return it['isDisplay'] ? (
                                        <Menu.Item
                                            key={`${index[it.promissionId]}`}
                                        >
                                            <NavLink
                                                to={`${
                                                    mapRoute[it.promissionId]
                                                }`}
                                            >
                                                {it.menu}
                                            </NavLink>
                                        </Menu.Item>
                                    ) : null;
                                })}
                            </SubMenu>
                        ) : null;
                    })}
                </Menu>
            </Sider>
        );
    }
}
export default Leftmenu;
