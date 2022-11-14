import { Rate, Input } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import styles from '../../styles/public/reviewForm.module.css'
import { KakaoMapData } from '../../types/type';
import API from '../../util/API';
import classnames from 'classnames';

import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import Confirm from '../confirm/Confirm';


interface Props {
  data: KakaoMapData | null
  onRemove : () => void
}
const {TextArea} = Input

/** base64로 변환 */
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const UploadButton = () => {
  return (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
  )
}

function ReviewForm({ data, onRemove }: Props) {
  const containerRef = useRef<HTMLTextAreaElement>(null);

  // 별점 상태
  const [rateValue, setRateValue] = useState(0);
  // 키워드 선택 상태
  const [keyword, setKeyword] = useState<Array<String>>([]);
  // 텍스트 리뷰 엑시트 상태
  const [activeTextArea, setActiveTextArea] = useState(false);
  // 이미지 리스트
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 텍스트 리뷰 value 상태
  const [textReview, setTextReview] = useState('');

  // 컨펌 상태
  const [activeConfirm, setActiveConfirm] = useState(false);

  /**
   * 키워드 토글 핸들러
   */
  const onChageKeywordHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {
    if (keyword.includes(e.target.value)) {
      const newArr = keyword.filter(value=> value === e.target.value ? false : true)
      setKeyword(newArr)
    } else {
      setKeyword((prev)=> {
        return [...prev, e.target.value]
      })
    }
  }, [keyword])

  /** 텍스트 리뷰 체인지 핸들러 */
  const onChangeReviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 400) {
      e.target.value = e.target.value.slice(-1);
      return
    }
    setTextReview(e.target.value);
  };

  // const handleCancel = () => setPreviewOpen(false);

  /** 미리 보기 이미지 핸들러 */
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
  };

  /** 이미지 업로드 인풋 체인지 핸들러 */
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }

  /**
   * 리뷰 저장 핸들러
   */
  const onSubmitReview = () => {
    console.log(data)
    console.log(fileList);
    console.log(textReview);
    console.log(rateValue);
    console.log(keyword)
  }

  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.title}>{data?.place_name}</h1>
      <address>{data?.address_name}</address>
      <div className={styles.ratingContainer}>
        <h2 className={styles.sub_title}>별점 평가</h2>
        <p><b>방문하신 {data?.place_name}</b>에 대한 평점을 남겨주세요:{')'}</p>
        <div className={styles.rate}>
          <Rate onChange={setRateValue} value={rateValue} />
        </div>
      </div>
      <div className={styles.choiceWrapper}>
        <h2 className={styles.sub_title}>어떤 점이 좋았나요?</h2>
        <p>중복 선택이 가능해요</p>
        <div className={styles.choiceContainer}>
          <ul>
            <li>
              <input type="checkbox" name="" id="key_1" value="dynamic" checked={keyword.includes('dynamic')} onChange={onChageKeywordHandler} />
              <label htmlFor="key_1">
                🔥 다이나믹한 문제가 많아요
              </label>
            </li>
            <li>
              <input type="checkbox" name="" id="key_2" value="balance" checked={keyword.includes('balance')} onChange={onChageKeywordHandler} />
              <label htmlFor="key_2">
                🛹 밸런스 문제가 많아요
              </label>
            </li>
            <li>
              <input type="checkbox" name="" id="key_3" value="difficulty" checked={keyword.includes('difficulty')} onChange={onChageKeywordHandler} />
              <label htmlFor="key_3">
                💎 난이도 분배가 잘 돼있어요
              </label>
            </li>
            <li>
              <input type="checkbox" name="" id="key_4" value="clean" checked={keyword.includes('clean')} onChange={onChageKeywordHandler} />
              <label htmlFor="key_4">
                ✨ 시설이 청결해요
              </label>
            </li>
            <li>
              <input type="checkbox" name="" id="key_5" value="traffic" checked={keyword.includes('traffic')} onChange={onChageKeywordHandler} />
              <label htmlFor='key_5'>
                🚘 접근성이 좋아요
              </label>
            </li>
          </ul>
        </div>
        {/* <button onClick={onClickErr}>웹훅 테스트</button> */}
      </div>
      <div className={styles.reviewContainer}>
        <h2 className={styles.sub_title}>리뷰</h2>
        <div className={styles.photoReviewContainer}>
          <Upload
            action="http://localhost:3001/post/img"
            name='files'
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            maxCount={5}
            onChange={handleChange}
            beforeUpload={(file) => {
              // setFileList(fileList.concat(file))
              return false
            }}
          >
            {fileList.length >= 5 ? null : <UploadButton />}
          </Upload>
        </div>
        <div className={classnames({[styles.textareaContainer] : true, [styles.active] : activeTextArea ? true : false})}>
          <div className={classnames({[styles.textareaPlaceHolder] : true, [styles.active] : activeTextArea ? true : false})}>
            <p>
              <span>리뷰 작성하기</span><br/>
              <span>다른 사용자들에게 유용한 정보를 남겨주세요!</span>
            </p>
          </div>
          <textarea onChange={onChangeReviewHandler} value={textReview} onFocus={()=> setActiveTextArea(true)} onBlur={()=> textReview.length === 0 && setActiveTextArea(false)} ref={containerRef} name="" className={classnames({[styles.textArea] : true, [styles.active] : activeTextArea ? true : false})}></textarea>
          <div className={styles.textReview_count}>
            <em>{textReview.length}</em>&nbsp;/&nbsp;400
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.exit} onClick={() => setActiveConfirm(true)}>취소</button>
        <button className={styles.submit} onClick={onSubmitReview}>리뷰 작성</button>
      </div>
    </div>
    <Confirm 
      active={activeConfirm} 
      title="작성 중인 리뷰가 삭제됩니다"
      descript='정말로 삭제하시겠습니까?'
      btnText={["취소", "확인"]}
      onRemove={()=> setActiveConfirm(false)}
      onSubmit={onRemove}
    />
    </>
  );
}

export default ReviewForm;