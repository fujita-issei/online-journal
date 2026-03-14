import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import YearTodo from './YearTodo';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('../../hooks/ReduxHooks');

describe("YearToDoのテスト", () => {

    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                color: { color: 'blue' },
                yearJournal: { 
                    toDo: ["フロントエンドを終わらせる", "衣替えをする"],
                    toDoCheck: [true, false],
                    toDoImportant: [2, 0]
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    });

    it("ToDoを書いたり、重要度を変えたり、チェックボックスを押したら、それぞれのdispatchが呼ばれる", () => {
        render(<YearTodo/>)
        // フロントエンドを終わらせるがあるか確認
        expect(screen.getByText("フロントエンドを終わらせる")).toBeInTheDocument()
        // 入力欄を変更
        fireEvent.change(screen.getByTestId("input-0"), { target: { value: "フロントエンドとテストを終わらせる" }})
        // changeWeekToDoが呼ばれる
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "yearJournal/changeYearToDo",
                payload: expect.objectContaining({ text: "フロントエンドとテストを終わらせる", i: 0 })
            })
        )
        // 重要度を変更する
        fireEvent.click(screen.getByTestId("important1-0"))
        // changeWeekToDoImportantが呼ばれるか確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "yearJournal/changeYearToDoImportant",
                payload: expect.objectContaining({ value: 1, i: 0 })
            })
        )
        // 現在のチェックボックスがtrueであることを確認
        expect(screen.getByTestId("checkbox-0")).toBeChecked()
        // チェックボックスをクリック
        fireEvent.click(screen.getByTestId("checkbox-0"))
        // toggleWeekToDoCheckが呼ばれるかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "yearJournal/toggleYearToDoCheck",
                payload: 0
            })
        )
    })

    it("ToDoの削除ボタンを押したら、消えるdispatchが呼ばれる", () => {
        render(<YearTodo/>)
        // 衣替えをするがあるかを確認
        expect(screen.getByText("衣替えをする")).toBeInTheDocument()
        // 削除ボタンを押す
        fireEvent.click(screen.getByTestId("delete-button-1"))
        // deleteWeekToDoが呼ばれるかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "yearJournal/deleteYearToDo",
                payload: 1
            })
        )
    })

})