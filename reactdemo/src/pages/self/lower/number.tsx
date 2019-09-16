import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import dataList from './numData';
const DataSet = require('@antv/data-set');
class numberPic extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: []
        };
    }
    render() {
        let { numList } = this.props;
        const data = dataList(numList);
        console.log(data);

        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: 'fold',
            fields: ['下注数量', '客户数量'],
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
                <Chart width={600} height={400} data={dv} scale={cols} forceFit>
                    <Legend
                        itemFormatter={val => {
                            const mapName = {
                                下注数量: '下注数量',
                                客户数量: '客户数量',
                            };
                            return mapName[val];
                        }}
                    />
                    <Axis name="_id" />
                    <Axis
                        name="temperature"
                        label={{
                            formatter: val => `${val}个`
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

export default numberPic;
