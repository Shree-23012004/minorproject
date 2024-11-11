// Modal and Basic DOM Element Selections
var modal = document.getElementById("complaint-modal");
var span = document.getElementsByClassName("close")[0];
var addComplaintModal = document.getElementById("add-complaint-modal");
var addComplaintBtn = document.getElementById("addComplaintBtn");
var closeAddComplaintBtn = document.getElementsByClassName("close-add-complaint")[0];
var complaintForm = document.getElementById("newComplaintForm");

// Function to Open Complaint Modal
function openComplaintModal(complaintData) {
    const modalContent = `
        <h3>Complaint Details</h3>
        <p><strong>Name:</strong> ${complaintData.uploaderName}</p>
        <p><strong>Address:</strong> ${complaintData.address}</p>
        <p><strong>Contact Number:</strong> ${complaintData.contact}</p>
        <p><strong>Email:</strong> ${complaintData.email}</p>
        <p><strong>Description:</strong> ${complaintData.description}</p>
        <p><strong>Status:</strong> <span class="status ${complaintData.status.toLowerCase()}">${complaintData.status}</span></p>
        <p><strong>Upload Date:</strong> ${new Date(complaintData.date).toISOString().split('T')[0]}</p>
        <img src="${complaintData.imageUrl}" alt="Complaint Image" style="max-width: 100%; margin-top: 10px;">
    `;

    document.getElementById("modal-complaint-details").innerHTML = modalContent;
    modal.style.display = "block";
}

// Function to Load Complaints from Backend
async function loadComplaints() {
    try {
        const response = await fetch('http://localhost:5000/getComplaints');
        const complaints = await response.json();

        const container = document.querySelector(".image-container");
        container.innerHTML = ''; // Clear existing complaints
        
        complaints.forEach(complaint => {
            const complaintItem = document.createElement("div");
            complaintItem.className = "complaint-item";
            complaintItem.setAttribute("tabindex", "0");

            complaintItem.innerHTML = `
                <div class="complaint-summary">
                    <img src="${complaint.imageUrl}" alt="Complaint Image">
                    <div class="complaint-details">
                        <p><strong>Upload Date:</strong> ${new Date(complaint.date).toISOString().split('T')[0]}</p>
                        <p><strong>Address:</strong> ${complaint.address}</p>
                        <p><strong>Uploader:</strong> ${complaint.uploaderName}</p>
                    </div>
                </div>
            `;

            // Store full complaint data with the element
            complaintItem.complaintData = complaint;

            // Add click event to show full details
            complaintItem.addEventListener('click', function() {
                openComplaintModal(this.complaintData);
            });

            container.appendChild(complaintItem);
        });

    } catch (error) {
        console.error('Error loading complaints:', error);
        alert('Failed to load complaints');
    }
}

// Function to Handle New Complaint Submission
async function handleComplaintSubmission(e) {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    
    // Collect form data
    const imageFile = document.getElementById("complaintImage").files[0];
    formData.append('complaintImage', imageFile);
    formData.append('uploaderName', document.getElementById("uploaderName").value);
    formData.append('address', document.getElementById("address").value);
    formData.append('contact', document.getElementById("contact").value);
    formData.append('email', document.getElementById("email").value);
    formData.append('description', document.getElementById("description").value);

    try {
        // Send complaint to backend
        const response = await fetch('http://localhost:5000/addComplaint', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to submit complaint');
        }

        // Reset form and close modal
        complaintForm.reset();
        addComplaintModal.style.display = "none";

        // Reload complaints to show the new one
        await loadComplaints();

        // Show success message
        alert('Complaint submitted successfully!');

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit complaint: ' + error.message);
    }
}

// Event Listeners for Modal Controls
function initializeModalEventListeners() {
    // Open add complaint modal
    addComplaintBtn.onclick = function() {
        addComplaintModal.style.display = "block";
    }

    // Close add complaint modal
    closeAddComplaintBtn.onclick = function() {
        addComplaintModal.style.display = "none";
    }

    // Close complaint details modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target == addComplaintModal) {
            addComplaintModal.style.display = "none";
        }
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Submit complaint form
    complaintForm.onsubmit = handleComplaintSubmission;
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load existing complaints
    loadComplaints();
    
    // Set up event listeners
    initializeModalEventListeners();
});