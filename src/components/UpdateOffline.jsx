export default function UpdateOffline({ onUpdate }) {
  return (
    <div style={{ padding: 20 }}>
      <h3>Cập nhật dữ liệu học tập</h3>
      <p>Chỉ thực hiện khi có mạng Internet.</p>
      <button onClick={onUpdate}>Tải lại dữ liệu</button>
    </div>
  )
}
