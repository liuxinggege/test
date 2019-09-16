function generateEnum(backEndValue, displayValue) {
    return {
        backEndValue,
        displayValue,
    };
}

export const BonusPoolActivityState = [
    generateEnum("notReserve", "未预约"),
    generateEnum("reserve", "已预约"),
    generateEnum("submit", "已提交"),
    generateEnum("success", "已领取"),
];