import React, { useCallback, useState } from 'react';

function useInput(initialValue: any) {
  const [inputValue, setInputValue] = useState(initialValue);
  const onChangeInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
  }, []);
  const resetInputValue = useCallback(() => setInputValue(''), [initialValue]);

  return [inputValue, onChangeInputValue, resetInputValue];
}

export default useInput;
