import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyJournal from './DailyJournal';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');

describe("DailyJournalのテスト", () => {

    const mockDispatch = vi.fn();
        
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: { color: "blue"},
                dailyJournal: {
                    journal: ["aiueo", "abcde"],
                    journalCount: [5, 5],
                    journalLastEditTime: ["2026 / 03 / 04 / 15 : 13", "2026 / 03 / 04 / 15 : 15"]
                }
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため.
            return selector(mockState)
        })
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch)
    })

    it("ジャーナルを書いたら、changeJournalがちゃんと呼ばれるかを確認", () => {
        render(<DailyJournal/>)
        // 初期値のaiueoが入っているかを確認
        expect(screen.getByTestId("journal-textarea-0")).toHaveValue("aiueo")
        // ジャーナルに文字を追加
        fireEvent.change(screen.getByTestId("journal-textarea-0"), { target: { value: "aiueokakikukeko" } })
        // dispatchが呼ばれているかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/changeJournal",
                payload: expect.objectContaining({ text: "aiueokakikukeko", i: 0 })
            })
        )
    })

    it("ゴミ箱ボタンを押す => 対象のジャーナルが消えるdispatchが呼ばれる", () => {
        render(<DailyJournal/>)
        // 初期値のaiueoが入っているかを確認
        expect(screen.getByTestId("journal-textarea-0")).toHaveValue("aiueo")
        // 削除ボタンを押す
        fireEvent.click(screen.getByTestId("journal-delete-0"))
        // dispatchが呼ばれているかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/deleteJournal",
                payload: 0
            })
        )
    })

})
