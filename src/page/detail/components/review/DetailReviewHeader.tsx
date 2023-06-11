import React from "react"
import DogFoot from "../../../../common/icons/dogfoot.svg";
import Heart from "../../../../common/icons/heart.svg";

function DetailReviewHeader () {
  return <div className="detail-review-header">
    <div className="detail-review-header-title">
      <img className="detail-review-header-title-dogfoot" src={DogFoot} alt="dogfoot" />
      <span className="detail-review-header-title-visit">
        방문 {22}
      </span>
      <span className="detail-review-header-title-recommend">
        (
          <img src={Heart} className="detail-review-header-title-heart" alt="heart"/>
          추천 {14}
        )
      </span>
    </div>
    <span className="detail-review-header-desc">
      여기에 {22}마리의 친구들이 방문했어요
    </span>
    <div className="detail-review-header-div"/>
  </div>
};

export default DetailReviewHeader;