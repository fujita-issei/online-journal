import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';

interface Props {
    graphData: {
        targetDate: string;
        journalCount: number; // reduceで計算した合計文字数
    }[]
}

const JournalCountGraph = ({ graphData }: Props) => {
    
    // テーマカラーを取得
    const selectedColor = useAppSelector((state) => state.color.color);

    // 1. グラフ用にデータを整形（反復エラー防止＆過去→現在へ並び替え＆日付フォーマット）
    const chartData = [...(Array.isArray(graphData) ? graphData : [])].reverse().map((data) => {
        const dateStr = new Date(data.targetDate);
        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}`; // 例: "2/28"

        return {
            date: displayDate,
            count: data.journalCount // Y軸用のデータ（文字数）
        }
    });

    // 2. テーマカラーの決定
    let mainColor = "#f472b6"; // デフォルト（pink）
    if (selectedColor === "blue") mainColor = "#0ea5e9";
    if (selectedColor === "whiteBlack") mainColor = "#4b5563";

    return (
        <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={chartData} 
                    // 文字数が多い（1000文字など）場合に左側が見切れないよう、leftを少し広めに設定（20〜30）
                    margin={{ top: 20, right: 20, left: -20, bottom: 5 }} 
                >
                    {/* 横の補助線 */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    {/* X軸（日付） */}
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickMargin={10}
                    />
                    
                    {/* Y軸（文字数） */}
                    <YAxis 
                        tick={{ fill: '#6b7280' }}
                        // 👈 「最大値が0の時は、とりあえず目盛りを100まで作る」という安全装置をつける！
                        domain={[0, (dataMax: number) => (dataMax === 0 ? 100 : dataMax)]} 
                    />
                    
                    {/* ツールチップ（ホバー時の吹き出し） */}
                    <Tooltip 
                        formatter={(value: number | undefined) => [`${value} 文字`, "書いた文字数"]} 
                        labelStyle={{ color: mainColor, fontWeight: 'bold' }} // 文字色をテーマに合わせる
                        cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} // ホバー時の縦線を少し強調
                    />
                    
                    {/* 折れ線グラフの線 */}
                    <Line 
                        type="monotone" // なめらかな曲線
                        dataKey="count" 
                        name="文字数" 
                        stroke={mainColor} 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} // 丸の大きさ
                        activeDot={{ r: 6 }} // ホバー時に丸を大きく
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default JournalCountGraph;