import { UPLOAD_PATH } from 'common/constants/path.const';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadAction } from 'redux/slice/uploadSlice';

interface Props {
  onClick: () => void;
}

function DetailCertButton({ onClick }: Props) {
  return (
    <div
      aria-hidden
      onClick={onClick}
      className="animate-fadeIn fixed bottom-[45px] left-[50%] z-[100] flex w-[90%] translate-x-[-50%] items-center justify-center rounded-[12px] bg-[#7a5ccf] py-[14px] text-[16px] text-white"
    >
      이곳에 기록 남기기
    </div>
  );
}

export default DetailCertButton;
