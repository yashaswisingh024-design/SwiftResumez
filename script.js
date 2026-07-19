// --- State & DOM Elements ---
const STORAGE_KEY = 'resume_builder_data';

let resumeData = {
    personal: {},
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    skills: [],
    languages: [],
    interests: []
};

// Predefined Skills
const suggestedSkills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB', 'Git', 'Firebase'];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadData();
    setupAccordions();
    setupLivePreview();
    setupDynamicSections();
    setupTags();
    setupPhotoUpload();
    setupThemeToggle();
    setupClearData();
    setupPdfDownload();
    setupScrollTop();
    updateProgressBar();
    renderAllPreviews();
}

// --- Local Storage Auto Save/Load ---
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    updateProgressBar();
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        resumeData = JSON.parse(saved);
        populateForm();
    }
}

function populateForm() {
    // Personal Info
    const simpleInputs = ['fullName', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'github', 'portfolio', 'summary'];
    simpleInputs.forEach(id => {
        if (resumeData.personal[id]) {
            const el = document.getElementById(id);
            if(el) {
                el.value = resumeData.personal[id];
                if(id === 'summary') updateCharCount();
            }
        }
    });

    if (resumeData.personal.profilePhoto) {
        const previewImg = document.getElementById('preview-photo');
        const previewContainer = document.getElementById('preview-photo-container');
        previewImg.src = resumeData.personal.profilePhoto;
        previewImg.style.display = 'block';
        previewContainer.style.display = 'block';
    }

    // Dynamic Lists
    resumeData.education.forEach(item => addEducationItem(item));
    resumeData.experience.forEach(item => addExperienceItem(item));
    resumeData.projects.forEach(item => addProjectItem(item));
    resumeData.certifications.forEach(item => addCertItem(item));

    // Tags
    renderTags('selected-skills-container', resumeData.skills, 'skills');
    renderTags('selected-langs-container', resumeData.languages, 'languages');
    renderTags('selected-interests-container', resumeData.interests, 'interests');
}

// --- Accordions ---
function setupAccordions() {
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('click', () => {
            const parent = title.parentElement;
            parent.classList.toggle('active');
        });
    });
}

// --- Live Preview & Validation ---
function setupLivePreview() {
    const inputs = document.querySelectorAll('input[data-preview], textarea[data-preview]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const previewId = e.target.getAttribute('data-preview');
            const val = e.target.value;
            const elementId = e.target.id;
            
            resumeData.personal[elementId] = val;
            
            // Update DOM
            const previewEl = document.getElementById(previewId);
            if (previewEl) {
                previewEl.textContent = val;
            }

            // Handle icons visibility for links
            if (['linkedin', 'github', 'portfolio'].includes(elementId)) {
                const container = document.getElementById(`${previewId}-container`);
                if (container) container.style.display = val ? 'inline-flex' : 'none';
            }
            
            // Validation & Counters
            if (elementId === 'email') validateEmail(val);
            if (elementId === 'phone') validatePhone(val);
            if (elementId === 'summary') updateCharCount();

            saveData();
        });
    });
}

function validateEmail(email) {
    const errorEl = document.getElementById('email-error');
    if (!email) { errorEl.textContent = ''; return; }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    errorEl.textContent = regex.test(email) ? '' : '(Invalid Email)';
}

function validatePhone(phone) {
    const errorEl = document.getElementById('phone-error');
    if (!phone) { errorEl.textContent = ''; return; }
    const regex = /^[\d\+\-\s\(\)]+$/;
    errorEl.textContent = regex.test(phone) ? '' : '(Invalid Phone)';
}

function updateCharCount() {
    const summary = document.getElementById('summary');
    const counter = document.getElementById('summary-counter');
    const length = summary.value.length;
    counter.textContent = length;
    if (length > 500) {
        counter.style.color = 'var(--danger)';
    } else {
        counter.style.color = 'inherit';
    }
}

