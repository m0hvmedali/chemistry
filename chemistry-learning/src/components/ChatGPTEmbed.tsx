import React from 'react';

type Props = {
  src?: string;
  height?: string | number;
};

export default function ChatGPTEmbed({ src, height = 600 }: Props) {
  const iframeSrc = src || import.meta.env.VITE_CHATGPT_IFRAME_SRC || '';
  return (
    <div className="chat-embed-container" style={{ width: '100%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 30px rgba(2,6,23,0.6)' }}>
      {iframeSrc ? (
        <iframe
          title="ChatGPT"
          src={iframeSrc}
          className="chat-iframe"
          style={{
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
            border: '0',
            display: 'block',
            background: 'transparent'
          }}
        />
      ) : (
        <div style={{padding:20, textAlign:'center', background:'#071024', color:'#9fb6d8'}}>
          <h3 style={{marginBottom:8}}>Chat area</h3>
          <div style={{fontSize:14}}>No iframe source configured. Set <code>VITE_CHATGPT_IFRAME_SRC</code> in your environment.</div>
        </div>
      )}
    </div>
  );
}
