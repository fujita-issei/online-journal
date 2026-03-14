import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SelectCreateJournal from './SelectCreateJournal';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));
vi.mock("../constant/menuURL", () => ({
    default: [
        { menu: "ホーム", url : "/"},
        { menu: "ジャーナルを作成", url : "/createJournal" },
        { menu: "ルーティーンを作成", url : "/createRoutine" },
        { menu: "禁止リストを作成", url : "/createNGList"},
        { menu: "過去のジャーナルを見る", url: "/watchPastJournal"},
        { menu: "サマリーを見る", url : "/watchSummary"},
        { menu: "プロフィール", url : "/profile"},
        { menu: "投稿", url: "/post"},
        { menu: "検索", url: "/search"},
        { menu: "通知", url: "/notice"},
        { menu: "フレンドリスト", url : "/friendsList"},
        { menu: "メッセージ", url : "/message"},    
        { menu: "保存した投稿", url : "/saved"},
        { menu: "設定", url: "/setting"},
        { menu: "使い方ガイド", url : "/guide"},
        { menu: "お問い合わせフォーム", url : "/form"}
    ]
}))

describe("SelectCreateJournalのテスト", () => {

    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Storage.prototype, "setItem")
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                color: { color: 'blue' },
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    });

    it("ジャーナルを作成を押す => localStorage, dispatch, navigateが走る", async () => {
        render(<SelectCreateJournal/>)
        fireEvent.click(screen.getByTestId("journal-button"))
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "ジャーナルを作成")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "ジャーナルを作成"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal")
        })
    })

    it("ルーティーンを作成を押す => localStorage, dispatch, navigateが走る", async () => {
        render(<SelectCreateJournal/>)
        fireEvent.click(screen.getByTestId("routine-button"))
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "ルーティーンを作成")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "ルーティーンを作成"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createRoutine")
        })
    })

    it("禁止リストを作成を押す => localStorage, dispatch, navigateが走る", async () => {
        render(<SelectCreateJournal/>)
        fireEvent.click(screen.getByTestId("NGList-button"))
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "禁止リストを作成")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "禁止リストを作成"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createNGList")
        })
    })
})