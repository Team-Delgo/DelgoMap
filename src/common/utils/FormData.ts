import imageCompression from 'browser-image-compression';

// FormData 내의 'photo' 이미지를 압축한 후 압축된 이미지를 포함하는 새로운 FormData를 반환하는 함수
export async function compressFormData(formData: FormData): Promise<FormData> {
  // 'photo' 항목을 File 객체로 가져옴
  const file = formData.get('photo') as File;

  // 이미지 압축 옵션을 설정
  const options = {
    maxSizeMB: 1, // 이미지의 최대 크기를 설정 (예: 1 MB)
    maxWidthOrHeight: 1920, // 이미지의 최대 너비 또는 높이를 설정
    useWebWorker: true, // WebWorker를 사용하여 병렬 처리를 활성화
  };

  // 이미지를 압축
  const compressedFile = await imageCompression(file, options);

  // 압축된 이미지를 포함하는 새로운 FormData 객체를 생성
  const compressedFormData = new FormData();
  compressedFormData.append('photo', compressedFile);

  // 원본 FormData에서 'photo' 항목을 삭제
  formData.delete('photo');
  
  // 원본 FormData의 나머지 항목들을 압축된 FormData에 추가
  for (const [key, value] of Array.from(formData.entries())) {
    compressedFormData.append(key, value);
  }

  return compressedFormData;
}

//file을 blob형식으로 바꾼후 formData에 담아 반환해주는 함수
export const blobFormData = (data: any, file: any) => {
  const formData = new FormData();

  // 데이터를 JSON 형식으로 변환한 후 Blob 객체로 변환
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });

  // Blob 데이터와 파일을 FormData에 추가
  formData.append('data', blob);
  formData.append('photo', file);

  return formData;
};

export const blobFormDataForMultipleFiles = (data: any, fileList: any) => {
  const formData = new FormData();

  // 데이터를 JSON 형식으로 변환한 후 Blob 객체로 변환
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });

  // Blob 데이터와 파일들을 FormData에 추가
  formData.append('data', blob);

  fileList.forEach((file:any) => {
    console.log(file instanceof File);
    formData.append('photos', file); 
  });

  return formData;
};