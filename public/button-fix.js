// Fixed button structure for admin panel
// Replace the problematic button line with this:

// FROM:
// <button class="btn btn-success" onclick="editUserAccount('${user.username}')">� Update</button>

// TO:
// <button class="btn btn-info view-mode-btn" id="view-btn-${user.username}" onclick="viewUserDetails('${user.username}')">👁️ View</button>

console.log("Button fix reference created");