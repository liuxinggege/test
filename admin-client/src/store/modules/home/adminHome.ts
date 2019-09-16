import {
  getTodaySum,
  getPTodaySum,
  getTotalSum,
  getTodayWinAndLoseHistory,
  getOnlineInfo,
  getPOnlineInfo,
  getTodayAndYestRealOnline,
  getPTodayAndYestRealOnline
} from '../../../api/admin/home/adminHome'
import { CodeMsg } from '../../index'
import { Commit } from 'vuex'
import { formUtil } from '../../../utils/formatUtils'
export interface TodaySum {
  agentChargeAmt: string
  brniuniuEachDayWinAndLose: string
  brniuniuTax: string
  buyuEachDayWinAndLose: string
  buyuTax: string
  doudizhuEachDayWinAndLose: string
  doudizhuTax: string
  dezhoupukeEachDayWinAndLose: string
  dezhoupukeTax: string
  qianghongbaoEachDayWinAndLose: string
  qianghongbaoTax: string
  erbagangEachDayWinAndLose: string
  erbagangTax: string
  duofuduocaiEachDayWinAndLose: string
  duofuduocaiTax: string
  gameTax: string
  hongheiEachDayWinAndLose: string
  hongheiTax: string
  ermjEachDayWinAndLose: string
  ermjTax: string
  longhuEachDayWinAndLose: string
  longhuTax: string

  paodekuaiEachDayWinAndLose: string
  paodekuaiTax: string
  jdniuniuEachDayWinAndLose: string
  jdniuniuTax: string

  jinhuaEachDayWinAndLose: string
  jinhuaTax: string
  loginUserCount: number
  newUserChargeAmt: string
  newUserCount: number
  newUserPayRate: number
  niuniuEachDayWinAndLose: string
  niuniuTax: string
  payRate: number
  profitRate: number
  suohaEachDayWinAndLose: string
  suohaTax: string
  systemEachDayWinAndLose: string
  totalChargeAmt: string
  totalChargeUserCount: number
  totalProfit: string
  totalWithdrawAmt: string
  agencySettleAmt: string
  totalWithdrawTax: string
  xuezhanEachDayWinAndLose: string
  xuezhanTax: string
}
export interface TotalSum {
  xuezhanWinAndLose: string
  brniuniuWinAndLose: string
  buyuWinAndLose: string
  doudizhuWinAndLose: string
  dezhoupukeWinAndLose: string
  qianghongbaoWinAndLose: string
  erbagangWinAndLose: string
  duofuduocaiWinAndLose: string
  hongheiWinAndLose: string
  ermjWinAndLose: string
  longhuWinAndLose: string

  paodekuaiWinAndLose: string
  jdniuniuWinAndLose: string

  jinhuaWinAndLose: string
  niuniuWinAndLose: string
  suohaWinAndLose: string
  //---------
  bindUserBankGold: string
  bindUserGold: string
  agentChargeAmt: string
  gameTax: string
  jushangGold: string
  newUserCount: number
  systemWinAndLose: string
  totalChargeAmt: string
  totalProfit: string
  totalWithdrawAmt: string
  touristGold: string
  userLeftMoney: string
  agencySettleAmt: string
}
export interface TodayWinAndLoseHistory {
  sumDate: string
  localeSumDate: string
  graphDate: string
  jinhuaEachDayWinAndLose: string
  suohaEachDayWinAndLose: string
  niuniuEachDayWinAndLose: string
  brniuniuEachDayWinAndLose: string
  xuezhanEachDayWinAndLose: string
  doudizhuEachDayWinAndLose: string
  dezhoupukeEachDayWinAndLose: string
  qianghongbaoEachDayWinAndLose: string
  erbagangEachDayWinAndLose: string
  duofuduocaiEachDayWinAndLose: string
  hongheiEachDayWinAndLose: string
  ermjEachDayWinAndLose: string
  longhuEachDayWinAndLose: string
  paodekuaiEachDayWinAndLose: string
  jdniuniuEachDayWinAndLose: string
  buyuEachDayWinAndLose: string
}
export interface TodayAndYestRealOnline {
  sumDate: string
  graphDate: string
  localeSumDate: string
  totalRealOnline: string
  lobbyRealOnline: string
  jinhuaRealOnline: string
  suohaRealOnline: string
  niuniuRealOnline: string
  brniuniuRealOnline: string
  xuezhanRealOnline: string
  doudizhuRealOnline: string
  dezhoupukeRealOnline: string
  qianghongbaoRealOnline: string
  erbagangRealOnline: string
  duofuduocaiRealOnline: string
  hongheiRealOnline: string
  ermjRealOnline: string
  longhuRealOnline: string
  buyuRealOnline: string

