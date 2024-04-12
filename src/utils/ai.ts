import Taro from '@tarojs/taro';

const AK = "7qCK63Mvodk5zZrKzi9FZITE"
const SK = "liiTuc2f8hB5Zo9olCB3GjN2lFY7dPj5"

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


export interface AIRecognizeData {
    // created: 1712928475
    // id: "as-gfycsbga6g"
    // is_safe: 1
    // object: "chat.completion"
    // result: "This is a white sports car.↵"
    // usage: {prompt_tokens: 28, completion_tokens: 7, total_tokens: 35}
    created: number;
    id: string;
    is_safe: 0 | 1;
    object: string;
    result: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    },
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
            url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/image2text/fuyu_8b?access_token=' + accessToken,
            data: {
                prompt: "这是什么车，请用中文返回结果，只需要回复一个名词",
                image: imageBase64,
            },
            success(response: { data: AIRecognizeData }) {
                resolve(response.data.result);
            },
            fail(error) {
                console.log('error ->>>', error);
                reject(error);
            }
        });

    })
}