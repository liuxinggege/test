const data = (object: any) => {
    let arr=[];
    if (object !== undefined) {
        object.forEach((element: any) => {
            if (element) {
                if (
                    element._id ||
                    element.playerNum ||
                    element.channelUserNum ||
                    element.betNumTotal
                  
                ) {
                    arr.push({
                        _id: element._id,
                        下注数量:   element.betNumTotal,
                        代理数量:  element.channelUserNum,
                        客户数量:  element.playerNum,
                    });
                }
            }
        });
        console.log(arr);
        return arr;
}
}
export default data;