import React, {useState} from 'react';
import axios from 'axios';

const modalBackgroundStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  width: '400px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  fontFamily: 'Arial',
  position: 'relative'
};

const MessageModal = ({ toUser, onClose }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState(null);

  return (
  <div style={modalBackgroundStyle} onClick={onClose}>
    <div style={modalStyle} onClick={e => e.stopPropagation()}>
      <h2>Üzenet küldése</h2>
      <p><strong>Címzett:</strong> {toUser.username}</p>

      <label>Tárgy</label><br />
      <input
        type="text"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Pl.: Frissítés a feladatról"
        style={{
          width: '100%',
          padding: '0.5rem',
          margin: '0.5rem 0 1rem 0',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      /><br />

      <label>Üzenet</label><br />
      <textarea
        rows={5}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Írd ide az üzeneted..."
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          resize: 'none'
        }}
      /><br />

      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button
          onClick={onClose}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            background: '#ccc',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Mégse
        </button>
        <button
          onClick={async () => {
            setSending(true);
            try {
              const res = await axios.post('/send-message', {
                from: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : '',
                to: toUser.username,
                subject,
                content
              });
              setFeedback('Üzenet sikeresen elküldve.');
              setSubject('');
              setContent('');
            } catch (err) {
              setFeedback('Hiba történt az üzenet küldése közben.');
            } finally {
              setSending(false);
            }
          }}
          disabled={sending}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Küldés
        </button>
      </div>

      {feedback && (
        <p style={{ marginTop: '1rem', color: '#555' }}>{feedback}</p>
      )}
    </div>
  </div>
);
};

export default MessageModal;
