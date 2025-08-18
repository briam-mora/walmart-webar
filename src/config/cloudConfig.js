// Cloud Storage Configuration
// You'll need to register your app and get these credentials

export const cloudConfig = {
  onedrive: {
    clientId: 'YOUR_ONEDRIVE_CLIENT_ID', // Register at https://portal.azure.com
    fileId: 'YOUR_EXCEL_FILE_ID', // Get this from OneDrive file URL
    redirectUri: window.location.origin
  },
  googleDrive: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Register at https://console.cloud.google.com
    apiKey: 'YOUR_GOOGLE_API_KEY',
    fileId: 'YOUR_EXCEL_FILE_ID' // Get this from Google Drive file URL
  }
};

// Instructions for setup:
// 
// OneDrive Setup:
// 1. Go to https://portal.azure.com
// 2. Register a new application
// 3. Add redirect URI: http://localhost:5173 (for dev) or your production URL
// 4. Copy the Client ID
// 5. Upload your Excel file to OneDrive and get the file ID from the URL
//
// Google Drive Setup:
// 1. Go to https://console.cloud.google.com
// 2. Create a new project
// 3. Enable Google Drive API
// 4. Create OAuth 2.0 credentials
// 5. Add authorized redirect URIs
// 6. Copy the Client ID and API Key
// 7. Upload your Excel file to Google Drive and get the file ID from the URL
