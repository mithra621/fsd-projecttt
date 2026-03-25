const fs = require('fs');
const path = require('path');

const dummyPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 64 >>
stream
BT /F1 12 Tf 100 700 Td (Software Engineer with React Node JS experience) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000226 00000 n 
0000000341 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
429
%%EOF`;

async function testLiveBackend() {
  try {
    const API_URL = 'https://fsd-projecttt-backend.onrender.com';
    
    // 1. Register a dummy user to get a real token from the LIVE DB
    console.log("Registering test user on Live API...");
    const email = `test_live_${Date.now()}@example.com`;
    const regRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Live',
        email,
        password: 'password123',
        skills: ['React', 'Node']
      })
    });
    
    if (!regRes.ok) {
      const err = await regRes.text();
      throw new Error(`Registration failed: ${regRes.status} ${err}`);
    }
    const userData = await regRes.json();
    const token = userData.token;
    console.log("Got Live Token:", token.substring(0, 10) + '...');

    // 2. Create dummy PDF file
    const pdfPath = path.join(__dirname, 'dummy_live.pdf');
    fs.writeFileSync(pdfPath, dummyPdfContent);

    // 3. Build native FormData
    const form = new FormData();
    const blob = new Blob([fs.readFileSync(pdfPath)], { type: 'application/pdf' });
    form.append('resume', blob, 'resume.pdf');

    // 4. Hit the resume upload endpoint on LIVE
    console.log(`Sending POST request to ${API_URL}/api/resume/upload ...`);
    
    const uploadRes = await fetch(`${API_URL}/api/resume/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });

    const responseText = await uploadRes.text();
    
    if (!uploadRes.ok) {
      throw new Error(`Upload Failed: ${uploadRes.status} -> ${responseText}`);
    }

    console.log("SUCCESS! Live Response:");
    console.log(responseText);

    // Cleanup
    fs.unlinkSync(pdfPath);
    process.exit(0);
  } catch (error) {
    console.error("FAILED LIVE TEST!");
    console.error(error.message);
    process.exit(1);
  }
}

testLiveBackend();
