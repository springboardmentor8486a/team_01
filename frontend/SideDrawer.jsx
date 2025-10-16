import React, { useState, useEffect } from 'react';

export default function SideDrawer({ open, issue, onClose, onSave, assets }) {
  const [form, setForm] = useState(null);

  useEffect(()=> {
    setForm(issue ? {...issue} : null);
  }, [issue]);

  if(!form) return null;

  function update(k, v){ setForm(prev=>({...prev, [k]: v})); }

  return (
    <div className={'drawer ' + (open ? 'open' : '')}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Edit Issue</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <div style={{marginTop:8}}>
        <div className="form-row">
          <label>Title</label>
          <input value={form.title} onChange={e=>update('title', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea rows={4} value={form.description} onChange={e=>update('description', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Status</label>
          <select value={form.status} onChange={e=>update('status', e.target.value)}>
            <option>in review</option>
            <option>received</option>
            <option>resolved</option>
          </select>
        </div>
        <div className="form-row">
          <label>Image (select)</label>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {assets.map((a,i)=>(
              <img key={i} src={a} className="small-img" alt="" onClick={()=>update('image', a)} style={{cursor:'pointer', border: form.image===a ? '2px solid #2563eb' : undefined}} />
            ))}
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18}}>
          <div className="date">Updated: {form.date}</div>
          <div>
            <button className="save-btn" onClick={()=>onSave(form)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
