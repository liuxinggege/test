import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import './style.less';
import { connect } from 'react-redux';
// const rang = times => {
//     return 's'.repeat(times).split('');
// };
interface LoadingProps {
    layout: {
        loading: boolean;
    };
}
class LoadingComponent extends PureComponent<LoadingProps, null> {
    render() {
        return (
            <>
                {
                //     this.props.layout.loading ? (
                //     <div className="message-status message-loading">
                //         {/* {rang(10).map((i, index) => <div key={index} className="line" />)} */}
                //         <Spin />
                //     </div>
                // ) : (
                //     ''
                // )
            }
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        layout: state.layout
    };
}

export default connect(mapStateToProps)(LoadingComponent);
