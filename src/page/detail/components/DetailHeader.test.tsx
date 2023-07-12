import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailHeader from './DetailHeader';

const mockProps = {
  placeName: 'Test Place',
  address: '123 Test Street',
  dogFootCount: 5,
  heartCount: 10,
  phoneNumber: '123-456-7890',
  openingHours: {
    MON: '09:00~18:00',
    TUE: '09:00~18:00',
    WED: '09:00~18:00',
    THU: '09:00~18:00',
    FRI: '09:00~18:00',
    SAT: '09:00~18:00',
    SUN: 'Closed',
    LAST_ORDER: '17:00',
    HOLIDAY: '둘째, 넷째 일요일',
    BREAK_TIME: '평일 15:00~16:00',
  },
};

describe('DetailHeader Component', () => {
  it('renders without crashing', () => {
    render(<DetailHeader {...mockProps} />);
  });

  it('renders correct data when props are provided', () => {
    const { getByText } = render(<DetailHeader {...mockProps} />);
    expect(getByText(mockProps.placeName)).toBeInTheDocument();
    expect(getByText(mockProps.address)).toBeInTheDocument();
    expect(getByText(String(mockProps.dogFootCount))).toBeInTheDocument();
    expect(getByText(String(mockProps.heartCount))).toBeInTheDocument();
  });

  it("displays additional information when '영업시간' button is clicked", () => {
    const { getByText, queryByText } = render(<DetailHeader {...mockProps} />);
    const button = getByText('영업시간');
    expect(queryByText('월')).toBeNull();
    expect(queryByText('닫기')).toBeNull(); // Ensure close button isn't there initially

    fireEvent.click(button); // Click the button
    expect(queryByText('월')?.textContent).toBe(`월 ${mockProps.openingHours.MON}`);
    expect(queryByText('라스트 오더')?.nextSibling?.textContent).toBe(
      mockProps.openingHours.LAST_ORDER,
    );
    expect(queryByText('브레이크 타임')?.nextSibling?.textContent).toBe(
      mockProps.openingHours.BREAK_TIME,
    );
    expect(queryByText('휴무')?.nextSibling?.textContent).toBe(
      mockProps.openingHours.HOLIDAY,
    );
    expect(queryByText('닫기')).toBeInTheDocument(); // Ensure close button appears after click
  });
});
