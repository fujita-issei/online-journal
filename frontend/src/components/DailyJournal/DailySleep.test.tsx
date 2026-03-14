import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DailySleep from './DailySleep';
import * as ReduxHooks from '../../hooks/ReduxHooks';
import * as CalcDays from '../../func/calcDays';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../func/calcDays');

describe('DailySleepコンポーネントのテスト', () => {
    
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                login: { userId: 'testUser' },
                color: { color: 'blue' },
                dailyJournal: { 
                    targetDate: '2026-03-03',
                    getUpHour: 7, 
                    getUpMin: 30, 
                    goBedHour: 23, 
                    goBedMin: 0 
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        vi.spyOn(CalcDays, 'default').mockReturnValue('2026-03-02');
    });

    it('「すいみん」というタイトルが表示されること', () => {
        (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        render(<DailySleep />);
        expect(screen.getByText('すいみん')).toBeInTheDocument();
    });

    it('昨日の睡眠時間をAPIで取得し、合計睡眠時間が正しく計算されること', async () => {
        (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ goBedHour: 23, goBedMin: 0 }]
        })
        render(<DailySleep />);
        await waitFor(() => {
            expect(screen.getByText('8時間 30分')).toBeInTheDocument();
        })
        expect(axios.get).toHaveBeenCalledWith("/api/dailyJournal/getYestardaySleepTime", {
            params: {
                userId: 'testUser',
                targetDate: '2026-03-02'
            }
        })
    })

    it('入力欄の値を変更した時、正しいアクションがDispatchされること', () => {
        (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
        render(<DailySleep />);
        const inputs = screen.getAllByRole('textbox')
        fireEvent.change(inputs[0], { target: { value: '8' } });
        expect(mockDispatch).toHaveBeenCalled();
    });

    it ("入力欄の値を変更した時、とってきた昨日の睡眠時間から、合計睡眠時間が正しく計算すること", async () => {
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                login: { userId: 'testUser' },
                color: { color: 'blue' },
                dailyJournal: { 
                    targetDate: '2026-03-03',
                    getUpHour: 8,
                    getUpMin: 40,
                    goBedHour: 23, 
                    goBedMin: 0 
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [{ goBedHour: 23, goBedMin: 0 }]
        })
        render(<DailySleep />)
        await waitFor(() => {
            expect(screen.getByText('9時間 40分')).toBeInTheDocument()
        })
    })
});