import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { writeTextToClipboard } from '../utils/clipboard';

const SHARE_PREFIX = 'share=';

function encodeShare(toolId: string, data: object): string {
  const payload = JSON.stringify({ toolId, ...data });
  return btoa(encodeURIComponent(payload));
}

function decodeShare(hash: string): { toolId: string; data: Record<string, unknown> } | null {
  try {
    const match = hash.match(new RegExp(SHARE_PREFIX + '([A-Za-z0-9+/=]+)'));
    if (!match) return null;
    const payload = JSON.parse(decodeURIComponent(atob(match[1])));
    const { toolId, ...data } = payload;
    return toolId ? { toolId, data } : null;
  } catch {
    return null;
  }
}

export function useShareLink(toolId: string) {
  const location = useLocation();
  const navigate = useNavigate();

  const getShareUrl = useCallback(
    (data: object) => {
      const encoded = encodeShare(toolId, data);
      const url = `${window.location.origin}${location.pathname}#${SHARE_PREFIX}${encoded}`;
      return url;
    },
    [toolId, location.pathname]
  );

  const copyShareLink = useCallback(
    async (data: object) => {
      const url = getShareUrl(data);
      await writeTextToClipboard(url);
      return url;
    },
    [getShareUrl]
  );

  const applySharedState = useCallback(
    (decoded: { toolId: string; data: Record<string, unknown> } | null, onRestore: (data: Record<string, unknown>) => void) => {
      if (!decoded || decoded.toolId !== toolId) return false;
      onRestore(decoded.data);
      navigate(location.pathname, { replace: true });
      return true;
    },
    [toolId, navigate, location.pathname]
  );

  return { getShareUrl, copyShareLink, applySharedState, decodeShare };
}

export function getShareFromHash(): { toolId: string; data: Record<string, unknown> } | null {
  if (typeof window === 'undefined') return null;
  return decodeShare(window.location.hash);
}
