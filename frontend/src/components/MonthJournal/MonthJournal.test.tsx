import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MonthJournal from './MonthJournal';
import * as ReduxHooks from '../../hooks/ReduxHooks';

describe("MonthJournalのテスト", () => {

    const mockDispatch = vi.fn();
        
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: { color: "blue"},
                monthJournal: {
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

    it("ジャーナルを書いたら、changeMonthJournalがちゃんと呼ばれるかを確認", () => {
        render(<MonthJournal/>)
        // 初期値のaiueoが入っているかを確認
        expect(screen.getByTestId("journal-textarea-0")).toHaveValue("aiueo")
        // ジャーナルに文字を追加
        fireEvent.change(screen.getByTestId("journal-textarea-0"), { target: { value: "aiueokakikukeko" } })
        // dispatchが呼ばれているかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "monthJournal/changeMonthJournal",
                payload: expect.objectContaining({ text: "aiueokakikukeko", i: 0 })
            })
        )
    })

    it("ゴミ箱ボタンを押す => 対象のジャーナルが消えるdispatchが呼ばれる", () => {
        render(<MonthJournal/>)
        // 初期値のaiueoが入っているかを確認
        expect(screen.getByTestId("journal-textarea-0")).toHaveValue("aiueo")
        // 削除ボタンを押す
        fireEvent.click(screen.getByTestId("journal-delete-0"))
        // dispatchが呼ばれているかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "monthJournal/deleteMonthJournal",
                payload: 0
            })
        )
    })

})
