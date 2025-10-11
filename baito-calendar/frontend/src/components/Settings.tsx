import React, { useState } from 'react';
import { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ 設定</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            編集
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 支払いタイプ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            給料タイプ
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="hourly"
                checked={localSettings.paymentType === 'hourly'}
                onChange={(e) => setLocalSettings({ ...localSettings, paymentType: e.target.value as 'hourly' | 'daily' })}
                disabled={!isEditing}
                className="w-4 h-4"
              />
              <span className="text-gray-700">時給制</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="daily"
                checked={localSettings.paymentType === 'daily'}
                onChange={(e) => setLocalSettings({ ...localSettings, paymentType: e.target.value as 'hourly' | 'daily' })}
                disabled={!isEditing}
                className="w-4 h-4"
              />
              <span className="text-gray-700">日給制</span>
            </label>
          </div>
        </div>

        {/* 時給 */}
        {localSettings.paymentType === 'hourly' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              時給（円）
            </label>
            <input
              type="number"
              value={localSettings.hourlyWage || 0}
              onChange={(e) => setLocalSettings({ ...localSettings, hourlyWage: Number(e.target.value) })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              min="0"
              step="10"
            />
          </div>
        )}

        {/* 日給 */}
        {localSettings.paymentType === 'daily' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              日給（円）
            </label>
            <input
              type="number"
              value={localSettings.dailyWage || 0}
              onChange={(e) => setLocalSettings({ ...localSettings, dailyWage: Number(e.target.value) })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              min="0"
              step="100"
            />
          </div>
        )}

        {/* デフォルト勤務時間 */}
        {localSettings.paymentType === 'hourly' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              1日の勤務時間（時間）
            </label>
            <input
              type="number"
              value={localSettings.defaultHours}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultHours: Number(e.target.value) })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              min="0"
              max="24"
              step="0.5"
            />
          </div>
        )}

        {/* 保存・キャンセルボタン */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
          </div>
        )}

        {/* 現在の設定表示 */}
        {!isEditing && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {localSettings.paymentType === 'hourly' ? (
                  <>
                    <span className="font-semibold">時給:</span> ¥{localSettings.hourlyWage?.toLocaleString()}
                    <span className="mx-2">|</span>
                    <span className="font-semibold">1日:</span> {localSettings.defaultHours}時間
                    <span className="mx-2">|</span>
                    <span className="font-semibold">日当:</span> ¥{((localSettings.hourlyWage || 0) * localSettings.defaultHours).toLocaleString()}
                  </>
                ) : (
                  <>
                    <span className="font-semibold">日給:</span> ¥{localSettings.dailyWage?.toLocaleString()}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

