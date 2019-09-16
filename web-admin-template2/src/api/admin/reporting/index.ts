declare var require: any
import axios from '../../../utils/request';

export const value:string = "reporting";

export function getBets(data) {
    return axios.post(`/api/history/bets`, data);
}