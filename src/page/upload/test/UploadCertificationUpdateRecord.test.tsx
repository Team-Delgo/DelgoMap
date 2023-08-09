import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import UploadCertificationUpdateRecord from '../components/UploadCertificationUpdateRecord';  

describe('UploadCertificationUpdateRecord', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <UploadCertificationUpdateRecord />
      </Provider>
    );
  });

  it('shows an error message when content length is less than 15', async () => {
    render(
      <Provider store={store}>
        <UploadCertificationUpdateRecord />
      </Provider>
    );

    const textarea = screen.getByPlaceholderText("🐶 강아지 친구들이 참고할 내용을 적어주면 좋아요");
    fireEvent.change(textarea, { target: { value: 'short content' } });
    const submitButton = screen.getByText("수정완료");
    fireEvent.click(submitButton);


    await waitFor(() => {
      expect(screen.getByText('최소 15자 이상 입력해 주세요')).toBeInTheDocument();
    });
  });


});
