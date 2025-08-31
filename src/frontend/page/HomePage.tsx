// src/pages/HomePage.jsx

const HomePage = () => {
  return (
    <div className="profile-container">
      {/* การแนะนำตัวเอง */}
      <div className="profile-card">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Kermit_puppet.jpg/1200px-Kermit_puppet.jpg"  // เปลี่ยน URL รูปภาพเป็นของคุณ
          alt="Profile"
          className="profile-img"
        />
        <div className="profile-info">
          <p>สวัสดีครับ, ผมชื่อ ขุมทรัพย์</p>
          <p>งานอดิเรก: ชอบดูหนังฟังเพลง เล่นเกม เรียน</p>
          <p><strong>อีเมล:</strong> 66070315@kmitl.ac.th</p> {/* อีเมล */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
