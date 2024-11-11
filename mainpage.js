
// Get the modal
var modal = document.getElementById("complaint-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Function to open the modal with complaint details
// Update the openComplaintModal function
function openComplaintModal(complaintData) {
    const modalContent = `
        <h3>Complaint Details</h3>
        <p><strong>Name:</strong> ${complaintData.name}</p>
        <p><strong>Address:</strong> ${complaintData.address}</p>
        <p><strong>Contact Number:</strong> ${complaintData.contact}</p>
        <p><strong>Email:</strong> ${complaintData.email}</p>
        <p><strong>Description:</strong> ${complaintData.description}</p>
        <p><strong>Status:</strong> <span class="status ${complaintData.status.toLowerCase()}">${complaintData.status}</span></p>
        <p><strong>Upload Date:</strong> ${complaintData.date}</p>
        <img src="${complaintData.imageUrl}" alt="Complaint Image" style="max-width: 100%; margin-top: 10px;">
    `;

    document.getElementById("modal-complaint-details").innerHTML = modalContent;
    modal.style.display = "block";
}

// Add click event to all complaint items
document.querySelectorAll('.complaint-item').forEach(item => {
    item.addEventListener('click', function() {
        // If this is an existing complaint, create a mock complaintData object
        const complaintData = {
            name: "John Doe", // Replace with actual data if available
            address: this.querySelector('.complaint-details p:last-child').textContent.split(': ')[1],
            contact: "+1234567890", // Replace with actual data if available
            email: "john.doe@example.com", // Replace with actual data if available
            description: "This is a pre-existing complaint.", // Replace with actual data if available
            status: "Accepted", // Replace with actual status if available
            imageUrl: this.querySelector('img').src,
            date: this.querySelector('.complaint-details p:first-child').textContent.split(': ')[1]
        };
        openComplaintModal(complaintData);
    });
});

// Close the modal when clicking on <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Get the add complaint modal
var addComplaintModal = document.getElementById("add-complaint-modal");
var addComplaintBtn = document.getElementById("addComplaintBtn");
var closeAddComplaintBtn = document.getElementsByClassName("close-add-complaint")[0];
var complaintForm = document.getElementById("newComplaintForm");

// Open the add complaint modal
addComplaintBtn.onclick = function() {
    addComplaintModal.style.display = "block";
}

// Close the add complaint modal
closeAddComplaintBtn.onclick = function() {
    addComplaintModal.style.display = "none";
}

// Handle form submission
complaintForm.onsubmit = function(e) {
    e.preventDefault();

    // Get form values
    const imageFile = document.getElementById("complaintImage").files[0];
    const name = document.getElementById("uploaderName").value;
    const address = document.getElementById("address").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    const description = document.getElementById("description").value;

    // Create new complaint element
    const newComplaint = document.createElement("div");
    newComplaint.className = "complaint-item";
    newComplaint.setAttribute("tabindex", "0");

    // Create image URL
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : "https://via.placeholder.com/300x200/81C784/ffffff";

    // Current date
    const currentDate = new Date().toISOString().split('T')[0];

    // Store complaint data
    const complaintData = {
        name: name,
        address: address,
        contact: contact,
        email: email,
        description: description,
        status: "Pending",
        imageUrl: imageUrl,
        date: currentDate
    };

    newComplaint.innerHTML = `
        <div class="complaint-summary">
            <img src="${imageUrl}" alt="Complaint Image">
            <div class="complaint-details">
                <p><strong>Upload Date:</strong> ${currentDate}</p>
                <p><strong>Address:</strong> ${address}</p>
            </div>
        </div>
    `;

    // Store complaint data in the element
    newComplaint.complaintData = complaintData;

    // Add the new complaint to the container
    document.querySelector(".image-container").appendChild(newComplaint);

    // Clear form and close modal
    complaintForm.reset();
    addComplaintModal.style.display = "none";

    // Add click event listener to new complaint
    newComplaint.addEventListener('click', function() {
        openComplaintModal(this.complaintData);
    });
}




// Load complaints when page loads
document.addEventListener('DOMContentLoaded', loadComplaints);
// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == addComplaintModal) {
        addComplaintModal.style.display = "none";
    }
    if (event.target == modal) {
        modal.style.display = "none";
    }
}