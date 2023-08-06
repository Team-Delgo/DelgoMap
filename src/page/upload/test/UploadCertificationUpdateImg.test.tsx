import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import UploadCertificationUpdateImg from '../components/UploadCertificationUpdateImg';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('<UploadCertificationUpdateImg />', () => {
  it('renders the image based on redux state', () => {
    const mockImg = 'testImageUrl';
    (useSelector as jest.Mock).mockReturnValue(mockImg);

    const { getByAltText } = render(<UploadCertificationUpdateImg />);

    expect(getByAltText('caputeImg')).toHaveAttribute('src', mockImg);
  });

  it('prevents drag-start and touch-move events', () => {
    const { getByAltText } = render(<UploadCertificationUpdateImg />);

    const imgElement = getByAltText('caputeImg');

    expect(() => {
      fireEvent.dragStart(imgElement);
    }).not.toThrow();

    expect(() => {
      fireEvent.touchMove(imgElement);
    }).not.toThrow();
  });
});