  paodekuaiRealOnline: string
  jdniuniuRealOnline: string
}
export interface TodayWinAndLose {
  game: string
  winAndLose: string
  tax: string
}
export interface OnlineInfo {
  avgOnline: number
  brniuniuCustomRealOnline: number
  brniuniuMatchRealOnline: number
  buyuCustomRealOnline: number
  buyuMatchRealOnline: number
  hongheiCustomRealOnline: number
  hongheiMatchRealOnline: number
  ermjCustomRealOnline: number
  ermjMatchRealOnline: number
  longhuCustomRealOnline: number
  longhuMatchRealOnline: number

  jdniuniuCustomRealOnline: number
  jdniuniuMatchRealOnline: number
  paodekuaiCustomRealOnline: number
  paodekuaiMatchRealOnline: number

  doudizhuCustomRealOnline: number
  doudizhuMatchRealOnline: number
  dezhoupukeCustomRealOnline: number
  dezhoupukeMatchRealOnline: number
  qianghongbaoCustomRealOnline: number
  qianghongbaoMatchRealOnline: number
  erbagangCustomRealOnline: number
  erbagangMatchRealOnline: number
  duofuduocaiCustomRealOnline: number
  duofuduocaiMatchRealOnline: number
  jinhuaCustomRealOnline: number
  jinhuaMatchRealOnline: number
  lobbyRealOnline: number
  maxOnline: number
  minOnline: number
  niuniuCustomRealOnline: number
  niuniuMatchRealOnline: number
  realOnline: number
  sumDate: string
  suohaCustomRealOnline: number
  suohaMatchRealOnline: number
  xuezhanCustomRealOnline: number
  xuezhanMatchRealOnline: number
}
export interface State {
  todaySum: TodaySum
  totalSum: TotalSum
  todayWinAndLoseHistory: TodayWinAndLoseHistory[]
  todayWinAndLose: TodayWinAndLose[]
  todayOnline: TodayAndYestRealOnline[]
  yesterdayOnline: TodayAndYestRealOnline[]
  gameOnline: any[]
  numOnline: any[]
  lobbyOnline: any[]
}

