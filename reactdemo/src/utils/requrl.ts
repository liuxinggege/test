if (!localStorage.getItem('leftmenu')) {
    window.location.href = '/login';
}
const requresturl = (proId: any) => {
    let data = localStorage.getItem('leftmenu')
        ? JSON.parse(localStorage.getItem('leftmenu') || '')
        : '';
    let requesturl: number[] = [];
    data.forEach((item: any, i: number) => {
        if (item.promissionId === proId) {
            requesturl.push(item.url);
        }
    });
    return requesturl[0];
};

export default requresturl;
