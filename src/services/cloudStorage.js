import * as XLSX from 'xlsx';

// OneDrive API integration
export class OneDriveService {
  constructor(clientId) {
    this.clientId = clientId;
    this.accessToken = null;
  }

  async authenticate() {
    // Microsoft Graph API authentication
    const scopes = ['Files.ReadWrite.All'];
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=token&scope=${scopes.join(' ')}&redirect_uri=${encodeURIComponent(window.location.origin)}`;
    
    return new Promise((resolve, reject) => {
      const popup = window.open(authUrl, 'OneDrive Auth', 'width=500,height=600');
      
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.access_token) {
          this.accessToken = event.data.access_token;
          popup.close();
          resolve(this.accessToken);
        } else if (event.data.error) {
          popup.close();
          reject(new Error(event.data.error));
        }
      });
    });
  }

  async updateExcelFile(fileId, newData) {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      // Get the existing file
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch existing file');
      }

      const existingData = await response.arrayBuffer();
      
      // Parse existing Excel file
      const workbook = XLSX.read(existingData, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON to get existing data
      const existingRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Add new row
      const newRow = [
        newData.name,
        newData.badgeNumber,
        newData.onboardingExperience === 'good' ? 'Sí' : newData.onboardingExperience === 'mid' ? 'Más o menos' : 'No',
        newData.trainingMotivation === 'good' ? 'Sí' : newData.trainingMotivation === 'mid' ? 'Más o menos' : 'No',
        new Date().toLocaleString('es-ES')
      ];
      
      existingRows.push(newRow);
      
      // Create new worksheet with updated data
      const updatedWorksheet = XLSX.utils.aoa_to_sheet(existingRows);
      workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
      
      // Convert back to buffer
      const updatedBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Upload updated file
      const uploadResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: updatedBuffer
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to update file');
      }

      return true;
    } catch (error) {
      console.error('Error updating OneDrive file:', error);
      throw error;
    }
  }
}

// Google Drive API integration
export class GoogleDriveService {
  constructor(clientId, apiKey) {
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.accessToken = null;
  }

  async authenticate() {
    // Google OAuth2 authentication
    const scopes = ['https://www.googleapis.com/auth/drive.file'];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&response_type=token&scope=${scopes.join(' ')}&redirect_uri=${encodeURIComponent(window.location.origin)}`;
    
    return new Promise((resolve, reject) => {
      const popup = window.open(authUrl, 'Google Drive Auth', 'width=500,height=600');
      
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.access_token) {
          this.accessToken = event.data.access_token;
          popup.close();
          resolve(this.accessToken);
        } else if (event.data.error) {
          popup.close();
          reject(new Error(event.data.error));
        }
      });
    });
  }

  async updateExcelFile(fileId, newData) {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    try {
      // Get the existing file
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch existing file');
      }

      const existingData = await response.arrayBuffer();
      
      // Parse existing Excel file
      const workbook = XLSX.read(existingData, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Convert to JSON to get existing data
      const existingRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Add new row
      const newRow = [
        newData.name,
        newData.badgeNumber,
        newData.onboardingExperience === 'good' ? 'Sí' : newData.onboardingExperience === 'mid' ? 'Más o menos' : 'No',
        newData.trainingMotivation === 'good' ? 'Sí' : newData.trainingMotivation === 'mid' ? 'Más o menos' : 'No',
        new Date().toLocaleString('es-ES')
      ];
      
      existingRows.push(newRow);
      
      // Create new worksheet with updated data
      const updatedWorksheet = XLSX.utils.aoa_to_sheet(existingRows);
      workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
      
      // Convert back to buffer
      const updatedBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Upload updated file
      const uploadResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        body: updatedBuffer
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to update file');
      }

      return true;
    } catch (error) {
      console.error('Error updating Google Drive file:', error);
      throw error;
    }
  }
}

// Configuration helper
export const getCloudService = (type, config) => {
  switch (type.toLowerCase()) {
    case 'onedrive':
      return new OneDriveService(config.clientId);
    case 'googledrive':
      return new GoogleDriveService(config.clientId, config.apiKey);
    default:
      throw new Error(`Unsupported cloud service: ${type}`);
  }
};
