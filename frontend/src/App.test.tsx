import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import * as ReduxHooks from './hooks/ReduxHooks';

vi.mock('axios');
vi.mock('./hooks/ReduxHooks');
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }: { onSuccess: (res: { credential: string }) => void }) => (
        <button 
            data-testid="mock-google-login" 
            onClick={() => onSuccess({ credential: "dummy-token" })}
        >
            Googleでログイン
        </button>
    )
}));

describe("Appコンポーネントのテスト", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Storage.prototype, 'setItem');

        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                login: { userId: "" },
                color: { color: "blue" },
                Menu: { isClickedMenu: false }
            };
            // @ts-expect-error: テスト用
            return selector(mockState);
        });

        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    });

    it("Googleログインボタンを押す => ログイン処理が走る => dispatchとlocalStorageがそれぞれ実行", async () => {
        vi.mocked(axios.post).mockResolvedValue({
            data: {
                user: { google_id: "test-google-id" }
            }
        })
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        const loginButtons = screen.getAllByTestId("mock-google-login");
        fireEvent.click(loginButtons[0]);
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/auth/google", {
                token: "dummy-token"
            });
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "login/setUserId",
                    payload: "test-google-id"
                })
            );
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "color/changeColor",
                    payload: "blue"
                })
            );
            expect(localStorage.setItem).toHaveBeenCalledWith("color", "blue");
            expect(localStorage.setItem).toHaveBeenCalledWith("userId", "test-google-id");
        });
    });
});