import React from 'react';
import './style.less';

const Empty = props => {
    return <div className="empty">{props.text || 404}</div>;
};

export default Empty;
