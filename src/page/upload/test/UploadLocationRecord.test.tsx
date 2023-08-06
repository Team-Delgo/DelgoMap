import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import store from '../../../redux/store';
import UploadLocationRecord from '../components/UploadLocationRecord';
import { QueryClientProvider, QueryClient } from 'react-query';

// 가짜 스토어 생성
// const store = createStore(rootReducer);

// 가짜 QueryCache 생성
const queryClient = new QueryClient();

describe('UploadLocationRecord', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UploadLocationRecord />
        </QueryClientProvider>
      </Provider>,
    );
  });

  it('updates place name on input change', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <UploadLocationRecord />
        </QueryClientProvider>
      </Provider>
    );
    
    const input = getByPlaceholderText("여기는 어디인가요? (ex.델고카페, 동네 산책로)") as HTMLInputElement;
    fireEvent.change(input, { target: { value: '델고카페' } });
    
    expect(input.value).toBe('델고카페');
  });


});
