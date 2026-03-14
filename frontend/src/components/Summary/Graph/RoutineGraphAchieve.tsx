import { useAppSelector } from "../../../hooks/ReduxHooks"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    chartData: {
        name: string;
        rate: number;
    }[]
}

const RoutineGraphAchieve = ({chartData} : Props) => {

    const selectedColor = useAppSelector((state) => state.color.color)
    const mainColor = selectedColor === "pink" ? "#f472b6" : selectedColor === "blue" ? "#38bdf8" : "#9ca3af";

    return (
        <div className="w-full h-72 mt-6">
                <ResponsiveContainer width="99%" height="99%" minWidth={1} minHeight={1}>
                    <BarChart 
                        data={chartData} 
                        margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                    >
                        {/* 横向きの補助線だけ残してスッキリさせる */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#6b7280', fontSize: 12 }} 
                            tickMargin={10}
                        />
                        
                        <YAxis 
                            domain={[0, 100]} // 👈 パーセンテージなので0〜100に固定！
                            tickFormatter={(value) => `${value}%`} // 👈 メモリに「%」をつける
                            tick={{ fill: '#6b7280' }}
                        />
                        
                        {/* ツールチップ（ホバー時の吹き出し）のカスタマイズ */}
                        <Tooltip 
                            formatter={(value: number | undefined) => [`${value}%`, "達成率"]} 
                            // 👇 文字色も mainColor に合わせるとオシャレ！
                            labelStyle={{ color: mainColor, fontWeight: 'bold' }} 
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        
                        {/* メインの棒グラフ */}
                        <Bar 
                            dataKey="rate" 
                            name="達成率" 
                            fill={mainColor} 
                            radius={[4, 4, 0, 0]} // 👈 棒の上側の角だけを少し丸くするオシャレ設定！
                            barSize={40} // 棒の太さを固定したい場合は指定
                        />
                    </BarChart>
                </ResponsiveContainer>
        </div>
    )
}

export default RoutineGraphAchieve