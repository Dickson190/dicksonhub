// List of APIs to try
const apiList = [
  'https://sheetdb.io/api/v1/zucejzp83yddh',
  'https://another-api-url.com/v1/data',  // Add additional APIs here
  'https://yet-another-api-url.com/v1/data'
];

// Function to try deleting a record across multiple APIs
async function deleteRecordByTaskIdAcrossAPIs(taskId) {
  for (let i = 0; i < apiList.length; i++) {
    const apiUrl = apiList[i];
    try {
      const response = await fetch(`${apiUrl}/taskId/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`API ${apiUrl} failed.`);
      }

      const data = await response.json();
      console.log(`Record with taskId=${taskId} has been successfully deleted from API ${apiUrl}.`, data);
      return; // Stop the loop on a successful deletion
    } catch (error) {
      console.error(`Error deleting record with taskId=${taskId} from API ${apiUrl}:`, error);
      // Try the next API in the list
    }
  }
  console.error(`All APIs failed to delete the record with taskId=${taskId}.`);
}

// Function to handle deleting records with a 20-second wait between deletions
async function handleDeletions(records) {
  // Filter records where clicks are 0
  const zeroClickRecords = records.filter(record => record.clicks === '0');

  if (zeroClickRecords.length > 0) {
    console.log(`Found ${zeroClickRecords.length} record(s) with 0 clicks.`);

    // Delete records one by one, waiting 20 seconds between each
    for (let i = 0; i < zeroClickRecords.length; i++) {
      console.log(`Deleting record with taskId: ${zeroClickRecords[i].taskId}`);
      await deleteRecordByTaskIdAcrossAPIs(zeroClickRecords[i].taskId);

      // Wait 20 seconds before deleting the next record, if there is one
      if (i < zeroClickRecords.length - 1) {
        console.log('Waiting 20 seconds before deleting the next record...');
        await new Promise(resolve => setTimeout(resolve, 20000));
      }
    }
  } else {
    console.log('No records with 0 clicks found.');
  }
}

// Function to fetch records from the API
function fetchRecords() {
  fetch(apiList[0]) // Start with the first API in the list
    .then(response => response.json())
    .then(data => {
      console.log('Fetched records:', data);
      handleDeletions(data);
    })
    .catch(error => console.error('Error fetching records:', error));
}

// Call the fetchRecords function on page load
window.onload = function () {
  fetchRecords();
};
