/*
*水位线区间添加备注
*/
export const waterRange = (tmpRate) => {
    let a = tmpRate.map((v, key) => {
        let s;
        let e;
        if (parseInt(v.value) > 0) {
            s = v ? "" + v.value : "-∞";
            e = tmpRate[key - 1] ? "" + tmpRate[key - 1].value : "+∞";
        } else if (parseInt(v.value) < 0) {
            s = v ? "" + v.value : "-∞";
            e = tmpRate[key + 1] ? "" + tmpRate[key + 1].value : "-∞";
        } else {
            s = tmpRate[key + 1] ? "" + tmpRate[key + 1].value : "-∞";
            e = tmpRate[key - 1] ? "" + tmpRate[key - 1].value : "+∞";
        }
        return {
            note: "[" + s + "," + e + "]",
            rate: v.rate,
            value: v.value
        };
    });
    return a;
};