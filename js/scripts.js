document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');
    const issueList = document.getElementById('issueList');
    const issues = JSON.parse(localStorage.getItem('issues')) || [];

    // Display existing issues on page load
    if (issueList) {
        displayIssues();
    }

    reportForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const issueType = document.getElementById('issueType').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;
        const photoInput = document.getElementById('photo');
        const photo = photoInput.files[0];

        if (photo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const issue = {
                    type: issueType,
                    description: description,
                    location: location,
                    date: new Date().toLocaleString(),
                    photo: e.target.result
                };

                issues.push(issue);
                localStorage.setItem('issues', JSON.stringify(issues));
                displayIssues();
                clearForm(reportForm);
            };
            reader.readAsDataURL(photo);
        } else {
            const issue = {
                type: issueType,
                description: description,
                location: location,
                date: new Date().toLocaleString()
            };

            issues.push(issue);
            localStorage.setItem('issues', JSON.stringify(issues));
            displayIssues();
            clearForm(reportForm);
        }
    });

    function displayIssues() {
        issueList.innerHTML = '';
        issues.forEach(issue => {
            const issueItem = document.createElement('div');
            issueItem.className = 'issueItem';
            issueItem.innerHTML = `
                <h3>${issue.type}</h3>
                <p>${issue.description}</p>
                <p><strong>Location:</strong> ${issue.location}</p>
                <p><small>Reported on: ${issue.date}</small></p>
            `;

            if (issue.photo) {
                const img = document.createElement('img');
                img.src = issue.photo;
                img.alt = 'Issue Photo';
                issueItem.appendChild(img);
            }

            issueList.appendChild(issueItem);
        });
    }

    function clearForm(form) {
        form.reset();
    }

    window.getCurrentLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const locationInput = document.getElementById('location');
                locationInput.value = `Lat: ${latitude}, Lon: ${longitude}`;
            }, () => {
                alert('Geolocation is not supported by this browser.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };
});
