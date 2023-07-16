import imageCompression from 'browser-image-compression';

export async function compressFormData(formData: FormData): Promise<FormData> {
  const file = formData.get('photo') as File;

  const options = {
    maxSizeMB: 1, // 이미지의 최대 크기를 설정합니다. 예: 1 MB
    maxWidthOrHeight: 1920, // 이미지의 최대 너비 또는 높이를 설정합니다.
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);

  const compressedFormData = new FormData();
  compressedFormData.append('photo', compressedFile);
  formData.delete('photo');
  for (const [key, value] of Array.from(formData.entries())) {
    compressedFormData.append(key, value);
  }

  return compressedFormData;
}

export const blobFormData = (data: any, file: any) => {
  const formData = new FormData();

  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });

  formData.append('data', blob);
  formData.append('photo', file);

  return formData;
};