import classNames from 'classnames';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROOT_PATH } from '../../common/constants/path.const';
import Preview1 from '../../common/images/help1.png';
import Preview2 from '../../common/images/help2.png';
import Preview3 from '../../common/images/help3.png';
import './HelpPage.scss';

function HelpPage() {
  const [page, setPage] = useState(1);
  const scrollRef1 = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);
  const scrollRef3 = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  console.log(page);

  useEffect(()=>{
    if(page===1){
      if(scrollRef1.current){
        console.log('end');
        scrollRef1.current.scrollIntoView({
          block:'start',
          behavior:'smooth'
        })
      }
    }else if(page===2){
      if(scrollRef2.current){
        console.log('end2');
        scrollRef2.current.scrollIntoView({
          block:'start',
          behavior:'smooth'
        })
      }
    }else if(page===3){
      if(scrollRef3.current){
        console.log('end3');
        scrollRef3.current.scrollIntoView({
          block:'start',
          behavior:'smooth'
        })
      }
    }
    
  },[page]);

  const buttonClickHandler = () => {
    if (page === 1 || page === 2) setPage(page + 1);
    else {
      window.localStorage.setItem('visit', 'true');
      navigate(ROOT_PATH);
    }
  };
  return (
    <div className="help">
      <div className="help-blur" />
      <div className="help-content" >
        <div className="help-content-item" ref={scrollRef1}>
          <div className="help-preview">
            <img src={Preview1} alt="preview" />
          </div>
          <h2>{'강아지와의 추억을\n기록해 보세요'}</h2>
          <p>{'사진과 글을 작성하고,\n지도에 핀을 찍어 위치와 함께 저장해요'}</p>
        </div>
        <div className="help-content-item" ref={scrollRef2}>
          <div className="help-preview">
            <img src={Preview2} alt="preview" />
          </div>
          <h2>{'발자국 버튼으로\n내 기록을 확인해요'}</h2>
          <p>{'발자국을 끄면 강아지와 함께 갈 수 있는\n장소들을 볼 수 있어요'}</p>
        </div>
        <div className="help-content-item" ref={scrollRef3}>
          <div className="help-preview">
            <img src={Preview3} alt="preview" />
          </div>
          <h2>{'동네강아지들은 뭐하나\n여기서 볼 수 있어요'}</h2>
          <p>{'우리동네 강아지들은 어디가서 놀았는지\n구경하고 댓글도 남겨봐요'}</p>
        </div>
      </div>
      <div className="help-bar">
        <div className={classNames('help-bar-item', { on: page === 1 })} />
        <div className={classNames('help-bar-item', { on: page === 2 })} />
        <div className={classNames('help-bar-item', { on: page === 3 })} />
      </div>
      <button
        type="button"
        className="help-button"
        onClick={buttonClickHandler}
      >
        계속
      </button>
    </div>
  );
}

export default HelpPage;
