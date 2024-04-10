import { View, Button } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'
import './index.scss'
import { aiRecognize } from '@/utils/ai';

export default function Index() {

  // 选择图片
  const chooseImage = () => {
    return new Promise<string>((resolve) => {
      Taro.chooseImage({
        count: 1, // 最多选择一张图片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // 将图片转换成 base64
          const base64 = convertToBase64(res.tempFilePaths[0]);
          resolve(base64);
        }
      });

    })
  };

  const convertToBase64 = (imgFilePath: string) => {
    return new Promise<string>((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: imgFilePath,
        encoding: 'base64',
        success: (res) => {
          console.log('base64:', res.data);
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    })
  } 

  const handleClick = async () => {
    const base64 = await chooseImage();
    aiRecognize(base64);
  }


  return (
    <View className='index'>
      <Button onClick={handleClick}>点我识车</Button>
    </View>
  )
}
