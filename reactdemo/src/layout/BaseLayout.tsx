import React, { Component } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sider from './Sider';
import RouterView from '../route/index';
const { Content } = Layout;

interface State {
    collapsed: boolean;
}

export default class BaseLayout extends Component<null, State> {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        };
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };
    render() {
        const { collapsed } = this.state;
        return (
            <>
                <Layout>
                    <Sider collapsed={collapsed} />
                    <Layout>
                        <Header collapsed={collapsed} toggle={this.toggle} />
                        <Content
                            style={{
                                margin: '20px 16px',
                                padding: 24,
                                background: '#fff',
                                minHeight: 280
                            }}
                        >
                            <RouterView />
                        </Content>
                    </Layout>
                </Layout>
            </>
        );
    }
}
