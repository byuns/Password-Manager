import React, { useState} from 'react';

/**
 * 비밀번호 등록 및 수정 폼 컴포넌트.
 * @param {object} props - 컴포넌트 속성.
 * @param {function} props.onSubmit - 폼 제출 시 실행할 함수.
 * @param {function} props.onCancel - 취소 버�� 클릭 시 실행할 함수.
 * @param {object|null} props.initialData - 수정 시 폼에 채울 초기 데이터.
 */
const PasswordForm = ({ onSubmit, onCancel, initialData }) => {
  const [siteName, setSiteName] = useState(initialData?.siteName || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [username, setUsername] = useState(initialData?.username || ''); // ID field
  const [url, setUrl] = useState(initialData?.url || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [keyword, setKeyword] = useState(initialData?.keyword || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ siteName, password, username, url, memo, keyword, id: initialData?.id || Date.now() });
  };

  return (
    <div className="form-container mx-auto">
      <div className="modal-header">
        <h2 className="text-xl font-bold">{initialData ? 'Edit Password' : 'Add New Password'}</h2>
        <button className="modal-close-btn" onClick={onCancel}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="text" // Use text type for username
          placeholder="Username (ID)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Keywords (comma-separated)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="form-input"
        />
        <textarea
          placeholder="Memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-submit-btn">{initialData ? 'Update' : 'Register'}</button>
      </form>
    </div>
  );
};

export default PasswordForm;