// initial state
const state: State = {
  todaySum: {
    agentChargeAmt: '0',
    brniuniuEachDayWinAndLose: '0',
    brniuniuTax: '0',
    buyuEachDayWinAndLose: '0',
    buyuTax: '0',
    doudizhuEachDayWinAndLose: '0',
    doudizhuTax: '0',
    dezhoupukeEachDayWinAndLose: '0',
    dezhoupukeTax: '0',
    qianghongbaoEachDayWinAndLose: '0',
    qianghongbaoTax: '0',
    erbagangEachDayWinAndLose: '0',
    erbagangTax: '0',
    duofuduocaiEachDayWinAndLose: '0',
    duofuduocaiTax: '0',
    hongheiEachDayWinAndLose: '0',
    hongheiTax: '0',
    ermjEachDayWinAndLose: '0',
    ermjTax: '0',
    longhuEachDayWinAndLose: '0',
    longhuTax: '0',

    paodekuaiEachDayWinAndLose: '0',
    paodekuaiTax: '0',
    jdniuniuEachDayWinAndLose: '0',
    jdniuniuTax: '0',

    jinhuaEachDayWinAndLose: '0',
    jinhuaTax: '0',
    loginUserCount: 0,
    newUserChargeAmt: '0',
    newUserCount: 0,
    newUserPayRate: 0,
    niuniuEachDayWinAndLose: '0',
    gameTax: '0',
    niuniuTax: '0',
    payRate: 0,
    profitRate: 0,
    suohaEachDayWinAndLose: '0',
    suohaTax: '0',
    systemEachDayWinAndLose: '0',
    totalChargeAmt: '0',
    totalChargeUserCount: 0,
    totalProfit: '0',
    totalWithdrawAmt: '0',
    agencySettleAmt: '0',
    totalWithdrawTax: '0',
    xuezhanEachDayWinAndLose: '0',
    xuezhanTax: '0'
  },
  totalSum: {
    agentChargeAmt: '0',
    bindUserBankGold: '0',
    bindUserGold: '0',
    brniuniuWinAndLose: '0',
    buyuWinAndLose: '0',
    doudizhuWinAndLose: '0',
    dezhoupukeWinAndLose: '0',
    qianghongbaoWinAndLose: '0',
    erbagangWinAndLose: '0',
    duofuduocaiWinAndLose: '0',
    gameTax: '0',
    hongheiWinAndLose: '0',
    ermjWinAndLose: '0',
    longhuWinAndLose: '0',

    jdniuniuWinAndLose: '0',
    paodekuaiWinAndLose: '0',

    jinhuaWinAndLose: '0',
    jushangGold: '0',
    newUserCount: 0,
    niuniuWinAndLose: '0',
    suohaWinAndLose: '0',
    systemWinAndLose: '0',
    totalChargeAmt: '0',
    totalProfit: '0',
    totalWithdrawAmt: '0',
    touristGold: '0',
    userLeftMoney: '0',
    xuezhanWinAndLose: '0',
    agencySettleAmt: '0'
  },
  todayWinAndLoseHistory: [
    {
      sumDate: '0',
      localeSumDate: '0',
      graphDate: '0',
      jinhuaEachDayWinAndLose: '0',
      suohaEachDayWinAndLose: '0',
      niuniuEachDayWinAndLose: '0',
      brniuniuEachDayWinAndLose: '0',
      xuezhanEachDayWinAndLose: '0',
      doudizhuEachDayWinAndLose: '0',
      dezhoupukeEachDayWinAndLose: '0',
      qianghongbaoEachDayWinAndLose: '0',
      erbagangEachDayWinAndLose: '0',
      duofuduocaiEachDayWinAndLose: '0',
      hongheiEachDayWinAndLose: '0',
      ermjEachDayWinAndLose: '0',
      longhuEachDayWinAndLose: '0',
      paodekuaiEachDayWinAndLose: '0',
      jdniuniuEachDayWinAndLose: '0',
      buyuEachDayWinAndLose: '0'
    }
  ],
  todayWinAndLose: [
    {
      game: '',
      winAndLose: '',
      tax: ''
    }
  ],
  todayOnline: [
    {
      sumDate: '0',
      graphDate: '0',
      localeSumDate: '0',
      totalRealOnline: '0',
      lobbyRealOnline: '0',
      jinhuaRealOnline: '0',
      suohaRealOnline: '0',
      niuniuRealOnline: '0',
      brniuniuRealOnline: '0',
      xuezhanRealOnline: '0',
      doudizhuRealOnline: '0',
      dezhoupukeRealOnline: '0',
      qianghongbaoRealOnline: '0',
      erbagangRealOnline: '0',
      duofuduocaiRealOnline: '0',
      hongheiRealOnline: '0',
      ermjRealOnline: '0',
      longhuRealOnline: '0',
      buyuRealOnline: '0',
      jdniuniuRealOnline: '0',
      paodekuaiRealOnline: '0'
    }
  ],
  yesterdayOnline: [
    {
      sumDate: '0',
      graphDate: '0',
      localeSumDate: '0',
      totalRealOnline: '0',
      lobbyRealOnline: '0',
      jinhuaRealOnline: '0',
      suohaRealOnline: '0',
      niuniuRealOnline: '0',
      brniuniuRealOnline: '0',
      xuezhanRealOnline: '0',
      doudizhuRealOnline: '0',
      dezhoupukeRealOnline: '0',
      qianghongbaoRealOnline: '0',
      erbagangRealOnline: '0',
      duofuduocaiRealOnline: '0',
      hongheiRealOnline: '0',
      ermjRealOnline: '0',
      longhuRealOnline: '0',
      buyuRealOnline: '0',
      jdniuniuRealOnline: '0',
      paodekuaiRealOnline: '0'
    }
  ],
  gameOnline: [],
  numOnline: [],
  lobbyOnline: []
}

