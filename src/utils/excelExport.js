import * as XLSX from 'xlsx';

export const exportToExcel = (data) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Prepare data for Excel
  const excelData = [
    // Header row
    [
      'Session ID',
      'Timestamp',
      'Station 4 - Matched Pairs',
      'Station 4 - Total Pairs',
      'Station 4 - Completion Time',
      'Station 6 - Score',
      'Station 6 - Total Questions',
      'Station 6 - Completion Time',
      'Station 7 - Onboarding Experience',
      'Station 7 - Training Motivation',
      'Station 7 - Name',
      'Station 7 - Badge Number',
      'Station 7 - Submission Time'
    ],
    // Data row
    [
      data.sessionId,
      data.timestamp,
      data.station4.matchedPairs.length,
      data.station4.totalPairs,
      data.station4.completionTime,
      data.station6.score,
      data.station6.totalQuestions,
      data.station6.completionTime,
      data.station7.onboardingExperience,
      data.station7.trainingMotivation,
      data.station7.name,
      data.station7.badgeNumber,
      data.station7.submissionTime
    ]
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Set column widths
  ws['!cols'] = [
    { width: 15 }, // Session ID
    { width: 20 }, // Timestamp
    { width: 20 }, // Station 4 - Matched Pairs
    { width: 20 }, // Station 4 - Total Pairs
    { width: 25 }, // Station 4 - Completion Time
    { width: 20 }, // Station 6 - Score
    { width: 25 }, // Station 6 - Total Questions
    { width: 25 }, // Station 6 - Completion Time
    { width: 30 }, // Station 7 - Onboarding Experience
    { width: 30 }, // Station 7 - Training Motivation
    { width: 20 }, // Station 7 - Name
    { width: 20 }, // Station 7 - Badge Number
    { width: 25 }  // Station 7 - Submission Time
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Walmart Onboarding Results');

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // Create blob and download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `walmart-onboarding-results-${data.sessionId}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return blob;
};

export const prepareDataForCloud = (data) => {
  // Format data for cloud storage
  return {
    filename: `walmart-onboarding-results-${data.sessionId}.xlsx`,
    data: data,
    timestamp: data.timestamp,
    sessionId: data.sessionId
  };
};
