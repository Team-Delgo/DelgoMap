import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailInfo from './DetailInfo';

describe('DetailInfo Component with ResidentDog', () => {
  const mockProps = {
    residentDog: "푸들",
    residentDogPhoto: "url/to/image",
    instagram: "@poodle",
    representMenu: "Dog Biscuit",
    menuImages: ["url/to/image1", "url/to/image2", "url/to/image3"],
    enterDsc: "Entrance Description",
    acceptSize: { S: "ACCEPT", M: "OUTDOOR", L: "DENY" },
    isParking: true,
    parkingInfo: "Available",
    editorNoteUrl: "url/to/editor",
    openEditor: jest.fn(),
    openFullSlider: jest.fn()
  }

  test('should render resident dog information correctly', () => {
    const { getByText } = render(<DetailInfo {...mockProps} />);
    expect(getByText('상주견')).toBeInTheDocument();
    expect(getByText('푸들')).toBeInTheDocument();
    expect(getByText('@poodle')).toBeInTheDocument();
  });

  test('should render representative menu correctly', () => {
    const { getByText } = render(<DetailInfo {...mockProps} />);
    expect(getByText('강아지 대표 메뉴')).toBeInTheDocument();
    expect(getByText('Dog Biscuit')).toBeInTheDocument();
  });

  test('should handle click on the "more details" button', () => {
    const { getByText } = render(<DetailInfo {...mockProps} />);
    fireEvent.click(getByText('자세히 보기'));
    expect(getByText('Entrance Description')).toBeInTheDocument();
  });

});

// describe('DetailInfo Component without ResidentDog', () => {
//   const mockProps = {
//     residentDog: "푸들",
//     residentDogPhoto: "url/to/image",
//     instagram: "@poodle",
//     representMenu: "Dog Biscuit",
//     menuImages: ["url/to/image1", "url/to/image2", "url/to/image3"],
//     enterDsc: "Entrance Description",
//     acceptSize: { S: "O", M: "O", L: "X" },
//     parkingLimit: 3,
//     parkingInfo: "Available",
//     editorNoteUrl: "url/to/editor",
//     openEditor: jest.fn(),
//     openFullSlider: jest.fn()
//   }

// });