import { View, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { aiRecognize } from '@/utils/ai';
import { useState } from 'react';

export default function Index() {
  const [result, setResult] = useState<string>();

  // 选择图片
  const chooseImage = () => {
    return new Promise<string>((resolve) => {
      Taro.chooseImage({
        count: 1, // 最多选择一张图片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: async (res) => {
          // 将图片转换成 base64
          const base64 = await convertLocalImageToBase64(res.tempFilePaths[0]);
          resolve(base64);
        },
        fail(error) {
          console.log('chooseImage: ', error);
        },
      });

    })
  };

  const convertLocalImageToBase64 = (imgFilePath: string) => {
    return new Promise<string>((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: imgFilePath,
        encoding: 'base64',
        success: (res) => {
          resolve(res.data.toString());
        },
        fail: (err) => {
          reject(err);
        }
      });
    })
  } 

  const handleClick = async () => {
    const base64 = await chooseImage();
    try {
      // loading
      Taro.showLoading({ title: '努力识别中...' })
      // 开始识别
      const result = await aiRecognize(base64);
      // 识别的结果
      setResult(result);
    } catch (error) {
      console.error(error);
      Taro.showToast({
        title: JSON.stringify(error),
      })
    } finally {
      Taro.hideLoading()
    }
  }


  return (
    <View className='page'>
      <Text>{result}</Text>

      <Button
        className='ai-btn'
        onClick={handleClick}
      >点我识车</Button>
    </View>
  )
}
