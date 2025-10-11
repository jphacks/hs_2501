import React from 'react';

interface DiaryDisplayProps {
  diaryText: string;
  diaryImage: string;
  isLoading: boolean;
}

const DiaryDisplay: React.FC<DiaryDisplayProps> = ({ diaryText, diaryImage, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          {/* ヘッダー */}
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          
          {/* 画像部分 */}
          <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
          
          {/* テキスト部分 */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 mt-6">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            <span>絵日記を生成中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!diaryText && !diaryImage) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">絵日記を生成しましょう</h3>
          <p className="text-gray-500">
            左側のフォームでスケジュールを入力して、<br />
            美しい絵日記を作成してください
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // 保存機能の実装（将来的に拡張可能）
    alert('保存機能は今後実装予定です！');
  };

  const handleShare = () => {
    // 共有機能の実装（将来的に拡張可能）
    alert('共有機能は今後実装予定です！');
  };

  const handleExportPDF = () => {
    // PDF出力機能の実装（将来的に拡張可能）
    alert('PDF出力機能は今後実装予定です！');
  };

  return (
    <div className="card overflow-hidden">
      {/* 日記画像 */}
      {diaryImage && (
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 mb-6">
          <img
            src={diaryImage}
            alt="日記のイラスト"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* 日記テキスト */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span>📝</span>
          今日の日記
        </h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {diaryText}
          </p>
        </div>
      </div>
      
      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
        <button 
          onClick={handleSave}
          className="btn-secondary flex items-center gap-2"
        >
          <span>💾</span>
          保存
        </button>
        <button 
          onClick={handleShare}
          className="btn-secondary flex items-center gap-2"
        >
          <span>📤</span>
          共有
        </button>
        <button 
          onClick={handleExportPDF}
          className="btn-secondary flex items-center gap-2"
        >
          <span>📄</span>
          PDF出力
        </button>
      </div>
    </div>
  );
};

export default DiaryDisplay;
