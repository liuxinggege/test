import React from 'react';
import { createPortal } from 'react-dom';

class Portal extends React.Component {
    node: any;
    constructor(props: any) {
        super(props);

        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);
    }

    render() {
        return createPortal(
            <div className="portal">{this.props.children}</div>,
            this.node
        );
    }

    componentWillUnmount() {
        window.document.body.removeChild(this.node);
    }
}

export default Portal;
