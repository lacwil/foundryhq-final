import React from 'react';

export function ChatText({ text }) {
  return <span style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{text}</span>;
}
