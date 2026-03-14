import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';

interface Props {
    chartData: {
        date: string;
        rate: number;
    }[]
}

const ListGraphDaily = ({ chartData }: Props) => {
    
    const selectedColor = useAppSelector((state) => state.color.color)
    let mainColor = "#f472b6"; // デフォルト（pink）
    if (selectedColor === "blue") mainColor = "#0ea5e9";
    if (selectedColor === "whiteBlack") mainColor = "#4b5563";

    return (
        <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={chartData} 
                    margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                >
                    {/* 横向きの補助線だけ残す */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    {/* X軸（日付） */}
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickMargin={10}
                    />
                    
                    {/* Y軸（達成率 0〜100%） */}
                    <YAxis 
                        domain={[0, 100]} 
                        tickFormatter={(value) => `${value}%`} 
                        tick={{ fill: '#6b7280' }}
                    />
                    
                    {/* ホバー時の吹き出し */}
                    <Tooltip 
                        formatter={(value: number | undefined) => [`${value}%`, "達成率"]} 
                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    />
                    
                    {/* メインの折れ線（達成率の推移） */}
                    <Line 
                        type="monotone" // なめらかな曲線にする設定
                        dataKey="rate" 
                        name="達成率" 
                        stroke={mainColor} // テーマカラーを適用
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} // データポイントの丸の大きさ
                        activeDot={{ r: 6 }} // ホバー時に丸を少し大きくする
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ListGraphDaily