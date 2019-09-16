import * as React from 'react';

interface IProps {}
interface IState {}
class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id="Home">
                <h1>欢迎使用直推后台管理系统!</h1>
            </div>
        );
    }
}
export default Home;

// home 组件
