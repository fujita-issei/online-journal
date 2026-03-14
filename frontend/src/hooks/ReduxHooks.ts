import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store"

// 毎回型をインポートするのは面倒なので、カスタムフックを作成する
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
    selector: (state: RootState) => TSelected
): TSelected => useSelector<RootState, TSelected>(selector)