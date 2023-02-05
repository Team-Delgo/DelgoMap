import React, { useCallback, useState } from 'react';

function useActive(initialValue: any) {
  const [isActive, setActive] = useState(initialValue);
  const active = useCallback(() => {
    setActive(true);
  }, []);
  const inactive = useCallback(() => {
    setActive(false);
  }, []);
  return [isActive, active, inactive];
}

export default useActive;