const mutations = {
  SET_TODAYSUM: (state: State, data: CodeMsg<TodaySum>) => {
    state.todaySum = data.msg
    state.todaySum.totalChargeAmt = formUtil.moneyFormat(
      state.todaySum.totalChargeAmt
    )
    state.todaySum.agentChargeAmt = formUtil.moneyFormat(
      state.todaySum.agentChargeAmt
    )
    state.todaySum.newUserChargeAmt = formUtil.moneyFormat(
      state.todaySum.newUserChargeAmt
    )
    state.todaySum.totalWithdrawTax = formUtil.moneyFormat(
      state.todaySum.totalWithdrawTax
    )
    state.todaySum.gameTax = formUtil.moneyFormat(state.todaySum.gameTax)
    state.todaySum.totalWithdrawAmt = formUtil.moneyFormat(
      state.todaySum.totalWithdrawAmt
    )
    state.todaySum.agencySettleAmt = formUtil.moneyFormat(
      state.todaySum.agencySettleAmt
    )
    state.todaySum.totalProfit = formUtil.moneyFormat(
      state.todaySum.totalProfit
    )
    state.todaySum.systemEachDayWinAndLose = formUtil.moneyFormat(
      state.todaySum.systemEachDayWinAndLose
    )
    state.todayWinAndLose = [
      {
        game: '炸金花',
        winAndLose: formUtil.moneyFormat(data.msg.jinhuaEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.jinhuaTax)
      },
      // {
      // game: "梭哈",
      // winAndLose: formUtil.moneyFormat(data.msg.suohaEachDayWinAndLose),
      // tax: formUtil.moneyFormat(data.msg.suohaTax)
      // },
      {
        game: '牛牛',
        winAndLose: formUtil.moneyFormat(data.msg.niuniuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.niuniuTax)
      },
      {
        game: '百人牛牛',
        winAndLose: formUtil.moneyFormat(data.msg.brniuniuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.brniuniuTax)
      },
      // {
      // game: "麻将",
      // winAndLose: formUtil.moneyFormat(data.msg.xuezhanEachDayWinAndLose),
      // tax: formUtil.moneyFormat(data.msg.xuezhanTax)
      // },
      {
        game: '斗地主',
        winAndLose: formUtil.moneyFormat(data.msg.doudizhuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.doudizhuTax)
      },
      {
        game: '德州扑克',
        winAndLose: formUtil.moneyFormat(data.msg.dezhoupukeEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.dezhoupukeTax)
      },
      {
        game: '抢红包',
        winAndLose: formUtil.moneyFormat(
          data.msg.qianghongbaoEachDayWinAndLose
        ),
        tax: formUtil.moneyFormat(data.msg.qianghongbaoTax)
      },
      {
        game: '二八杠',
        winAndLose: formUtil.moneyFormat(data.msg.erbagangEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.erbagangTax)
      },
      {
        game: '多福多财',
        winAndLose: formUtil.moneyFormat(data.msg.duofuduocaiEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.duofuduocaiTax)
      },
      {
        game: '红黑',
        winAndLose: formUtil.moneyFormat(data.msg.hongheiEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.hongheiTax)
      },
      {
        game: '二人麻将',
        winAndLose: formUtil.moneyFormat(data.msg.ermjEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.ermjTax)
      },
      {
        game: '龙虎斗',
        winAndLose: formUtil.moneyFormat(data.msg.longhuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.longhuTax)
      },
      {
        game: '经典牛牛',
        winAndLose: formUtil.moneyFormat(data.msg.jdniuniuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.jdniuniuTax)
      },
      {
        game: '跑得快',
        winAndLose: formUtil.moneyFormat(data.msg.paodekuaiEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.paodekuaiTax)
      },
      {
        game: '捕鱼',
        winAndLose: formUtil.moneyFormat(data.msg.buyuEachDayWinAndLose),
        tax: formUtil.moneyFormat(data.msg.buyuTax)
      },
      {
        game: '合计',
        winAndLose: data.msg.systemEachDayWinAndLose,
        tax: data.msg.gameTax
      }
    ]
  },
  SET_TOTALSUM: (state: State, data: CodeMsg<TotalSum>) => {
    state.totalSum = data.msg
    state.totalSum.totalChargeAmt = formUtil.moneyFormat(
      state.totalSum.totalChargeAmt
    )
    state.totalSum.agentChargeAmt = formUtil.moneyFormat(
      state.totalSum.agentChargeAmt
    )
    state.totalSum.totalWithdrawAmt = formUtil.moneyFormat(
      state.totalSum.totalWithdrawAmt
    )
    state.totalSum.agencySettleAmt = formUtil.moneyFormat(
      state.totalSum.agencySettleAmt
    )
    state.totalSum.totalProfit = formUtil.moneyFormat(
      state.totalSum.totalProfit
    )
    state.totalSum.gameTax = formUtil.moneyFormat(state.totalSum.gameTax)
    state.totalSum.systemWinAndLose = formUtil.moneyFormat(
      state.totalSum.systemWinAndLose
    )
    state.totalSum.xuezhanWinAndLose = formUtil.moneyFormat(
      state.totalSum.xuezhanWinAndLose
    )
    state.totalSum.brniuniuWinAndLose = formUtil.moneyFormat(
      state.totalSum.brniuniuWinAndLose
    )
    state.totalSum.buyuWinAndLose = formUtil.moneyFormat(
      state.totalSum.buyuWinAndLose
    )
    state.totalSum.doudizhuWinAndLose = formUtil.moneyFormat(
      state.totalSum.doudizhuWinAndLose
    )
    state.totalSum.dezhoupukeWinAndLose = formUtil.moneyFormat(
      state.totalSum.dezhoupukeWinAndLose
    )
    state.totalSum.qianghongbaoWinAndLose = formUtil.moneyFormat(
      state.totalSum.qianghongbaoWinAndLose
    )
    state.totalSum.erbagangWinAndLose = formUtil.moneyFormat(
      state.totalSum.erbagangWinAndLose
    )
    state.totalSum.duofuduocaiWinAndLose = formUtil.moneyFormat(
      state.totalSum.duofuduocaiWinAndLose
    )
    state.totalSum.hongheiWinAndLose = formUtil.moneyFormat(
      state.totalSum.hongheiWinAndLose
    )
    state.totalSum.ermjWinAndLose = formUtil.moneyFormat(
      state.totalSum.ermjWinAndLose
    )
    state.totalSum.longhuWinAndLose = formUtil.moneyFormat(
      state.totalSum.longhuWinAndLose
    )
    state.totalSum.paodekuaiWinAndLose = formUtil.moneyFormat(
      state.totalSum.paodekuaiWinAndLose
    )
    state.totalSum.jdniuniuWinAndLose = formUtil.moneyFormat(
      state.totalSum.jdniuniuWinAndLose
    )
    state.totalSum.jinhuaWinAndLose = formUtil.moneyFormat(
      state.totalSum.jinhuaWinAndLose
    )
    state.totalSum.niuniuWinAndLose = formUtil.moneyFormat(
      state.totalSum.niuniuWinAndLose
    )
    state.totalSum.suohaWinAndLose = formUtil.moneyFormat(
      state.totalSum.suohaWinAndLose
    )
  },
  SET_TODAYWINDANDLOSE: (
    state: State,
    data: CodeMsg<TodayWinAndLoseHistory[]>
  ) => {
    state.todayWinAndLoseHistory = data.msg
    state.todayWinAndLoseHistory = data.msg.map(e => {
      e.jinhuaEachDayWinAndLose = formUtil.moneyFormat(
        e.jinhuaEachDayWinAndLose
      )
      e.suohaEachDayWinAndLose = formUtil.moneyFormat(e.suohaEachDayWinAndLose)
      e.niuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.niuniuEachDayWinAndLose
      )
      e.brniuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.brniuniuEachDayWinAndLose
      )
      e.xuezhanEachDayWinAndLose = formUtil.moneyFormat(
        e.xuezhanEachDayWinAndLose
      )
      e.doudizhuEachDayWinAndLose = formUtil.moneyFormat(
        e.doudizhuEachDayWinAndLose
      )
      e.dezhoupukeEachDayWinAndLose = formUtil.moneyFormat(
        e.dezhoupukeEachDayWinAndLose
      )
      e.qianghongbaoEachDayWinAndLose = formUtil.moneyFormat(
        e.qianghongbaoEachDayWinAndLose
      )
      e.erbagangEachDayWinAndLose = formUtil.moneyFormat(
        e.erbagangEachDayWinAndLose
      )
      e.duofuduocaiEachDayWinAndLose = formUtil.moneyFormat(
        e.duofuduocaiEachDayWinAndLose
      )
      e.hongheiEachDayWinAndLose = formUtil.moneyFormat(
        e.hongheiEachDayWinAndLose
      )
      e.ermjEachDayWinAndLose = formUtil.moneyFormat(e.ermjEachDayWinAndLose)
      e.longhuEachDayWinAndLose = formUtil.moneyFormat(
        e.longhuEachDayWinAndLose
      )
      e.paodekuaiEachDayWinAndLose = formUtil.moneyFormat(
        e.paodekuaiEachDayWinAndLose
      )
      e.jdniuniuEachDayWinAndLose = formUtil.moneyFormat(
        e.jdniuniuEachDayWinAndLose
      )
      e.buyuEachDayWinAndLose = formUtil.moneyFormat(e.buyuEachDayWinAndLose)
      return e
    })
  },
  SET_ONLINEINFO: (state: State, data: CodeMsg<OnlineInfo>) => {
    state.gameOnline = [
      {
        game: '百人牛牛',
        matchNumber: data.msg.brniuniuMatchRealOnline,
        customNumber: data.msg.brniuniuCustomRealOnline
      },
      {
        game: '血战',
        matchNumber: data.msg.xuezhanMatchRealOnline,
        customNumber: data.msg.xuezhanCustomRealOnline
      },
      {
        game: '梭哈',
        matchNumber: data.msg.suohaMatchRealOnline,
        customNumber: data.msg.suohaCustomRealOnline
      },
      {
        game: '金花',
        matchNumber: data.msg.jinhuaMatchRealOnline,
        customNumber: data.msg.jinhuaCustomRealOnline
      },
      {
        game: '牛牛',
        matchNumber: data.msg.niuniuMatchRealOnline,
        customNumber: data.msg.niuniuCustomRealOnline
      },
      {
        game: '红黑',
        matchNumber: data.msg.hongheiMatchRealOnline,
        customNumber: data.msg.hongheiCustomRealOnline
      },
      {
        game: '二人麻将',
        matchNumber: data.msg.ermjMatchRealOnline,
        customNumber: data.msg.ermjCustomRealOnline
      },
      {
        game: '龙虎斗',
        matchNumber: data.msg.longhuMatchRealOnline,
        customNumber: data.msg.longhuCustomRealOnline
      },
      {
        game: '经典牛牛',
        matchNumber: data.msg.jdniuniuMatchRealOnline,
        customNumber: data.msg.jdniuniuCustomRealOnline
      },
      {
        game: '跑得快',
        matchNumber: data.msg.paodekuaiMatchRealOnline,
        customNumber: data.msg.paodekuaiCustomRealOnline
      },
      {
        game: '斗地主',
        matchNumber: data.msg.doudizhuMatchRealOnline,
        customNumber: data.msg.doudizhuCustomRealOnline
      },
      {
        game: '德州扑克',
        matchNumber: data.msg.dezhoupukeMatchRealOnline,
        customNumber: data.msg.dezhoupukeCustomRealOnline
      },
      {
        game: '抢红包',
        matchNumber: data.msg.qianghongbaoMatchRealOnline,
        customNumber: data.msg.qianghongbaoCustomRealOnline
      },
      {
        game: '二八杠',
        matchNumber: data.msg.erbagangMatchRealOnline,
        customNumber: data.msg.erbagangCustomRealOnline
      },
      {
        game: '多福多财',
        matchNumber: data.msg.duofuduocaiMatchRealOnline,
        customNumber: data.msg.duofuduocaiCustomRealOnline
      },
      {
        game: '捕鱼',
        matchNumber: data.msg.buyuMatchRealOnline,
        customNumber: data.msg.buyuCustomRealOnline
      }
    ]
    state.numOnline = [
      {
        avgOnline: data.msg.avgOnline,
        maxOnline: data.msg.maxOnline,
        minOnline: data.msg.minOnline
      }
    ]
    state.lobbyOnline = [
      {
        realOnline: data.msg.realOnline,
        lobbyRealOnline: data.msg.lobbyRealOnline
      }
    ]
  },
  SET_TODAYANDYESTER: (state: State, data) => {
    state.todayOnline = data.msg.todayOnline
    state.yesterdayOnline = data.msg.yesterdayOnline
  }
}
// actions
const actions = {
  GetTodaySum(context: { commit: Commit; state: State }, data) {
    //获取今日概况
    return new Promise(async (resolve, reject) => {
      getTodaySum(data)
        .then((response: { data }) => {
          context.commit('SET_TODAYSUM', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  GetPTodaySum(context: { commit: Commit; state: State }, data) {
    //获取今日概况
    return new Promise(async (resolve, reject) => {
      getPTodaySum(data)
        .then((response: { data }) => {
          context.commit('SET_TODAYSUM', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  GetTotalSum(context: { commit: Commit; state: State }, data) {
    //获取总概况
    return new Promise(async (resolve, reject) => {
      getTotalSum(data)
        .then((response: { data }) => {
          context.commit('SET_TOTALSUM', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  //游戏今日输赢走势
  GetTodayWinAndLoseHistory(context: { commit: Commit; state: State }, data) {
    return new Promise(async (resolve, reject) => {
      getTodayWinAndLoseHistory(data)
        .then((response: { data }) => {
          context.commit('SET_TODAYWINDANDLOSE', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
        })
    })
  },
  //当前在线信息
  GetOnlineInfo(context: { commit: Commit; state: State }, data) {
    return new Promise(async (resolve, reject) => {
      getOnlineInfo(data)
        .then((response: { data }) => {
          context.commit('SET_ONLINEINFO', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  //P当前在线信息
  GetPOnlineInfo(context: { commit: Commit; state: State }, data) {
    return new Promise(async (resolve, reject) => {
      getPOnlineInfo(data)
        .then((response: { data }) => {
          context.commit('SET_ONLINEINFO', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  //今日昨日在线对比
  GetTodayAndYestRealOnline(context: { commit: Commit; state: State }, data) {
    return new Promise(async (resolve, reject) => {
      getTodayAndYestRealOnline(data)
        .then((response: { data }) => {
          context.commit('SET_TODAYANDYESTER', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  },
  //P今日昨日在线对比
  GetPTodayAndYestRealOnline(context: { commit: Commit; state: State }, data) {
    return new Promise(async (resolve, reject) => {
      getPTodayAndYestRealOnline(data)
        .then((response: { data }) => {
          context.commit('SET_TODAYANDYESTER', response.data)
          resolve(response.data.code)
        })
        .catch(error => {
          console.error('catch', error)
          resolve()
        })
    })
  }
}
export default {
  state,
  // getters,
  actions,
  mutations
}
