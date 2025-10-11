import React, { useState } from 'react';
import { MonthlySummary, YearlySummary } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface SummaryProps {
  currentDate: Date;
  monthlySummary: MonthlySummary;
  yearlySummary: YearlySummary;
}

const Summary: React.FC<SummaryProps> = ({ currentDate, monthlySummary, yearlySummary }) => {
  const [showYearlyDetails, setShowYearlyDetails] = useState(false);

  return (
    <div className="space-y-6">
      {/* 月次サマリー */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📊 今月の集計
          <span className="text-lg font-normal text-gray-500">
            ({format(currentDate, 'yyyy年M月', { locale: ja })})
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-sm text-blue-700 font-semibold mb-1">勤務日数</div>
            <div className="text-3xl font-bold text-blue-900">{monthlySummary.workDays}</div>
            <div className="text-xs text-blue-600 mt-1">日</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-sm text-purple-700 font-semibold mb-1">勤務時間</div>
            <div className="text-3xl font-bold text-purple-900">{monthlySummary.totalHours}</div>
            <div className="text-xs text-purple-600 mt-1">時間</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-sm text-green-700 font-semibold mb-1">今月の給料</div>
            <div className="text-3xl font-bold text-green-900">
              ¥{monthlySummary.totalWage.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-1">円</div>
          </div>
        </div>
      </div>

      {/* 年次サマリー */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📈 年間集計
          <span className="text-lg font-normal text-gray-500">
            ({yearlySummary.year}年)
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
            <div className="text-sm text-indigo-700 font-semibold mb-1">年間勤務日数</div>
            <div className="text-3xl font-bold text-indigo-900">{yearlySummary.workDays}</div>
            <div className="text-xs text-indigo-600 mt-1">日</div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-sm text-pink-700 font-semibold mb-1">年間勤務時間</div>
            <div className="text-3xl font-bold text-pink-900">{yearlySummary.totalHours}</div>
            <div className="text-xs text-pink-600 mt-1">時間</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="text-sm text-yellow-700 font-semibold mb-1">年間給料</div>
            <div className="text-3xl font-bold text-yellow-900">
              ¥{yearlySummary.totalWage.toLocaleString()}
            </div>
            <div className="text-xs text-yellow-600 mt-1">円</div>
          </div>
        </div>

        {/* 月別詳細ボタン */}
        <button
          onClick={() => setShowYearlyDetails(!showYearlyDetails)}
          className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all font-semibold flex items-center justify-center gap-2"
        >
          {showYearlyDetails ? '▲ 月別詳細を閉じる' : '▼ 月別詳細を見る'}
        </button>

        {/* 月別詳細 */}
        {showYearlyDetails && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 px-2 py-1">
              <div>月</div>
              <div className="text-right">勤務日数</div>
              <div className="text-right">勤務時間</div>
              <div className="text-right">給料</div>
            </div>
            {yearlySummary.monthlyData
              .sort((a, b) => a.month - b.month)
              .map((monthly) => (
                <div
                  key={monthly.month}
                  className="grid grid-cols-4 gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-semibold text-gray-700">{monthly.month}月</div>
                  <div className="text-right text-gray-600">{monthly.workDays}日</div>
                  <div className="text-right text-gray-600">{monthly.totalHours}h</div>
                  <div className="text-right font-semibold text-gray-800">
                    ¥{monthly.totalWage.toLocaleString()}
                  </div>
                </div>
              ))}
            
            {yearlySummary.monthlyData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>まだ勤務データがありません</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 統計情報 */}
      {yearlySummary.workDays > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📌 統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">月平均勤務日数</div>
              <div className="text-xl font-bold text-gray-800">
                {(yearlySummary.workDays / 12).toFixed(1)}日
              </div>
            </div>
            <div>
              <div className="text-gray-600">月平均給料</div>
              <div className="text-xl font-bold text-gray-800">
                ¥{Math.round(yearlySummary.totalWage / 12).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">平均時給</div>
              <div className="text-xl font-bold text-gray-800">
                ¥{yearlySummary.totalHours > 0 ? Math.round(yearlySummary.totalWage / yearlySummary.totalHours).toLocaleString() : 0}
              </div>
            </div>
            <div>
              <div className="text-gray-600">平均日給</div>
              <div className="text-xl font-bold text-gray-800">
                ¥{yearlySummary.workDays > 0 ? Math.round(yearlySummary.totalWage / yearlySummary.workDays).toLocaleString() : 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;