// --- Profile Photo ---
function setupPhotoUpload() {
    const fileInput = document.getElementById('profilePhoto');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                resumeData.personal.profilePhoto = dataUrl;
                
                const previewImg = document.getElementById('preview-photo');
                const previewContainer = document.getElementById('preview-photo-container');
                previewImg.src = dataUrl;
                previewImg.style.display = 'block';
                previewContainer.style.display = 'block';
                
                saveData();
            }
            reader.readAsDataURL(file);
        }
    });
}

// --- Dynamic Sections (Edu, Exp, Proj, Cert) ---
function setupDynamicSections() {
    document.getElementById('btn-add-education').addEventListener('click', () => addEducationItem());
    document.getElementById('btn-add-experience').addEventListener('click', () => addExperienceItem());
    document.getElementById('btn-add-project').addEventListener('click', () => addProjectItem());
    document.getElementById('btn-add-cert').addEventListener('click', () => addCertItem());
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Education
function addEducationItem(data = null) {
    const id = data ? data.id : generateId();
    if (!data) {
        data = { id, degree: '', institution: '', startYear: '', endYear: '', grade: '' };
        resumeData.education.push(data);
    }

    const html = `
        <div class="dynamic-item" id="edu-${id}">
            <div class="dynamic-item-header">
                <h4>Education Entry</h4>
                <button class="btn-remove" onclick="removeDynamicItem('education', '${id}', 'edu-${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="input-grid">
                <div class="input-group">
                    <label>Degree / Program</label>
                    <input type="text" value="${data.degree}" oninput="updateDynamicItem('education', '${id}', 'degree', this.value)">
                </div>
                <div class="input-group">
                    <label>Institution</label>
                    <input type="text" value="${data.institution}" oninput="updateDynamicItem('education', '${id}', 'institution', this.value)">
                </div>
                <div class="input-group">
                    <label>Start Year</label>
                    <input type="text" value="${data.startYear}" oninput="updateDynamicItem('education', '${id}', 'startYear', this.value)">
                </div>
                <div class="input-group">
                    <label>End Year</label>
                    <input type="text" value="${data.endYear}" oninput="updateDynamicItem('education', '${id}', 'endYear', this.value)">
                </div>
                <div class="input-group">
                    <label>Grade / CGPA</label>
                    <input type="text" value="${data.grade}" oninput="updateDynamicItem('education', '${id}', 'grade', this.value)">
                </div>
            </div>
        </div>
    `;
    document.getElementById('education-container').insertAdjacentHTML('beforeend', html);
    renderAllPreviews();
}

// Experience
function addExperienceItem(data = null) {
    const id = data ? data.id : generateId();
    if (!data) {
        data = { id, title: '', company: '', location: '', startDate: '', endDate: '', desc: '' };
        resumeData.experience.push(data);
    }

    const html = `
        <div class="dynamic-item" id="exp-${id}">
            <div class="dynamic-item-header">
                <h4>Experience Entry</h4>
                <button class="btn-remove" onclick="removeDynamicItem('experience', '${id}', 'exp-${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="input-grid">
                <div class="input-group">
                    <label>Job Title</label>
                    <input type="text" value="${data.title}" oninput="updateDynamicItem('experience', '${id}', 'title', this.value)">
                </div>
                <div class="input-group">
                    <label>Company</label>
                    <input type="text" value="${data.company}" oninput="updateDynamicItem('experience', '${id}', 'company', this.value)">
                </div>
                <div class="input-group">
                    <label>Location</label>
                    <input type="text" value="${data.location}" oninput="updateDynamicItem('experience', '${id}', 'location', this.value)">
                </div>
                <div class="input-group">
                    <label>Start - End Date</label>
                    <input type="text" value="${data.startDate}" oninput="updateDynamicItem('experience', '${id}', 'startDate', this.value)" placeholder="e.g. Jan 2020 - Present">
                </div>
            </div>
            <div class="input-group mt-3">
                <label>Responsibilities</label>
                <textarea rows="3" oninput="updateDynamicItem('experience', '${id}', 'desc', this.value)">${data.desc}</textarea>
            </div>
        </div>
    `;
    document.getElementById('experience-container').insertAdjacentHTML('beforeend', html);
    renderAllPreviews();
}

// Projects
function addProjectItem(data = null) {
    const id = data ? data.id : generateId();
    if (!data) {
        data = { id, name: '', tech: '', link: '', desc: '' };
        resumeData.projects.push(data);
    }
    const html = `
        <div class="dynamic-item" id="proj-${id}">
            <div class="dynamic-item-header">
                <h4>Project Entry</h4>
                <button class="btn-remove" onclick="removeDynamicItem('projects', '${id}', 'proj-${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="input-grid">
                <div class="input-group">
                    <label>Project Name</label>
                    <input type="text" value="${data.name}" oninput="updateDynamicItem('projects', '${id}', 'name', this.value)">
                </div>
                <div class="input-group">
                    <label>Technologies</label>
                    <input type="text" value="${data.tech}" oninput="updateDynamicItem('projects', '${id}', 'tech', this.value)">
                </div>
                <div class="input-group">
                    <label>Link (GitHub/Live)</label>
                    <input type="text" value="${data.link}" oninput="updateDynamicItem('projects', '${id}', 'link', this.value)">
                </div>
            </div>
            <div class="input-group mt-3">
                <label>Description</label>
                <textarea rows="2" oninput="updateDynamicItem('projects', '${id}', 'desc', this.value)">${data.desc}</textarea>
            </div>
        </div>
    `;
    document.getElementById('projects-container').insertAdjacentHTML('beforeend', html);
    renderAllPreviews();
}

// Certifications
function addCertItem(data = null) {
    const id = data ? data.id : generateId();
    if (!data) {
        data = { id, name: '', org: '', year: '' };
        resumeData.certifications.push(data);
    }
    const html = `
        <div class="dynamic-item" id="cert-${id}">
            <div class="dynamic-item-header">
                <h4>Certification Entry</h4>
                <button class="btn-remove" onclick="removeDynamicItem('certifications', '${id}', 'cert-${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="input-grid">
                <div class="input-group">
                    <label>Certificate Name</label>
                    <input type="text" value="${data.name}" oninput="updateDynamicItem('certifications', '${id}', 'name', this.value)">
                </div>
                <div class="input-group">
                    <label>Organization</label>
                    <input type="text" value="${data.org}" oninput="updateDynamicItem('certifications', '${id}', 'org', this.value)">
                </div>
                <div class="input-group">
                    <label>Year</label>
                    <input type="text" value="${data.year}" oninput="updateDynamicItem('certifications', '${id}', 'year', this.value)">
                </div>
            </div>
        </div>
    `;
    document.getElementById('certifications-container').insertAdjacentHTML('beforeend', html);
    renderAllPreviews();
}


// Shared Dynamic Update/Remove
window.updateDynamicItem = function(section, id, field, value) {
    const index = resumeData[section].findIndex(item => item.id === id);
    if (index > -1) {
        resumeData[section][index][field] = value;
        saveData();
        renderAllPreviews();
    }
}

window.removeDynamicItem = function(section, id, elementId) {
    resumeData[section] = resumeData[section].filter(item => item.id !== id);
    document.getElementById(elementId).remove();
    saveData();
    renderAllPreviews();
}

// --- Tags (Skills, Languages, Interests) ---
function setupTags() {
    // Populate suggested skills
    const suggContainer = document.getElementById('suggested-skills');
    suggestedSkills.forEach(skill => {
        const btn = document.createElement('button');
        btn.className = 'tag suggested-tag';
        btn.textContent = '+ ' + skill;
        btn.onclick = () => addTag('skills', skill, 'selected-skills-container');
        suggContainer.appendChild(btn);
    });

    // Add via input
    document.getElementById('btn-add-skill').onclick = () => {
        const input = document.getElementById('skill-input');
        if (input.value.trim()) { addTag('skills', input.value.trim(), 'selected-skills-container'); input.value = ''; }
    };
    document.getElementById('btn-add-lang').onclick = () => {
        const input = document.getElementById('lang-input');
        if (input.value.trim()) { addTag('languages', input.value.trim(), 'selected-langs-container'); input.value = ''; }
    };
    document.getElementById('btn-add-interest').onclick = () => {
        const input = document.getElementById('interest-input');
        if (input.value.trim()) { addTag('interests', input.value.trim(), 'selected-interests-container'); input.value = ''; }
    };
}

function addTag(category, value, containerId) {
    if (!resumeData[category].includes(value)) {
        resumeData[category].push(value);
        renderTags(containerId, resumeData[category], category);
        saveData();
        renderAllPreviews();
    }
}

window.removeTag = function(category, value, containerId) {
    resumeData[category] = resumeData[category].filter(v => v !== value);
    renderTags(containerId, resumeData[category], category);
    saveData();
    renderAllPreviews();
}

function renderTags(containerId, items, category) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerHTML = `${item} <button class="remove-tag" onclick="removeTag('${category}', '${item}', '${containerId}')"><i class="fa-solid fa-xmark"></i></button>`;
        container.appendChild(span);
    });
}


