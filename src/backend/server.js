const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = path.join(__dirname, 'assets', 'natureHero');
const METADATA_FILE = path.join(__dirname, 'metadata.json');

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const { name } = req.body;
    const extension = path.extname(file.originalname);
    const formattedName = name.replace(/\s+/g, '-') + extension;
    cb(null, formattedName);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Helper function to update metadata
const updateMetadata = (newMetadata) => {
  fs.readFile(METADATA_FILE, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') return console.error('Error reading metadata file:', err);
    const metadata = data ? JSON.parse(data) : [];
    metadata.push(newMetadata);
    fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), (err) => {
      if (err) console.error('Error writing metadata file:', err);
    });
  });
};

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  const { name, gender, ageRange } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const metadata = {
    name,
    path: path.join('/assets', 'natureHero', file.filename),
    gender,
    ageRange,
  };

  updateMetadata(metadata);
  res.json({ message: 'Image uploaded successfully', file });
});

// Fetch all images
app.get('/images', (req, res) => {
  fs.readFile(METADATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch metadata' });
    const metadata = JSON.parse(data);
    const baseUrl = req.protocol + '://' + req.get('host');
    res.json(metadata.map(item => ({
      name: item.name,
      url: baseUrl + item.path,
      gender: item.gender,
      ageRange: item.ageRange,
    })));
  });
});

// Serve the images statically
app.use('/assets/natureHero', express.static(UPLOADS_DIR));

// Delete an image
app.delete('/images/:name', (req, res) => {
  const { name } = req.params;
  fs.readFile(METADATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to read metadata' });
    let metadata = JSON.parse(data);
    const imageMetadata = metadata.find(item => item.name === name);
    if (!imageMetadata) return res.status(404).json({ message: 'Image not found in metadata' });

    const filePath = path.join(UPLOADS_DIR, path.basename(imageMetadata.path));
    fs.unlink(filePath, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete image' });
      metadata = metadata.filter(item => item.name !== name);
      fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete image metadata' });
        res.json({ message: 'Image deleted successfully' });
      });
    });
  });
});

// Default route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Welcome</title></head>
    <body><h1>Welcome to Picture with Wild Admin Panel</h1></body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
