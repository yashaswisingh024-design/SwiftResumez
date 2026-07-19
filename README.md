# Interactive Resume Builder

A professional, modern, fully responsive Interactive Resume Builder built with HTML5, CSS3, and Vanilla JavaScript. 

## Features

- **Side-by-side Layout**: See your resume update instantly as you type.
- **Dynamic Sections**: Easily add or remove entries for Education, Experience, Projects, and Certifications.
- **Tags System**: Add predefined or custom skills, languages, and interests with smooth animations.
- **Live Preview**: Two-way binding ensures the preview is always up to date.
- **Auto Save & Load**: Your progress is automatically saved to Local Storage so you never lose your work.
- **Dark & Light Mode**: Toggle between a beautiful light glassmorphism theme and a sleek dark theme.
- **PDF Download**: Export your resume directly to a high-quality PDF.
- **Progress Bar**: Track your resume completion status.
- **Responsive Design**: Works perfectly on Desktop, Tablet, and Mobile.
- **No Frameworks**: Pure HTML, CSS, and Vanilla JavaScript.

## Setup Instructions

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Start building your resume!

## Directory Structure

```text
Interactive-Resume-Builder/
│
├── index.html       # Main HTML file containing structure
├── style.css        # Custom styles including Glassmorphism and animations
├── script.js        # Core logic for state, preview, and DOM manipulation
├── assets/          # Contains icons and images (empty by default, icons loaded via FontAwesome CDN)
│   ├── icons/
│   └── images/
├── README.md        # Documentation
```

## Technologies Used

- **HTML5**
- **CSS3** (CSS Variables, Flexbox, Grid, Animations, Media Queries)
- **Vanilla JavaScript** (ES6+)
- **html2canvas & jsPDF** (for PDF generation)
- **Google Fonts** (Inter)
- **FontAwesome** (Icons)

## How to use

- Fill out your personal information in the left column.
- Use the accordion sections to manage your data cleanly.
- Upload a profile photo.
- Add skills by clicking the suggestions or typing custom ones.
- When satisfied, click **Download PDF**.
- Click **Reset** to clear all data and start over (with a safety prompt).
