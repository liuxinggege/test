import React, { PureComponent, ReactNode } from 'react';
import Empty from '../../layout/Empty';

interface SceneProps {
    renderChild(showError: Function): ReactNode;
}

class Scene extends PureComponent<SceneProps, any> {
    constructor(props: SceneProps) {
        super(props);
        this.state = { hasError: false, message: '' };
        this.showError = this.showError.bind(this);
    }

    componentDidCatch(message, info) {
        this.setState({ hasError: true, message });
    }

    showError(message, type) {
        this.setState({ message, type, hasError: true });
    }

    render() {
        if (this.state.hasError) {
            let { message } = this.state;
            return <Empty text={message} />;
        }

        const renderChild = this.props.renderChild;
        return <React.Fragment>{renderChild(this.showError)}</React.Fragment>;
    }
}

export default Scene;
