// UploadResultMain.test.tsx

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import UploadResultMain from '../components/UploadCertificationResultMain';

// Redux useSelector를 mock
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('<UploadResultMain />', () => {
  it('renders the component with provided data', () => {
    // Mock data
    const mockData: Partial<RootState['persist']['upload']> = {
      img: 'testImageURL',
      title: 'Test Title',
      content: 'Test Content',
      address: 'Test Address',
      isHideAddress: false,
    };

    (useSelector as jest.Mock).mockReturnValue(mockData);

    const { getByText, getByAltText } = render(<UploadResultMain />);

    expect(getByAltText('caputeImg')).toHaveAttribute('src', mockData.img);
    expect(getByText(mockData.title!)).toBeInTheDocument();
    expect(getByText(mockData.content!)).toBeInTheDocument();
    expect(getByText(mockData.address!)).toBeInTheDocument();
  });

  it('hides the address if isHideAddress is true', () => {
    const mockData: Partial<RootState['persist']['upload']> = {
      address: 'Test Address',
      isHideAddress: true,
    };

    (useSelector as jest.Mock).mockReturnValue(mockData);

    const { queryByText } = render(<UploadResultMain />);

    expect(queryByText(mockData.address!)).toBeNull();
  });
});
