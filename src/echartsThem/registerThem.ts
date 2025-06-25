/**
 * 读取该 JSON 文件，并使用 obj = JSON.parse(data) 将其转换成对象；
 * 调用 echarts.registerTheme('purple-passion', obj) 注册主题；
 * 使用 echarts.init(dom, 'purple-passion') 创建图表，第二个参数即为刚才注册的主题名字。
 */

import chalk from './chalk.project.json';
import dark from './dark.project.json'
import essos from './essos.project.json';
import infographic from './infographic.project.json';
import macarons from './macarons.project.json';
import purplePassion from './purple-passion.project.json';
import roma from './roma.project.json';
import shine from './shine.project.json';
import vintage from './vintage.project.json';
import walden from './walden.project.json';
import westeros from './westeros.project.json';
import wonderland from './wonderland.project.json';
import customized from './customized.json';
import * as echarts from 'echarts';

export let themArray = [customized, chalk, dark, essos, infographic, macarons, purplePassion, roma, shine, vintage, walden, westeros, wonderland];
export default function registerThem() {

    themArray.forEach(item => {
        echarts.registerTheme(item.themeName, item.theme)
    })
}

export function findThem(themName: string) {
    return themArray.find((item) => item.themeName == themName)!.theme;
}

export const DefaultThem = customized;

export function findDefaultColor(index:number) {
    var length = DefaultThem.theme.color.length;
    let i = index % length;
    return DefaultThem.theme.color[i];
}