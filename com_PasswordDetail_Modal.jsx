import React, { useState, useEffect, useRef } from 'react';

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

  export default PasswordDetailsModal;