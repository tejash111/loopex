# File Upload API Documentation

## Overview
The messaging system now supports file uploads including images, videos, audio, and documents using Cloudinary for storage.

## Supported File Types
- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX
- **Audio**: MP3
- **Video**: MP4, MPEG

## File Size Limits
- Maximum file size: 50MB (for all file types)

## Configuration

### Environment Variables
Add the following to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Getting Cloudinary Credentials
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

## API Endpoint

### Send Message with File
**POST** `/api/messages/send`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `receiverId` (required): String - ID of the message receiver
- `content` (optional): String - Text message content
- `file` (optional): File - File attachment
- `linkPreview` (optional): JSON String - Link preview data

**Note:** Either `content` or `file` must be provided.

**Example using JavaScript Fetch:**
```javascript
const formData = new FormData();
formData.append('receiverId', '507f1f77bcf86cd799439011');
formData.append('content', 'Check out this file!');
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData,
  credentials: 'include'
});

const data = await response.json();
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/messages/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "receiverId=507f1f77bcf86cd799439011" \
  -F "content=Check out this file!" \
  -F "file=@/path/to/your/file.pdf"
```

## Response Format

**Success Response:**
```json
{
  "success": true,
  "message": {
    "id": "507f1f77bcf86cd799439011",
    "content": "Check out this file!",
    "timestamp": "2025-12-23T10:30:00.000Z",
    "isOwn": true,
    "sender": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "attachment": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "loopex/messages/abc123",
      "fileName": "document.pdf",
      "fileType": "document",
      "mimeType": "application/pdf",
      "size": 1024000
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error description"
}
```

## Message Model

The Message model now includes an `attachment` field:

```javascript
{
  sender: ObjectId,
  receiver: ObjectId,
  content: String,
  read: Boolean,
  linkPreview: {
    title: String,
    description: String,
    url: String
  },
  attachment: {
    url: String,
    publicId: String,
    fileName: String,
    fileType: String, // 'image', 'video', 'audio', 'document'
    mimeType: String,
    size: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Socket.IO Updates

When sending messages via Socket.IO, the attachment data is also included:

```javascript
socket.emit('send_message', {
  senderId: currentUserId,
  receiverId: selectedUserId,
  content: 'Message text',
  attachment: {
    url: 'https://res.cloudinary.com/...',
    publicId: 'loopex/messages/abc123',
    fileName: 'document.pdf',
    fileType: 'document',
    mimeType: 'application/pdf',
    size: 1024000
  }
});
```

## Frontend Integration Example

```javascript
// File input handler
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // Validate file size (50MB)
  if (file.size > 50 * 1024 * 1024) {
    alert('File size must be less than 50MB');
    return;
  }
  
  const formData = new FormData();
  formData.append('receiverId', selectedUser._id);
  formData.append('content', 'Sent a file');
  formData.append('file', file);
  
  try {
    const response = await fetch(`${apiUrl}/api/messages/send`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('File sent successfully:', data.message);
      // Update UI with new message
    }
  } catch (error) {
    console.error('Error sending file:', error);
  }
};
```

## Security Considerations

1. **File Type Validation**: Only allowed file types can be uploaded
2. **File Size Limits**: Maximum 50MB to prevent abuse
3. **Authentication Required**: All upload endpoints require JWT authentication
4. **Cloudinary Security**: Files are stored securely on Cloudinary's CDN

## Error Handling

Common errors:
- `400`: Invalid file type or missing required fields
- `404`: Receiver not found
- `500`: Upload failed or server error

All errors include descriptive messages in the response.