// --- Preview Rendering ---
function renderAllPreviews() {
    renderEducationPreview();
    renderExperiencePreview();
    renderProjectsPreview();
    renderCertificationsPreview();
    renderListPreview('skills', 'preview-skills-list', 'section-skills');
    renderListPreview('languages', 'preview-languages-list', 'section-languages');
    renderListPreview('interests', 'preview-interests-list', 'section-interests');
    
    // Initial static fields rendering if empty
    const simpleInputs = ['fullName', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'github', 'portfolio', 'summary'];
    simpleInputs.forEach(id => {
        const previewEl = document.getElementById(`preview-${id}`);
        const dataVal = resumeData.personal[id];
        if (previewEl && dataVal) {
             previewEl.textContent = dataVal;
        }
        if (['linkedin', 'github', 'portfolio'].includes(id)) {
            const container = document.getElementById(`preview-${id}-container`);
            if (container) container.style.display = dataVal ? 'inline-flex' : 'none';
        }
    });
}

function renderEducationPreview() {
    const container = document.getElementById('preview-education-list');
    const section = document.getElementById('section-education');
    container.innerHTML = '';
    if (resumeData.education.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    
    resumeData.education.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resume-item';
        div.innerHTML = `
            <div class="resume-item-header">
                <div class="resume-item-title">${item.degree || 'Degree'}</div>
                <div class="resume-item-date">${item.startYear} ${item.startYear || item.endYear ? '-' : ''} ${item.endYear}</div>
            </div>
            <div class="resume-item-subtitle">${item.institution || 'Institution'}${item.grade ? ` | ${item.grade}` : ''}</div>
        `;
        container.appendChild(div);
    });
}

