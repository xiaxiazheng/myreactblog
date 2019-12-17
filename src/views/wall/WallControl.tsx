import React, { useState, useEffect } from 'react';
import styles from './WallControl.module.scss';
import { getImgList } from '@/client/ImgHelper';
import { baseUrl } from '@/env_config';
import ImageBox from '@/components/image-box/ImageBox';

interface ImgType {
  cTime: string;
  filename: string;
  img_id: string;
  imgname: string;
  other_id: string;
  type: string;
  imgUrl?: string;
};

const WallControl: React.FC = () => {

  const [wallList, setWallList] = useState<ImgType[]>([])

  useEffect(() => {
    getWallImageList();
  }, []);

  const getWallImageList = async () => {
    let imgList: any = [];
    const res: ImgType[] = await getImgList('wall');
    for (let item of res) {
      // 拼好 img 的 url
      imgList.push({
        ...item,
        imgUrl: `${baseUrl}/wall/${item.filename}`
      });
    }
    setWallList(imgList);
  };
  
  return (
    <div className={styles.wallControl}>
      {wallList.map((item: ImgType) => {
        return (
          <ImageBox
            key={item.img_id}
            type="wall"
            imageId={item.img_id}
            imageName={item.imgname}
            imageFileName={item.filename}
            imageUrl={`${baseUrl}/wall/${item.filename}`}
            initImgList={getWallImageList}
          />
        )
      })}
      <ImageBox type="wall" imageUrl="" initImgList={getWallImageList}/>
    </div>
  );
}

export default WallControl;
