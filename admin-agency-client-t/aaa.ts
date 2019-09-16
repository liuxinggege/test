代理后台
    / api / agency / home  增加一个 fundReserve：//true表示弹窗，false表示不弹窗

/api/agency / receiveWelfare  增加一个参数 //true表示弹窗，false表示不弹窗
    / api / agency / getBonusPool   get      返回值：{//获取基金和状态
    code: number,//200为成功，其他为失败
        msg: {
        totalFound: number,//总基金值
            state: numner,//1:预约，2：未达标，3：达标，4：审核，5：成功，6：失败 0:未达到条件不能预约
                err: string//失败时有错误信息
    }
    /api/agency / receiveBonusPool   post      返回值：{//领取
        code: number,//200为成功，其他为失败
            msg: “”
        err: string//失败时有错误信息
    }
    /api/agency / getBonusPoolRecord   get      返回值：{//资金记录
        code: number,//200为成功，其他为失败
            msg: {
            totalCount: number,//总基金值
                pageData: { sumDate: date, money: string } []
            err: string//失败时有错误信息
        }
        /api/agency / getBonusPoolRank   get      返回值：{//排名
            code: number,//200为成功，其他为失败
                msg: {
                selfInfo: { taxRate: string, totalFound: string, rank: number },//taxRate:代理点位，totalFound:奖池金额，rank：排名
                rankInfo: { agencyId: number, taxRate: string, totalFound: string } []//agencyId，代理id,taxRate:当前点位，totalFound:奖池金额，rank：排名//排名就是按照数组的顺序升序
                err: string//失败时有错误信息
            }
            主后台
                //订单相关
                / api / admin / agencyMgr / agencyBonusPool / getAgencyBonusPoolOrder   get   参数{
                pid: string,
                    agencyId: number,
                        startDate: Date,
                            endDate: Date,
                                status: string,// success-成功，fail-失败，await-等待审核
                                    }
            返回值：{
                code: number,//200为成功，其他为失败
                    msg: {
                    totalCount: number,
                        pageData: {
                        pid: string,//项目
                            agencyId: string,//代理id
                                status: string,//状态
                                    money: string,//申请金额
                                        applyDate: Date,//提交时间
                                            optDate: Date,//操作时间
                                                operator: string,//操作人}[]
                                                    err: string//失败时有错误信息
                    }
                    /api/admin / agencyMgr / agencyBonusPool / passAgencyBonusPoolOrder   post   参数{
                        id: string//_id
                    }
                    返回值：{
                        code: number,//200为成功，其他为失败
                            msg: ""
                        err: string//失败时有错误信息
                    }
                    /api/admin / agencyMgr / agencyBonusPool / refuseAgencyBonusPoolOrder   post   参数{
                        id: string//_id
                        info: string//拒绝信息
                    }
                    返回值：{
                        code: number,//200为成功，其他为失败
                            msg: ""
                        err: string//失败时有错误信息
                    }
                    /api/admin /export /agencyMgr/exportAgency   get   参数{
                        pid: string,
                            agencyId: number,
                                startDate: Date,
                                    endDate: Date,
                                        status: string,// success-成功，fail-失败，await-等待审核
                                    }
                    返回值：{
                        code: number,//200为成功，其他为失败
                            msg:
                        err: string//失败时有错误信息
                    }
                    //代理后台活动列表配置相关
                    /api/admin / agencyMgr / activity / getActivity   get   参数{
                        pid: string,
                            startDate: Date,
                                endDate: Date,
                                    }
                    返回值：{
                        code: number,//200为成功，其他为失败
                            msg: {
                            totalCount: number,
                                pageData: {
                                pid: string,//项目
                                    startDate: Date,//活动开始时间
                                        endDate: Date,//活动结束时间
                                            createDate: Date,//创建时间
                                                type: string,//活动类型
                                                    state: boolean,//状态//true为已开启，false为未开启
                                                        idx: string,//排序
                                                            opt: string,//操作人}[]
                                                                err: string//失败时有错误信息
                            }
                            /api/admin / agencyMgr / activity / changeActivityCfgState   post   参数{
                                id: string,//_id
                                    }
                            返回值：{
                                code: number,//200为成功，其他为失败
                                    msg:
                                err: string//失败时有错误信息
                            }