import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoutineList from './RoutineList';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('../../hooks/ReduxHooks')

describe("RoutineListのテスト", () => {
    const mockDispatch = vi.fn()
    const mockRoutineData = {
        routineName: "タスク1",
        routineTime: 10,
        i: 0
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: { color: "blue"},
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })

        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
    })

    it("一連の動作を検証して、ちゃんとdispatchが呼ばれるか", () => {
        render(<RoutineList routineName = {mockRoutineData.routineName} routineTime={mockRoutineData.routineTime} i={0} />)
        fireEvent.change(screen.getByTestId("input-name"), { target: { value: "タスク2" }})
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/changeRoutine",
                payload: expect.objectContaining({ text: "タスク2", i: 0 })
            })
        )
        fireEvent.click(screen.getByTestId("delete-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/deleteRoutine",
                payload: 0
            })
        )
    })

})