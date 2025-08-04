const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

async function testUserReport() {
  try {
    // Tạo token cho user thường
    const token = jwt.sign(
      { email: 'duongthanhloc216@gmail.com', role: 'user' },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    console.log('Testing user-overview endpoint...');
    
    const response = await fetch('http://localhost:5000/api/reports/user-overview?email=duongthanhloc216@gmail.com', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User overview endpoint works:', data);
    } else {
      const error = await response.text();
      console.log('❌ User overview endpoint failed:', error);
    }

    console.log('\nTesting export-user endpoint...');
    
    const exportResponse = await fetch('http://localhost:5000/api/reports/export-user?type=My%20Requests&email=duongthanhloc216@gmail.com', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (exportResponse.ok) {
      console.log('✅ Export user report endpoint works');
    } else {
      const error = await exportResponse.text();
      console.log('❌ Export user report endpoint failed:', error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUserReport(); 