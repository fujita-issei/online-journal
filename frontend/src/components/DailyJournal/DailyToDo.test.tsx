import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as ReduxHooks from '../../hooks/ReduxHooks';
import DailyToDo from './DailyToDo';

vi.mock("../../hooks/ReduxHooks")

describe("DailyToDoのテスト", () => {

    const mockDispatch = vi.fn()
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: {
                    color: "blue"
                },
                dailyJournal: {
                    toDoTimeHour: "0",
                    toDoTimeMin: "0",
                    startToDoHour: "0",
                    startToDoMin: "0",
                    endToDoHour: "0",
                    endToDoMin: "0",
                    toDoTimeCheck: Array(40).fill(false),
                    toDoList: ["掃除", "勉強"],
                    toDoListCheck: [false, true],
                    toDoListImportant: [0, 2]
                }
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState)
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch)
    })
    
    it("ルーティーンの入力内容の変更 => dispatchが呼ばれる", () => {
        render(<DailyToDo/>)
        // 入力欄が現在のものが正しいか確認
        expect(screen.getByDisplayValue("掃除")).toBeInTheDocument()
        // 掃除を読書に書き換える
        fireEvent.change(screen.getByTestId("input-text-0"), { target: { value: "読書"}})
        // dispatchがちゃんと呼ばれたかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/changeToDo",
                payload: expect.objectContaining({ text: "読書", i : 0 })
            })
        )
    })

    it("ルーティーンの削除 => dispatchが呼ばれる", () => {
        render(<DailyToDo/>)
        // 入力欄が現在のものが正しいか確認
        expect(screen.getByDisplayValue("掃除")).toBeInTheDocument()
        // 削除ボタンをクリック
        fireEvent.click(screen.getByTestId("delete-routine-0"))
        // deleteToDoListが正しい引数で呼ばれたかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/deleteToDoList",
                payload: 0
            })
        )
    })
})