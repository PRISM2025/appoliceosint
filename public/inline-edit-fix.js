// This is the corrected inline editing functionality
// Replace the displayUsers function with this code

function displayUsers(users) {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '';
  
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.id = `user-row-${user.username}`;
    row.innerHTML = `
      <td style="color: #555; font-weight: bold; text-align: center;">${index + 1}</td>
      <td style="color: #2c3e50; font-weight: bold;">
        <span class="display-field" id="username-display-${user.username}">${user.username}</span>
        <input type="text" class="edit-field" id="username-edit-${user.username}" value="${user.username}" style="display: none; width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
      </td>
      <td style="color: #7f8c8d;">
        <span class="display-field" id="password-display-${user.username}">••••••••</span>
        <input type="password" class="edit-field" id="password-edit-${user.username}" placeholder="Enter new password" style="display: none; width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
      </td>
      <td style="color: #34495e;">
        <span class="display-field" id="security-display-${user.username}">${user.securityQuestion || '<span style="color: #e74c3c; font-style: italic;">Not set</span>'}</span>
        <select class="edit-field" id="security-edit-${user.username}" style="display: none; width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
          <option value="">Select a security question</option>
          <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
          <option value="What city were you born in?">What city were you born in?</option>
          <option value="What is your favorite color?">What is your favorite color?</option>
          <option value="What is your pet's name?">What is your pet's name?</option>
          <option value="What is your favorite movie?">What is your favorite movie?</option>
          <option value="What was your first school's name?">What was your first school's name?</option>
          <option value="What is your father's middle name?">What is your father's middle name?</option>
        </select>
      </td>
      <td>
        <div class="admin-actions">
          <button class="btn btn-primary edit-mode-btn" id="edit-btn-${user.username}" onclick="enableInlineEdit('${user.username}')">✏️ Edit</button>
          <button class="btn btn-success update-mode-btn" id="update-btn-${user.username}" onclick="saveInlineEdit('${user.username}')" style="display: none;">💾 Save</button>
          <button class="btn btn-warning cancel-mode-btn" id="cancel-btn-${user.username}" onclick="cancelInlineEdit('${user.username}')" style="display: none;">❌ Cancel</button>
          <button class="btn btn-danger" onclick="deleteUser('${user.username}')">🗑️ Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
    
    // Set the selected security question after adding to DOM
    setTimeout(() => {
      const securitySelect = document.getElementById(`security-edit-${user.username}`);
      if (user.securityQuestion && securitySelect) {
        securitySelect.value = user.securityQuestion;
      }
    }, 0);
  });
}