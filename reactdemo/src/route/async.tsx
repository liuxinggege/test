/**
 * 异步加载组件，用于codesplit
 */

import React, { PureComponent } from 'react';

export default loader => {
    return class Async extends PureComponent {
        mounted = true;

        state = {
            component: null
        };

        componentDidMount() {
            loader()
                .then(({ default: component }) => {
                    if (!this.mounted) return;
                    this.setState({ component });
                })
                .catch(() => {
                    if (!this.mounted) return;
                });
        }

        componentWillUnmount() {
            // this.mounted = false;
        }

        render() {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    };
};
