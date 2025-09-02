/**
 * 비밀번호 변경 이력 모달 컴포넌트.
 * @param {object} props - 컴포넌트 속성.
 * @param {Array} props.history - 표시할 변경 이력 배열.
 * @param {function} props.onClose - 모달 닫기 시 실행할 함수.
 */
const HistoryModal = ({ history, onClose }) => {
  if (!history) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container history-modal">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Revision History</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="history-list">
          {history.length > 1 ? (
            history.slice(1).map((item, index) => (
              <li key={index} className="history-item flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-500">{formatDate(item.updatedAt)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-700">Before:</h4>
                    <p className="text-xs">Password: {item.oldState.password}</p>
                    <p className="text-xs">Memo: {item.oldState.memo}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">After:</h4>
                    <p className="text-xs">Password: {item.newState.password}</p>
                    <p className="text-xs">Memo: {item.newState.memo}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="no-history">No changes have been recorded yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HistoryModal;