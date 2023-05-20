import React, { useState,useEffect, useRef } from "react";
import Hammer from "hammerjs";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function RouterWrapper({children}:Props){
  const navigate = useNavigate();
  const location = useLocation();
  const swipeArea = useRef<HTMLDivElement>(null);
  const [hammertime, setHammertime] = useState<HammerManager | null>(null);

  // Define pages where you want to disable swipe
  const disableSwipePages = ['/','/photo','/calendar','achieve'];

  useEffect(() => {
    if (swipeArea.current) {
      const hammerInstance = new Hammer(swipeArea.current);
      setHammertime(hammerInstance);
    }
  }, []);

  useEffect(() => {
    if (hammertime) {
      if (disableSwipePages.includes(location.pathname)) {
        hammertime.off('swiperight');
      } else {
        hammertime.on('swiperight', function (e) {
          navigate(-1);
        });
      }
    }

    // Cleanup function
    return () => {
      if (hammertime) {
        hammertime.off('swiperight');
      }
    };
  }, [navigate, location, hammertime]);

  return (
    <div ref={swipeArea}>
      {children}
    </div>
  );
};

export default RouterWrapper;