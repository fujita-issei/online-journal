import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Setting from './Setting';
import * as ReduxHooks from '../hooks/ReduxHooks';
import { googleLogout } from '@react-oauth/google'

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));
vi.mock('@react-oauth/google', () => ({
    googleLogout: vi.fn()
}));

describe("Settingのテスト", () => {

    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        window.scrollTo = vi.fn();
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                color: { color: 'blue' },
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        vi.spyOn(Storage.prototype, 'clear');
        vi.spyOn(Storage.prototype, 'setItem');
    })

    it("色変更 => dispatchが呼ばれる", () => {
        render(<Setting/>)
        fireEvent.click(screen.getByTestId("input-whiteBlack"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "color/changeColor",
                payload: "whiteBlack"
            })
        )
        fireEvent.click(screen.getByTestId("input-pink"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "color/changeColor",
                payload: "pink"
            })
        )
    })

    it("ログアウトボタン => googleLogout, dispatch, localStorage, navigateがそれぞれ呼ばれる", () => {
        render(<Setting/>)
        fireEvent.click(screen.getByRole("button", { name: "ログアウト"}))
        expect(googleLogout).toHaveBeenCalled()
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "login/setUserId",
                payload: ""
            })
        )
        expect(localStorage.clear).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith("/")
    })

})