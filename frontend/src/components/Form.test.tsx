import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Form from './Form';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));


describe("Formのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.post).mockResolvedValue({ data: "success" })
    })

    it("入力欄に入力 => 送信ボタン => postメソッド => navigate", async () => {
        render(<Form/>)
        fireEvent.change(screen.getByTestId("text-input"), { target: { value: "〇〇でバグが発生しています"}})
        fireEvent.change(screen.getByTestId("email-input"), { target: { value: "aiueo@gmail.com"}})
        fireEvent.click(screen.getByTestId("button"))
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/form/save", {
                userId: "testUser",
                content: "〇〇でバグが発生しています",
                email: "aiueo@gmail.com"
            })
            expect(mockNavigate).toHaveBeenCalledWith("/")
        })
    })

})