import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// ===============================================
// 메인 컴포넌트: App
// 모든 상태 관리와 UI 렌더링을 한 곳에서 처리합니다.
// ===============================================

// Gemini API 호출을 위한 상수
const GEMINI_API_KEY = "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

/**
 * 비밀번호 잠금 해제를 위한 핀 번호.
 * 핀 번호를 직접 노출하는 것은 보안상 좋지 않으므로, 실제 앱에서는 서버에서 관리해야 합니다.
 */
const CORRECT_PIN = '1234';

/**
 * Gemini API를 호출하는 공통 헬퍼 함수.
 * @param {string} prompt - 모델에 전달할 프롬프트.
 * @param {object} responseSchema - 응답으로 받을 JSON 스키마.
 * @returns {Promise<object|null>} - API 응답 JSON 객체 또는 오류 시 null.
 */
const callGeminiApi = async (prompt, responseSchema) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
      const json = result.candidates[0].content.parts[0].text;
      return JSON.parse(json);
    } else {
      console.error("Gemini API: No candidates found or incomplete response.");
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};

/**
 * 비밀번호 등록 및 수정 폼 컴포넌트.
 * @param {object} props - 컴포넌트 속성.
 * @param {function} props.onSubmit - 폼 제출 시 실행할 함수.
 * @param {function} props.onCancel - 취소 버튼 클릭 시 실행할 함수.
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

/**
 * 비밀번호 상세 보기 모달 컴포넌트.
 * @param {object} props - 컴포넌트 속성.
 * @param {object} props.passwordItem - 표시할 비밀번호 항목.
 * @param {function} props.onClose - 모달 닫기 시 실행할 함수.
 */
