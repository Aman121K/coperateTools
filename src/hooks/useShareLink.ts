import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { writeTextToClipboard } from '../utils/clipboard';

const SHARE_PREFIX = 'share=';

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeShare(toolId: string, data: object): string {
  const payload = JSON.stringify({ toolId, ...data });
  return encodeBase64Url(payload);
}

function decodeShare(hash: string): { toolId: string; data: Record<string, unknown> } | null {
  try {
    const match = hash.match(new RegExp(SHARE_PREFIX + '([A-Za-z0-9+/_=-]+)'));
    if (!match) return null;
    const payload = JSON.parse(decodeBase64Url(match[1]));
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
