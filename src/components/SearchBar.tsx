import React, { useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { Mungple } from "./maptype";
import "./SearchBar.scss";
import Search from "../common/icons/search.svg";

function SearchBar(props: { cafeList: Mungple[]; selectId: (data: Mungple) => void }) {
  const { cafeList, selectId } = props;
  const [isFocus, setIsFocus] = useState(false);
  const [enteredInput, setEnteredInput] = useState("");
  const [option, setOption] = useState<Mungple[]>([]);
  const ref = useOnclickOutside(() => {
    setIsFocus(false);
    document.getElementById("search")?.blur();
  });

  const inputFoucs = () => {
    setIsFocus(true);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredInput(e.target.value);
    if (cafeList.length > 0 && e.target.value.length > 0) {
      let autoComplete: Mungple[];
      if (e.target.value.length > 1) {
        autoComplete = cafeList.filter((cafe) => {
          return (
            cafe.placeName.includes(e.target.value) || cafe.jibunAddress.includes(e.target.value)
          );
        });
      } else {
        autoComplete = cafeList.filter((cafe) => {
          return cafe.placeName.includes(e.target.value);
        });
      }
      setOption(autoComplete);
    }
  };

  const autoCompleteContext = option.map((cafe) => {
    const onClickHandler = () => {
      selectId(cafe);
      setEnteredInput(cafe.placeName);
      setIsFocus(false);
      setOption([]);
    };
    return (
      <div className="search-auto-item" onClick={onClickHandler}>
        {cafe.placeName}
        <span>{cafe.roadAddress}</span>
      </div>
    );
  });

  return (
    <div ref={ref}>
      <div className="search">
        <input
          id="search"
          value={enteredInput}
          onChange={inputChangeHandler}
          onClick={inputFoucs}
        />
        <img src={Search} alt="search" />
      </div>
      {isFocus && option.length > 0 && enteredInput.length > 0 && (
        <div className="search-auto">{autoCompleteContext}</div>
      )}
    </div>
  );
}

export default SearchBar;
