import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';

export interface SleepData {
    targetDate: string;
    getUpHour: number;
    getUpMin: number;
    goBedHour: number;
    goBedMin: number;
}

interface Props {
    data: SleepData[]
}

const SleepGraph = ({ data }: Props) => {

    const selectedColor = useAppSelector((state) => state.color.color)

    // 1. データをグラフ用に整形する（日付の古い順に並び替え＆時間を数値化）
    const formattedData = [...data].reverse().map((item) => {
        const dateStr = new Date(item.targetDate);
        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}`;
        let bedDecimal = item.goBedHour + (item.goBedMin / 60);
        if (item.goBedHour < 12) bedDecimal += 24;
        let wakeDecimal = item.getUpHour + (item.getUpMin / 60);
        if (item.getUpHour < 18) wakeDecimal += 24;

        return {
            date: displayDate,
            bedTime: bedDecimal,
            wakeTime: wakeDecimal,
        };
    });

    const formatTime = (decimalTime: number) => {
        const h = Math.floor(decimalTime) % 24;
        const m = Math.round((decimalTime % 1) * 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const mainColor = selectedColor === "pink" ? "#f472b6" : selectedColor === "blue" ? "#38bdf8" : "#9ca3af";

    return (
        <div className="w-full h-80 mt-4 text-sm">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <LineChart data={formattedData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={formatTime} 
                        tick={{ fill: '#6b7280' }} 
                        reversed={true} // 上を「早い時間」、下を「遅い時間」にする
                    />
                    <Tooltip 
                        formatter={(value: number | undefined) => [value !== undefined ? formatTime(value) : "", ""]}
                        labelStyle={{ color: '#374151' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                    <Line 
                        type="monotone" 
                        dataKey="bedTime" 
                        name="就寝時間" 
                        stroke="#818cf8" 
                        strokeWidth={3} 
                        activeDot={{ r: 6 }} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="wakeTime" 
                        name="起床時間" 
                        stroke={mainColor} 
                        strokeWidth={3} 
                        activeDot={{ r: 6 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SleepGraph