const PasswordDetailsModal = ({ passwordItem, onClose }) => {
  if (!passwordItem) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container password-details-modal">
        <div className="modal-header">
          <h2 className="text-xl font-bold">{passwordItem.siteName}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-700">
          <div className="mb-4">
            <p className="font-semibold">Username:</p>
            <p className="break-all">{passwordItem.username}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Password:</p>
            <p className="break-all">{passwordItem.password}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">URL:</p>
            <a href={passwordItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{passwordItem.url}</a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Memo:</p>
            <p className="whitespace-pre-wrap">{passwordItem.memo}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Keywords:</p>
            <p>{passwordItem.keyword}</p>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            <p className="font-semibold">Registered:</p>
            <p>{formatDate(passwordItem.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

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


// 메인 앱 컴포넌트
function App() {
  const initialPasswords = [
    { id: 1, siteName: 'Google', password: 'password123', username: 'user_123', url: 'https://google.com', memo: '구글 계정', keyword: '검색, 이메일, 문서', createdAt: new Date().toISOString(), history: [{ oldState: { password: 'initial_password', memo: 'initial_memo' }, newState: { password: 'password123', memo: '구글 계정' }, updatedAt: new Date().toISOString() }] },
    { id: 2, siteName: 'Apple', password: 'password456', username: 'appleid_user', url: 'https://apple.com', memo: '애플 ID', keyword: '아이폰, 아이클라우드, 앱스토어', createdAt: new Date().toISOString(), history: [] },
    { id: 3, siteName: 'Amazon', password: 'password789', username: 'amazon_shopper', url: 'https://amazon.com', memo: '아마존 계정', keyword: '쇼핑, 직구, 전자상거래', createdAt: new Date().toISOString(), history: [] },
    { id: 4, siteName: 'Facebook', password: 'password101', username: 'fb_user', url: 'https://facebook.com', memo: '페이스북 로그인 정보', keyword: '소셜, SNS, 커뮤니티', createdAt: new Date().toISOString(), history: [] },
    { id: 5, siteName: 'Naver', password: 'password112', username: 'naver_id', url: 'https://naver.com', memo: '네이버 계정', keyword: '검색, 포털, 블로그', createdAt: new Date().toISOString(), history: [] },
    { id: 6, siteName: 'Netflix', password: 'password134', username: 'netflix_fan', url: 'https://netflix.com', memo: '넷플릭스 로그인 정보', keyword: '영화, 시리즈, 스트리밍', createdAt: new Date().toISOString(), history: [] },
  ];

  const [passwordList, setPasswordList] = useState(initialPasswords);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [pinAction, setPinAction] = useState(null);

  const listRef = useRef(null);

  // 정렬된 비밀번호 목록
  const sortedPasswordList = [...passwordList].sort((a, b) => {
    const nameA = a.siteName.toUpperCase();
    const nameB = b.siteName.toUpperCase();
    if (!isNaN(nameA.charAt(0)) && isNaN(nameB.charAt(0))) return -1;
    if (isNaN(nameA.charAt(0)) && !isNaN(nameB.charAt(0))) return 1;
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  
  // 검색 로직: siteName -> keyword -> memo -> username 순으로 필터링
  const filteredPasswords = sortedPasswordList.filter(item => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // 1순위: 사이트 이름 매칭
    if (item.siteName.toLowerCase().includes(lowerSearchTerm)) {
      return true;
    }

    // 2순위: 키워드 매칭
    if (item.keyword && item.keyword.toLowerCase().includes(lowerSearchTerm)) {
        return true;
    }

    // 3순위: 메모, URL 또는 ID 매칭
    if (item.memo.toLowerCase().includes(lowerSearchTerm) || item.url.toLowerCase().includes(lowerSearchTerm) || item.username.toLowerCase().includes(lowerSearchTerm)) {
        return true;
    }
    
    return false;
  });

  const handleAISmartSearch = async () => {
    if (!searchTerm) {
      setAiMessage('Please enter a search term for smart search.');
      return;
    }
    setAiMessage('AI smart search in progress...');

    const prompt = `Extract website or service names from the following user query. Return the result as a JSON array. If no related websites are found, return an empty array.
    User query: "${searchTerm}"
    Example:
    { "search_terms": ["Facebook", "Instagram", "Twitter"] }`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        search_terms: {
          type: "ARRAY",
          items: {
            type: "STRING"
          }
        }
      }
    };

    try {
      const result = await callGeminiApi(prompt, responseSchema);
      if (result && result.search_terms && result.search_terms.length > 0) {
        // AI가 찾은 결과를 다시 검색어로 설정하여 1, 2순위 검색을 유도
        const newSearchTerm = result.search_terms.join(' ');
        setSearchTerm(newSearchTerm);
        setAiMessage(`AI found the following sites: ${result.search_terms.join(', ')}. Search results have been updated.`);
      } else {
        setAiMessage("AI smart search did not find any related site names.");
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      setAiMessage('An error occurred during password analysis.');
    }
  };

  const performAISmartSearch = () => {
    handleAISmartSearch();
  };

  const handleRegister = (newPassword) => {
    const now = new Date().toISOString();
    const passwordWithMeta = {
      ...newPassword,
      createdAt: now,
      history: [{ oldState: { password: '', memo: '' }, newState: { password: newPassword.password, memo: newPassword.memo }, updatedAt: now }]
    };
    setPasswordList([...passwordList, passwordWithMeta]);
    setShowFormModal(false);
  };

  const handleEditClick = (id) => {
    const passwordToEdit = passwordList.find(item => item.id === id);
    if (passwordToEdit) {
      setModalTitle('Unlock to Edit');
      setPinAction(() => () => {
        setIsEditing(true);
        setCurrentPassword(passwordToEdit);
        setShowFormModal(true);
        setShowPinModal(false);
      });
      setShowPinModal(true);
    }
  };

  const handleUpdate = (updatedPassword) => {
    const now = new Date().toISOString();
    const updatedList = passwordList.map(item => {
      if (item.id === updatedPassword.id) {
        // Create a new history entry with before and after state
        const newHistoryEntry = {
          oldState: { password: item.password, memo: item.memo },
          newState: { password: updatedPassword.password, memo: updatedPassword.memo },
          updatedAt: now,
        };
        const newHistory = [...item.history, newHistoryEntry];
        return { ...updatedPassword, history: newHistory };
      }
      return item;
    });
    setPasswordList(updatedList);
    setShowFormModal(false);
    setIsEditing(false);
    setCurrentPassword(null);
  };

  const handleDeleteClick = (id) => {
    setModalTitle('Unlock to Delete');
    setPinAction(() => () => {
      setPasswordList(passwordList.filter(item => item.id !== id));
      setShowPinModal(false);
    });
    setShowPinModal(true);
  };

  const handleAnalyzePassword = async (password) => {
    setAiMessage('Analyzing password strength...');
    const prompt = `Analyze the security strength of the following password. Provide a score from 1-100 and a list of 3 actionable suggestions to improve it in a JSON format.
    Password: "${password}"
    Example:
    { "score": 85, "suggestions": ["Use a longer password.", "Include special characters.", "Avoid using common words or phrases."] }`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        score: { type: "NUMBER" },
        suggestions: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["score", "suggestions"]
    };

    try {
      const result = await callGeminiApi(prompt, responseSchema);
      if (result && result.score) {
        setAiMessage(`Password Strength: ${result.score}/100. Suggestions: ${result.suggestions.join(' ')}`);
      } else {
        setAiMessage('Could not analyze password strength.');
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiMessage('An error occurred during password analysis.');
    }
  };

  const handleItemClick = (id) => {
    setModalTitle('Unlock to View Details');
    setPinAction(() => () => {
      const passwordToView = passwordList.find(item => item.id === id);
      if (passwordToView) {
        setCurrentPassword(passwordToView);
        setShowDetailsModal(true);
      }
      setShowPinModal(false);
    });
    setShowPinModal(true);
  };

  const handleHistoryClick = (id) => {
    setModalTitle('Unlock to View History');
    setPinAction(() => () => {
      const passwordToView = passwordList.find(item => item.id === id);
      if (passwordToView) {
        setCurrentPassword(passwordToView);
        setShowHistoryModal(true);
      }
      setShowPinModal(false);
    });
    setShowPinModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-sans antialiased flex flex-col items-center justify-center">
        {/* 전체 앱 컨테이너의 높이를 고정(h-[600px])으로 설정했습니다. */}
        <div className="app-container w-full max-w-4xl mx-auto p-4 bg-gray-100 rounded-xl shadow-lg flex flex-col h-[600px]">
          <header className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Password Manager</h1>
            <p className="text-sm text-gray-500 mt-1">A safe and smart password vault.</p>
          </header>

          <main className="w-full flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    performAISmartSearch();
                  }
                }}
                className="form-input w-full"
              />
              <div className="flex gap-2">
                <div className="relative group">
                  <button onClick={performAISmartSearch} className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                  <span className="tooltip">AI Smart Search</span>
                </div>
                <div className="relative group rm-2">
                  <button onClick={() => { setSearchTerm(''); setAiMessage(''); }} className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.061 10.292a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.992v4.992" />
                    </svg>
                  </button>
                  <span className="tooltip">Reset</span>
                </div>
              </div>
            </div>

            {aiMessage && <p className="text-sm text-gray-600 mb-4 text-center">{aiMessage}</p>}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">My Password List</h2>
              <div className="relative group">
                <button onClick={() => { setIsEditing(false); setCurrentPassword(null); setShowFormModal(true); }} className="add-icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 목록 컨테이너의 높이(h-[400px])를 고정하고, 넘치는 내용에 스크롤을 추가했습니다. */}
            <div className="content-container w-full h-[400px] overflow-y-auto">
              {filteredPasswords.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" ref={listRef}>
                  {filteredPasswords.map((item) => (
                    <li
                      key={item.id}
                      className="password-item group"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex justify-between items-center">
                        {/* 사이트명 옆에 아이디를 표시 */}
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-800">{item.siteName}</h3>
                            {item.username && <p className="text-sm text-gray-500">{item.username}</p>}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHistoryClick(item.id);
                            }}
                            className="action-btn text-gray-500 hover:text-gray-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(item.id);
                            }}
                            className="action-btn text-blue-500 hover:text-blue-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.232 5.232z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.id);
                            }}
                            className="action-btn text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex justify-center items-center h-full w-full">
                  <p className="text-gray-500 text-center">No passwords found.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showPinModal && <PinInputModal onConfirm={pinAction} onCancel={() => setShowPinModal(false)} title={modalTitle} />}

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <PasswordForm
              onSubmit={isEditing ? handleUpdate : handleRegister}
              onCancel={() => {
                setShowFormModal(false);
                setIsEditing(false);
                setCurrentPassword(null);
              }}
              initialData={currentPassword}
            />
          </div>
        </div>
      )}

      {showDetailsModal && currentPassword && (
        <PasswordDetailsModal
          passwordItem={currentPassword}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showHistoryModal && currentPassword && (
        <HistoryModal
          history={currentPassword.history}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      <style>
        {`
          :root {
            --primary-color: #4f46e5;
            --primary-hover-color: #4338ca;
            --secondary-color: #6b7280;
            --secondary-hover-color: #4b5563;
          }

          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          body {
            font-family: 'Inter', sans-serif;
          }
            
          /* 컨테이너의 높이와 너비를 고정합니다. */
          .app-container {
            height: 600px; 
            width: 1000px;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #d1d5db;
            transition: border-color 0.3s;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
          }

          .icon-btn, .add-icon-btn {
            width: 2.5rem;
            height: 2.5rem;
            background-color: var(--primary-color);
            color: white;
            border-radius: 9999px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s, transform 0.2s;
          }

          .icon-btn:hover, .add-icon-btn:hover {
            background-color: var(--primary-hover-color);
            // transform: scale(1.1);
          }

          .add-icon-btn {
            background-color: #22c55e;
          }

          .add-icon-btn:hover {
            background-color: #16a34a;
          }

          .password-item {
            background-color: white;
            padding: 1rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            position: relative;
          }

          .password-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }

          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-container {
            background-color: white;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 400px;
            animation: fadeIn 0.3s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .password-details-modal {
            max-width: 600px;
          }
          .history-modal {
            max-width: 500px;
          }

          .form-container {
            width: 100%;
          }

          .form-submit-btn {
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s;
            width: 100%;
          }

          .form-submit-btn:hover {
            background-color: var(--primary-hover-color);
          }

          .modal-confirm-btn {
            background-color: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s;
          }

          .modal-confirm-btn:hover {
            background-color: var(--primary-hover-color);
          }

          .modal-cancel-btn {
            background-color: var(--secondary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s;
          }

          .modal-cancel-btn:hover {
            background-color: var(--secondary-hover-color);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .modal-close-btn {
            color: #6b7280;
            transition: color 0.3s;
            background: none;
            border: none;
            cursor: pointer;
          }

          .modal-close-btn:hover {
            color: #4b5563;
          }
          
          .content-container {
            flex: 1;
            overflow-y: auto;
          }

          .history-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-height: 16rem;
            overflow-y: auto;
          }
          
          .history-item {
            background-color: white;
            padding: 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            border: 1px solid #e5e7eb;
          }

          .no-history {
            color: #6b7280;
            text-align: center;
          }

          .tooltip {
            visibility: hidden;
            background-color: #374151;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 8px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
          }
          
          .group:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
        `}
      </style>
    </>
  );
}

export default App;
