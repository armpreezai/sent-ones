import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kingdom_kiddies.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_name TEXT,
    contact_number TEXT,
    email TEXT,
    num_children INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER,
    name TEXT,
    age INTEGER,
    gender TEXT,
    FOREIGN KEY (registration_id) REFERENCES registrations(id)
  );

  CREATE TABLE IF NOT EXISTS counselling_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    surname TEXT,
    email TEXT,
    contact TEXT,
    area TEXT,
    support_areas TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS soul_anchored_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    surname TEXT,
    email TEXT,
    contact TEXT,
    area TEXT,
    support_areas TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve static files from Pictures directory
  app.use('/Pictures', express.static(path.join(__dirname, 'Pictures')));

  // API routes
  app.get("/api/upcoming-data", async (req, res) => {
    const appsScriptUrl = process.env.CONNECT_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
    
    console.log(`GET /api/upcoming-data - Fetching from: ${appsScriptUrl} using POST`);
    
    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'Upcoming',
          action: 'get' // Adding action: 'get' as a common convention, though type: 'Upcoming' might be enough
        }),
        redirect: 'follow'
      });
      
      console.log(`Google Sheets response status: ${response.status}`);
      
      const text = await response.text();
      
      if (!response.ok) {
        console.error(`Google Sheets error body: ${text}`);
        return res.status(response.status).json({ error: 'Google Sheets returned an error', details: text });
      }
      
      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (parseError) {
        console.error('Failed to parse Google Sheets response as JSON. Body starts with:', text.substring(0, 100));
        
        // If POST failed, let's try GET as a fallback but with better error reporting
        console.log("POST failed to return JSON, trying GET fallback...");
        const getUrl = new URL(appsScriptUrl);
        getUrl.searchParams.set('type', 'Upcoming');
        
        const getResponse = await fetch(getUrl.toString(), {
          method: 'GET',
          redirect: 'follow'
        });
        
        const getText = await getResponse.text();
        try {
          const getData = JSON.parse(getText);
          return res.json(getData);
        } catch (getParseError) {
          return res.status(500).json({ 
            error: 'Invalid response format from Google Sheets', 
            details: 'The script returned HTML instead of JSON for both POST and GET. Please ensure the Google Apps Script is published as "Web App", set to "Execute as: Me" and "Who has access: Anyone".',
            post_preview: text.substring(0, 200),
            get_preview: getText.substring(0, 200)
          });
        }
      }
    } catch (error) {
      console.error('Error in /api/upcoming-data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.post("/api/counselling-request", async (req, res) => {
    const { name, surname, email, contact, area, supportAreas, message } = req.body;

    try {
      const insertRequest = db.prepare(`
        INSERT INTO counselling_requests (name, surname, email, contact, area, support_areas, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertRequest.run(name, surname, email, contact, area, JSON.stringify(supportAreas), message);

      // Forward to Google Sheets
      const appsScriptUrl = process.env.COUNSELLING_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Counselling',
            name,
            surname,
            email,
            contact,
            area,
            supportAreas,
            message,
            timestamp: new Date().toLocaleString()
          }),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets Counselling Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets counselling forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Request submitted successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/soul-anchored-request", async (req, res) => {
    const { name, surname, email, contact, area, supportAreas, message } = req.body;

    try {
      const insertRequest = db.prepare(`
        INSERT INTO soul_anchored_requests (name, surname, email, contact, area, support_areas, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertRequest.run(name, surname, email, contact, area, JSON.stringify(supportAreas), message);

      // Forward to Google Sheets
      const appsScriptUrl = process.env.COUNSELLING_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Soul',
            name,
            surname,
            email,
            contact,
            area,
            supportAreas,
            message,
            timestamp: new Date().toLocaleString()
          }),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets Soul Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets soul forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Request submitted successfully" });
    } catch (error) {
      console.error("Soul Anchored error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/register-kingdom-kiddies", async (req, res) => {
    const { parentName, contactNumber, email, children } = req.body;

    try {
      const insertRegistration = db.prepare(`
        INSERT INTO registrations (parent_name, contact_number, email, num_children)
        VALUES (?, ?, ?, ?)
      `);

      const info = insertRegistration.run(parentName, contactNumber, email, children.length);
      const registrationId = info.lastInsertRowid;

      const insertChild = db.prepare(`
        INSERT INTO children (registration_id, name, age, gender)
        VALUES (?, ?, ?, ?)
      `);

      for (const child of children) {
        insertChild.run(registrationId, child.name, child.age, child.gender);
      }

      // Forward to Google Sheets
      const appsScriptUrl = process.env.REGISTRATION_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Kingdom Kiddies',
            parentName,
            contactNumber,
            email,
            childrenRaw: children,
            timestamp: new Date().toLocaleString()
          }),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets Registration Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets registration forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Registration successful" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/connect-registration", async (req, res) => {
    const { type, name, surname, mobile, email, groupType, eventName } = req.body;

    // Map internal types to exact Google Sheet names from user screenshot
    let sheetType = type;
    if (type === 'gods_girls') sheetType = "God's Girls";
    else if (type === 'mens_breakfast') sheetType = "Men's Breakfast";
    else if (type === 'home_group') sheetType = "Home Group";
    else if (type === 'event') sheetType = "Upcoming";

    try {
      // Forward to Google Sheets
      const appsScriptUrl = process.env.CONNECT_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      const payload: any = {
        type: sheetType,
        name,
        surname,
        mobile,
        email,
        timestamp: new Date().toLocaleString()
      };

      if (groupType) payload.groupType = groupType;
      if (eventName) payload.eventName = eventName;

      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets Connect Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets connect registration forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Registration submitted successfully" });
    } catch (error) {
      console.error("Connect registration error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/school-registration", async (req, res) => {
    const { year, name, surname, email, contact, area, experience } = req.body;

    try {
      // Forward to Google Sheets
      const appsScriptUrl = process.env.CONNECT_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'School of Prophetic',
            year, // 'Year 1' or 'Year 2'
            name,
            surname,
            email,
            contact,
            area,
            experience,
            timestamp: new Date().toLocaleString()
          }),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets School Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets school registration forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Registration submitted successfully" });
    } catch (error) {
      console.error("School registration error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/contact-message", async (req, res) => {
    const { name, email, message } = req.body;

    try {
      const insertMessage = db.prepare(`
        INSERT INTO contact_messages (name, email, message)
        VALUES (?, ?, ?)
      `);

      insertMessage.run(name, email, message);

      // Forward to Google Sheets
      const appsScriptUrl = process.env.CONNECT_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx8On4kqhCCbrUA3h_lO3Tfsac0e49N9HmGzkzo3IvR8TYHDe2KeQYvwdKWFezoEJaK/exec';
      
      try {
        const sheetResponse = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Message',
            name,
            email,
            message,
            timestamp: new Date().toLocaleString()
          }),
          redirect: 'follow'
        });
        
        const resultText = await sheetResponse.text();
        console.log("Google Sheets Message Response:", resultText);
      } catch (sheetError) {
        console.error("Google Sheets message forwarding failed:", sheetError);
      }

      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
