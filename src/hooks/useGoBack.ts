import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);else
    navigate(fallback);
  }, [fallback, location.key, navigate]);
}