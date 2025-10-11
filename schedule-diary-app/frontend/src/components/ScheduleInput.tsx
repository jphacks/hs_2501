import React, { useState } from 'react';
import { ScheduleItem } from '../types';

interface ScheduleInputProps {
  onGenerate: (schedule: ScheduleItem[]) => void;
}

const ScheduleInput: React.FC<ScheduleInputProps> = ({ onGenerate }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [newItem, setNewItem] = useState<ScheduleItem>({ time: '', activity: '' });

  const addScheduleItem = () => {
    if (newItem.time && newItem.activity.trim()) {
      setSchedule([...schedule, newItem]);
      setNewItem({ time: '', activity: '' });
    }
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addScheduleItem();
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">今日のスケジュール</h2>
      
      {/* 入力フォーム */}
      <div className="flex gap-4 mb-6">
        <input
          type="time"
          value={newItem.time}
          onChange={(e) => setNewItem({...newItem, time: e.target.value})}
          className="input-field"
          placeholder="時間"
        />
        <input
          type="text"
          placeholder="活動を入力してください"
          value={newItem.activity}
          onChange={(e) => setNewItem({...newItem, activity: e.target.value})}
          onKeyPress={handleKeyPress}
          className="flex-1 input-field"
        />
        <button
          onClick={addScheduleItem}
          className="btn-primary whitespace-nowrap"
        >
          追加
        </button>
      </div>

      {/* スケジュール一覧 */}
      <div className="space-y-3 mb-6">
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">スケジュールを追加してください</p>
            <p className="text-sm mt-1">時間と活動を入力して「追加」ボタンを押してください</p>
          </div>
        ) : (
          schedule.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-full text-sm">
                  {item.time}
                </span>
                <span className="text-gray-800">{item.activity}</span>
              </div>
              <button
                onClick={() => removeScheduleItem(index)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                title="削除"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {schedule.length > 0 && (
        <button
          onClick={() => onGenerate(schedule)}
          className="w-full btn-primary text-lg py-3 flex items-center justify-center gap-2"
        >
          <span>✨</span>
          絵日記を生成する
          <span>✨</span>
        </button>
      )}
    </div>
  );
};

export default ScheduleInput;

