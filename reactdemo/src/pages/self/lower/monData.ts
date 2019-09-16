const data = (object: any) => {
    let arr = [];
    if (object !== undefined) {
        object.forEach((element: any) => {
            if (element) {
                if (
                    element._id ||
                    element.activityPrizeTotal ||
                    element.betTotal ||
                    element.channelRebate ||
                    element.rechargeTotal ||
                    element.selfCustomerRebate ||
                    element.winTotal ||
                    element.withdrawTotal ||
                    element.myRebate ||
                    element.childRebate
                ) {
                    arr.push({
                        _id: element._id,
                        毛利:
                            (element.betTotal -
                                element.winTotal -
                                element.activityPrizeTotal) /
                            100,
                        活动领取金额: element.activityPrizeTotal / 100,
                        下注金额: element.betTotal / 100,
                        中奖金额: element.winTotal / 100,
                        用户充值: element.rechargeTotal,
                        用户提现: element.withdrawTotal
                    });
                }
            }
        });
        console.log(arr);
        return arr;
    }
};
export default data;
