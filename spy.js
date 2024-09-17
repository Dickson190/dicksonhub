// Function to monitor "clicks" field and send delete requests
async function monitorClicksAndDelete() {
    const apiURL = 'https://sheetdb.io/api/v1/zucejzp83yddh'; // Your SheetDB API URL

    try {
        // Fetch the data from the API
        const response = await fetch(apiURL);
        const data = await response.json();

        let deleteCount = 0;

        // Loop through the data to check for clicks = 0
        for (let i = 0; i < data.length; i++) {
            const record = data[i];

            if (record.clicks === "0") {
                console.log(`Clicks is 0 for record: ${record.taskId}`);

                // Send DELETE request for the first zero clicks field
                const deleteUrl = `${apiURL}/taskId/${record.taskId}`; // Use taskId to delete specific row
                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

                if (deleteResponse.ok) {
                    console.log(`Successfully deleted record with taskId: ${record.taskId}`);
                } else {
                    console.log(`Failed to delete record: ${deleteResponse.statusText}`);
                }

                deleteCount++;

                // If it's the second zero clicks field, wait for 20 seconds before deleting
                if (deleteCount === 2) {
                    console.log("Waiting for 20 seconds before deleting the next one...");
                    await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds
                    deleteCount = 0; // Reset counter after 2 deletions
                }
            }
        }
    } catch (error) {
        console.error('Error fetching or deleting data:', error);
    }
}

// Run the function every minute (60 seconds)
setInterval(monitorClicksAndDelete, 60000); // Adjust interval as necessary