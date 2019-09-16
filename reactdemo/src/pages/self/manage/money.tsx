import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import dataList from './monData';
const DataSet = require('@antv/data-set');
class moneyPic extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: []
        };
    }
    render() {
        let { amountList } = this.props;
        const data = dataList(amountList);
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: 'fold',
            fields: [
                '毛利',
                '活动领取金额',
                '下注金额',
                '中奖金额',
                '用户充值',
                '用户提现'
            ],
            // 展开字段集
            key: 'city',
            // key字段
            value: 'temperature' // value字段
        });
        // 定义度量

        const cols = {
            _id: {
                range: [0, 0.95]
            }
        };
        return (
            <div>
                <Chart width={700} height={400} data={dv} scale={cols} forceFit>
                    <Legend
                        itemFormatter={val => {
                            const mapName = {
                                毛利: '毛利',
                                活动领取金额: '活动领取金额',
                                下注金额: '下注金额',
                                中奖金额: '中奖金额',
                                用户充值: '用户充值',
                                用户提现: '用户提现'
                            };
                            return mapName[val];
                        }}
                    />
                    <Axis name="_id" />
                    <Axis
                        name="temperature"
                        label={{
                            formatter: val => `${val}元`
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: 'y'
                        }}
                    />
                    <Geom
                        type="line"
                        position="_id*temperature"
                        size={2}
                        color={'city'}
                        shape={'smooth'}
                    />
                    <Geom
                        type="point"
                        position="_id*temperature"
                        size={4}
                        shape={'circle'}
                        color={'city'}
                        style={{
                            stroke: '#fff',
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>
        );
    }
}

export default moneyPic;
