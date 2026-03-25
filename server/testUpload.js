const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create a valid dummy PDF string (minimal valid PDF)
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

async function testUpload() {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 2. Create or get test user
    let user = await User.findOne({ email: 'test_upload@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Test Uploader',
        email: 'test_upload@example.com',
        password: 'password123',
        skills: ['React', 'Node']
      });
    }

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Token generated");

    // 4. Create dummy PDF file
    const pdfPath = path.join(__dirname, 'dummy_test.pdf');
    fs.writeFileSync(pdfPath, dummyPdfContent);

    // 5. Build FormData (native)
    const form = new FormData();
    const blob = new Blob([fs.readFileSync(pdfPath)], { type: 'application/pdf' });
    form.append('resume', blob, 'dummy_test.pdf');

    console.log("Sending POST request to http://localhost:5000/api/resume/upload ...");

    // 6. Make request
    const response = await fetch('http://localhost:5000/api/resume/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
        // FormData boundary headers are automatically set by fetch
      },
      body: form
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("SUCCESS! Response Data:");
    console.log(data);

    // Cleanup
    fs.unlinkSync(pdfPath);
    process.exit(0);
  } catch (error) {
    console.error("FAILED!");
    console.error(error);
    process.exit(1);
  }
}

testUpload();
