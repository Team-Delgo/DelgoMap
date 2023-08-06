import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../../redux/store';
import UploadCertificationImg from '../components/UploadCertificationImg';

const mockOpenBottomSheet = jest.fn();

describe('UploadCertificationImg', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UploadCertificationImg openBottomSheet={mockOpenBottomSheet} />
        </MemoryRouter>
      </Provider>,
    );
  });

  it('renders without crashing', () => {
    expect(screen.getByText('사진 추가')).toBeInTheDocument();
  });

  it("calls openBottomSheet when 'x' icon is clicked", () => {
    fireEvent.click(screen.getByAltText('capture-page-x'));
    expect(mockOpenBottomSheet).toHaveBeenCalled();
  });
});