function renderExperiencePreview() {
    const container = document.getElementById('preview-experience-list');
    const section = document.getElementById('section-experience');
    container.innerHTML = '';
    if (resumeData.experience.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    
    resumeData.experience.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resume-item';
        div.innerHTML = `
            <div class="resume-item-header">
                <div class="resume-item-title">${item.title || 'Job Title'}</div>
                <div class="resume-item-date">${item.startDate}</div>
            </div>
            <div class="resume-item-subtitle">${item.company || 'Company'}${item.location ? ` | ${item.location}` : ''}</div>
            ${item.desc ? `<p class="resume-text">${item.desc.replace(/\n/g, '<br>')}</p>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderProjectsPreview() {
    const container = document.getElementById('preview-projects-list');
    const section = document.getElementById('section-projects');
    container.innerHTML = '';
    if (resumeData.projects.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    
    resumeData.projects.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resume-item';
        div.innerHTML = `
            <div class="resume-item-header">
                <div class="resume-item-title">${item.name || 'Project Name'}</div>
                ${item.link ? `<div class="resume-item-date"><a href="${item.link}" target="_blank" style="color:var(--accent-primary);text-decoration:none;">Link</a></div>` : ''}
            </div>
            <div class="resume-item-subtitle">${item.tech || 'Technologies'}</div>
            ${item.desc ? `<p class="resume-text">${item.desc}</p>` : ''}
        `;
        container.appendChild(div);
    });
}

function renderCertificationsPreview() {
    const container = document.getElementById('preview-certifications-list');
    const section = document.getElementById('section-certifications');
    container.innerHTML = '';
    if (resumeData.certifications.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    
    resumeData.certifications.forEach(item => {
        const div = document.createElement('div');
        div.className = 'resume-item';
        div.innerHTML = `
            <div class="resume-item-header">
                <div class="resume-item-title">${item.name || 'Certificate'}</div>
                <div class="resume-item-date">${item.year}</div>
            </div>
            <div class="resume-item-subtitle">${item.org || 'Organization'}</div>
        `;
        container.appendChild(div);
    });
}

function renderListPreview(dataKey, containerId, sectionId) {
    const container = document.getElementById(containerId);
    const section = document.getElementById(sectionId);
    container.innerHTML = '';
    
    if (resumeData[dataKey].length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    resumeData[dataKey].forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        container.appendChild(li);
    });
}


// --- Progress Bar ---
function updateProgressBar() {
    // Simple heuristic: count total available fields vs filled fields
    let totalFields = 9; // Basic personal info fields
    let filledFields = 0;

    const simpleInputs = ['fullName', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'github', 'portfolio', 'summary'];
    simpleInputs.forEach(id => {
        if (resumeData.personal[id] && resumeData.personal[id].trim() !== '') filledFields++;
    });

    if (resumeData.education.length > 0) filledFields += 2;
    if (resumeData.experience.length > 0) filledFields += 2;
    if (resumeData.skills.length > 0) filledFields += 2;
    
    totalFields += 6; // Representing dynamic sections

    const percentage = Math.min(100, Math.round((filledFields / totalFields) * 100));
    
    document.getElementById('progress-percentage').textContent = `${percentage}%`;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}


// --- Theme Toggle ---
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.documentElement;
    const icon = toggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fa-solid fa-sun';
    }

    toggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            icon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            icon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// --- Clear Data ---
function setupClearData() {
    const btnClear = document.getElementById('btn-clear');
    const modal = document.getElementById('confirmation-modal');
    const btnConfirm = document.getElementById('btn-confirm-clear');
    const btnCancel = document.getElementById('btn-cancel-clear');

    btnClear.addEventListener('click', () => {
        modal.classList.add('active');
    });

    btnCancel.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    btnConfirm.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload(); // Quickest way to clear everything and re-init
    });
}

// --- PDF Download ---
function setupPdfDownload() {
    document.getElementById('btn-download').addEventListener('click', async () => {
        const resumeElement = document.getElementById('resume-preview');
        
        // Temporarily adjust scale if it was scaled down by CSS
        const originalTransform = resumeElement.style.transform;
        resumeElement.style.transform = 'scale(1)';
        
        showToast('Generating PDF... Please wait.', 'success');

        try {
            const canvas = await html2canvas(resumeElement, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData.personal.fullName || 'Resume'}.pdf`);
            
            showToast('Resume downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast('Error generating PDF.', 'error');
        } finally {
            resumeElement.style.transform = originalTransform;
        }
    });
}

// --- Toast Notifications ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-check-circle" style="color:var(--success)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger)"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Scroll to Top ---
function setupScrollTop() {
    const btn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
