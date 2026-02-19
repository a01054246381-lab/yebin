// common/config.js

// 원격 백엔드 기본 URL
const API_BASE_URL = "http://114.70.60.54:8000/service";

// API 엔드포인트 모아두기
const API_ENDPOINTS = {
    login: `${API_BASE_URL}/api/login/`,
    resume: `${API_BASE_URL}/api/resume/`,
    evaluate: `${API_BASE_URL}/api/evaluate/`,
    calendar: `${API_BASE_URL}/api/calendar/`,
    community: `${API_BASE_URL}/api/community/`
};

// ES6 모듈로 export
export { API_BASE_URL, API_ENDPOINTS };
