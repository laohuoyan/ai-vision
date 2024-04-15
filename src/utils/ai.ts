/**
 *  百度AI 示例代码：https://console.bce.baidu.com/tools/?u=dhead#/api?product=AI&project=%E5%9B%BE%E5%83%8F%E8%AF%86%E5%88%AB&parent=%E8%BD%A6%E8%BE%86%E5%88%86%E6%9E%90&api=rest%2F2.0%2Fimage-classify%2Fv1%2Fcar&method=post
 */

import Taro from '@tarojs/taro';

// 下面是错误的AK、SK
const AK = "xgfltmYhBviXw5l12bPx1P9EQtK"
const SK = "sgql3mtJEwgeLPbVWutEeTSP14vPXGi7Fn8"

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
export function getAccessToken() {
    return new Promise((resolve, reject) => {
        Taro.request({
            method: 'POST',
            url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
            success(response: any) {
                resolve(response.data.access_token)
            },
            fail(error) {
                reject(error);
            }
        })
    })
}


// 千帆大模型
// export interface AIRecognizeData {
//     // created: 1712928475
//     // id: "as-gfycsbga6g"
//     // is_safe: 1
//     // object: "chat.completion"
//     // result: "This is a white sports car.↵"
//     // usage: {prompt_tokens: 28, completion_tokens: 7, total_tokens: 35}
//     created: number;
//     id: string;
//     is_safe: 0 | 1;
//     object: string;
//     result: string;
//     usage: {
//       prompt_tokens: number;
//       completion_tokens: number;
//       total_tokens: number;
//     },
// }

// 可能的结果
export interface AIRecognizeItem {
    /** 车型上市年 */
    year: string;
    /** 车型 */
    name: string;
    /** 预测分 */
    score: number;
}

// 图片识别 - 车型识别
export interface AIRecognizeData {
    /** 颜色，比如 白色 */
    color_result: string;
    result: Array<AIRecognizeItem>
}

/**
 * ai 识别
 * @param imageBase64 
 * @doc https://console.bce.baidu.com/tools/?_=1712760558897&u=qfdc#/api?product=QIANFAN&project=%E5%8D%83%E5%B8%86%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0&parent=%E5%9B%BE%E5%83%8FImages&api=rpc%2F2.0%2Fai_custom%2Fv1%2Fwenxinworkshop%2Fimage2text%2Ffuyu_8b&method=post
 */
export async function aiRecognize(imageBase64: string) {
    const accessToken = await getAccessToken();

    return new Promise<string>((resolve, reject) => {
        Taro.request({
            method: 'POST',
            url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/car?access_token=' + accessToken,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: {
                image: imageBase64,
            },
            success(response: { data: AIRecognizeData }) {
                resolve(formatResult(response.data));
            },
            fail(error) {
                console.log('error ->>>', error);
                reject(error);
            }
        });

    })
}

export function formatResult(result: AIRecognizeData) {
    const firstItem = result.result?.[0];
    if (!firstItem) return '未识别';

    return `${result.color_result} ${firstItem.name} (${firstItem.year}年)`;
}