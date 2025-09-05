# **App Name**: Snowflake Login

## Core Features:

- Login Interface: Provide a stylish login panel with fields for Username and Email. Display a 'System 2.0' note indicating that credentials must be in lowercase.
- Account Creation Request: Implement a 'Haven't Account' button leading to an account request form, including Username, Email, Captcha, and Terms & Conditions confirmation.
- Terms and Conditions Display: Show an account creation rules overlay that is initiated from the account creation form.
- Account Request Submission: On 'Create Account' clicked, submit username and email to Firebase database with a default 'pending' status. Inform the user their details await admin approval.
- Firebase Authentication: Implement Firebase Authentication with Realtime Database to authenticate users, manage account statuses (Pending, Approved, Banned, Deleted), and enforce login restrictions.
- Local Storage Management: Save the username and encrypted email ('api') to localStorage upon successful login, along with a successKey. Implement a mechanism to auto-fill username and email fields on subsequent visits.
- Security System: Continuously monitor user activity. This tool immediately bans accounts upon detection of suspicious activities (file access, harmful behavior, VPN/DNS/Virtual environment usage) and saves 'failedKey' in localStorage. Display a warning panel on login attempts of banned accounts, indicating the remaining ban time if applicable.

## Style Guidelines:

- Primary color: Deep sky blue (#4169E1) to reflect the 'Blue Colour stylish' and 'snow' request. This vibrant color provides a strong, engaging base.
- Background color: Light gray (#D3D3D3). Offers a subtle contrast to the primary blue, enhancing the snow and URA Network concepts without overpowering the interface.
- Accent color: Light cyan (#E0FFFF) adds brightness, and focuses attention on active elements, to give the feel of light reflecting on fresh-fallen snow.
- Body and headline font: 'Inter', a grotesque-style sans-serif font that gives a modern, objective and neutral appearance.
- Use security icons, globe icons and status icons for the authentication flow. Incorporate a 'Protected' lock icon next to 'Status Connected To Server 🌐'.
- Arrange the login elements and server status information to mimic a modern terminal interface. Include loading animations with three dots during security scans.
- Use smooth transitions for displaying messages (Security Check Completed, Account Banned), and subtle animations (snowflakes) to enhance user engagement. Employ animated icons during server connection and security scanning.