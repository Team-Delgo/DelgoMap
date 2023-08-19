// 이미지 URL을 받아 새로운 Image 객체를 생성하고 반환하는 함수
export const createImage = (url: any) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image)); // 이미지 로드 완료 시 resolve
    image.addEventListener('error', (error) => reject(error)); // 에러 발생 시 reject
    image.setAttribute('crossOrigin', 'anonymous'); // 크로스 오리진 이슈 방지
    image.src = url;
  });

// 각도 값을 라디안 값으로 변환하는 함수
export function getRadianAngle(degreeValue: any) {
  return (degreeValue * Math.PI) / 180;
}

// 회전된 사각형의 새로운 경계 영역을 반환하는 함수
export function rotateSize(width: any, height: any, rotation: any) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

// 이미지를 잘라내는 함수
export default async function getCroppedImg(
  imageSrc: any,
  pixelCrop: any,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) {
  const image = (await createImage(imageSrc)) as any;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // 회전된 이미지의 경계 상자를 계산
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // 캔버스 크기를 경계 상자와 일치하게 설정
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // 중심 위치를 기준으로 캔버스 컨텍스트를 변환하여 중심 주위로 회전 및 뒤집기 가능하게 함
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // 회전된 이미지 그리기
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels 값은 경계 상자와 상대적이므로, 이 값들을 사용하여 잘라낸 이미지 추출
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // 최종 원하는 크기로 캔버스 크기 설정 - 이것은 기존의 컨텍스트를 지움
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 잘라낸 이미지를 왼쪽 상단 모서리에 붙여넣기
  ctx.putImageData(data, 0, 0);

  // blob으로 반환
  return new Promise((resolve, reject) => {
    canvas.toBlob((file: any) => {
        resolve(file);
    }, 'image/jpeg');
  });
}
