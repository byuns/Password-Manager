import React, { useState, useEffect, useRef } from 'react';

/**
 * 비밀번호 잠금 해제를 위한 핀 번호.
 * 핀 번호를 직접 노출하는 것은 보안상 좋지 않으므로, 실제 앱에서는 서버에서 관리해야 합니다.
 */
const CORRECT_PIN = '1234';


/**
 * 핀 번호를 입력받는 모달 컴포넌트.
 * @param {object} props - 컴포넌트 속성.
 * @param {function} props.onConfirm - 핀 번호 확인 시 실행할 함수.
 * @param {function} props.onCancel - 모달 닫기 시 실행할 함수.
 * @param {string} props.title - 모달 제목.
 */
const PinInputModal = ({ onConfirm, onCancel, title }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleConfirm = () => {
    if (pin === CORRECT_PIN) {
      onConfirm();
    } else {
      setError('Please enter the correct pin number.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="modal-close-btn" onClick={onCancel}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="password"
            placeholder="Enter Pin Number"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-input text-center"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-center gap-4">
            <button className="modal-confirm-btn" onClick={handleConfirm}>Confirm</button>
            <button className="modal-cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinInputModal;