import React from 'react';
import ReactDOM from 'react-dom';
import './style.less';

function MyContainer({ msg }: any) {
    return (
        <div className="toast">
            <div className="toast-content">{msg}</div>
        </div>
    );
}

const Toast = (msg: any, timer = 3000) => {
    const doc = window.document;
    const node = doc.createElement('div');
    doc.body.appendChild(node);
    ReactDOM.render(<MyContainer msg={msg} />, node, () => {
        const toastNode = node.getElementsByTagName('div')[0];
        toastNode.style.animation = `toastAnimate ${timer + 500}ms`;
        setTimeout(() => {
            window.document.body.removeChild(node);
        }, timer);
    });
    return;
};

export default Toast;
