import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UploadImg from '../components/UploadImg';

// Mock redux store
const mockStore = configureStore([]);
const store = mockStore({
  persist: {
    upload: {
      img: 'sample_image',
    },
  },
});

// Mock useNavigate hook from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/test-path' }),
}));

describe('UploadImg', () => {
  it('renders correctly', () => {
    const { getByRole, getByText } = render(
      <Provider store={store}>
        <Router>
          <UploadImg />
        </Router>
      </Provider>
    );

    const prevArrow = getByRole('img', { name: 'capture-page-prev-arrow' });
    const closeIcon = getByRole('img', { name: 'capture-page-x' });

    fireEvent.click(prevArrow);
    fireEvent.click(closeIcon);

    expect(getByText('작성중이던 기록이 삭제됩니다')).toBeInTheDocument();
    expect(getByText('지우면 다시 볼 수 없어요')).toBeInTheDocument();
    expect(getByText('이어서 기록')).toBeInTheDocument();
    expect(getByText('삭제 후 홈으로')).toBeInTheDocument();
  });
});