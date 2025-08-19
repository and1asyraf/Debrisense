// DebriSense Main JavaScript
// TODO: Replace with real API calls and backend integration

// Global variables
let currentFilters = {
    season: 'Northeast Monsoon',
    state: '',
    river: '',
    pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear']
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DebriSense Dashboard Initialized');
    
    // Load components
    loadComponents();
    
    // Initialize filters
    initializeFilters();
    
    // Update stats
    updateQuickStats();
    
    // Set active navigation
    setActiveNavigation();
    
    // TODO: Initialize charts if on insights page
    if (window.location.pathname.includes('insights.html')) {
        initializeCharts();
    }
    
    // TODO: Initialize map if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeMap();
    }
});

// Load shared components
function loadComponents() {
    // Load navbar (if placeholder exists)
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('components/navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarPlaceholder.innerHTML = html;
                // Add custom CSS for dropdown positioning
                addDropdownStyles();
            })
            .catch(error => console.error('Error loading navbar:', error));
    }
    
    // Load sidebar (if placeholder exists)
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        fetch('components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
    
    // Load footer (if placeholder exists)
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// Initialize filters
function initializeFilters() {
    // Season filter
    const seasonInputs = document.querySelectorAll('input[name="season"]');
    seasonInputs.forEach(input => {
        input.addEventListener('change', function() {
            currentFilters.season = this.value;
            applyFilters();
        });
    });
    
    // State filter
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) {
        stateFilter.addEventListener('change', function() {
            currentFilters.state = this.value;
            applyFilters();
        });
    }
    
    // River filter
    const riverFilter = document.getElementById('riverFilter');
    if (riverFilter) {
        riverFilter.addEventListener('change', function() {
            currentFilters.river = this.value;
            applyFilters();
        });
    }
    
    // Pollution type filters
    const pollutionCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    pollutionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePollutionTypeFilters();
            applyFilters();
        });
    });
}

// Update pollution type filters
function updatePollutionTypeFilters() {
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    currentFilters.pollutionTypes = Array.from(checkedBoxes).map(cb => cb.value);
}

// Apply filters to current page
function applyFilters() {
    console.log('Applying filters:', currentFilters);
    
    // Update URL with filter parameters
    updateURLWithFilters();
    
    // Apply filters based on current page
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('dashboard.html')) {
        updateMapWithFilters();
    } else if (currentPage.includes('insights.html')) {
        updateChartsWithFilters();
    } else if (currentPage.includes('reports.html')) {
        updateReportsWithFilters();
    } else if (currentPage.includes('tools.html')) {
        updateToolsWithFilters();
    }
    
    // Update quick stats
    updateQuickStats();
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        season: 'Northeast Monsoon',
        state: '',
        river: '',
        pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear']
    };
    
    // Reset form elements
    document.getElementById('stateFilter').value = '';
    document.getElementById('riverFilter').value = '';
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    
    const seasonInputs = document.querySelectorAll('input[name="season"]');
    seasonInputs[0].checked = true;
    
    applyFilters();
}

// Update URL with current filters
function updateURLWithFilters() {
    const params = new URLSearchParams();
    if (currentFilters.season) params.set('season', currentFilters.season);
    if (currentFilters.state) params.set('state', currentFilters.state);
    if (currentFilters.river) params.set('river', currentFilters.river);
    if (currentFilters.pollutionTypes.length > 0) {
        params.set('types', currentFilters.pollutionTypes.join(','));
    }
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newURL);
}

// Update quick stats
function updateQuickStats() {
    // TODO: Calculate real stats based on filtered data
    const totalReports = mockData.cleanupReports.length;
    const avgRiskScore = (mockData.mlPredictionZones.reduce((sum, zone) => sum + zone.predicted_risk_score, 0) / mockData.mlPredictionZones.length).toFixed(2);
    const highRiskZones = mockData.mlPredictionZones.filter(zone => zone.predicted_risk_score > 0.7).length;
    
    // Update DOM elements
    const totalReportsEl = document.getElementById('totalReports');
    const avgRiskScoreEl = document.getElementById('avgRiskScore');
    const highRiskZonesEl = document.getElementById('highRiskZones');
    
    if (totalReportsEl) totalReportsEl.textContent = totalReports;
    if (avgRiskScoreEl) avgRiskScoreEl.textContent = avgRiskScore;
    if (highRiskZonesEl) highRiskZonesEl.textContent = highRiskZones;
}

// Set active navigation
function setActiveNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') && currentPage.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Admin functions
function toggleSeason() {
    const newSeason = currentFilters.season === 'Northeast Monsoon' ? 'Southwest Monsoon' : 'Northeast Monsoon';
    currentFilters.season = newSeason;
    
    // Update radio button
    const seasonInputs = document.querySelectorAll('input[name="season"]');
    seasonInputs.forEach(input => {
        if (input.value === newSeason) {
            input.checked = true;
        }
    });
    
    applyFilters();
    showNotification(`Season switched to ${newSeason}`, 'info');
}

function exportAllData() {
    // TODO: Implement real export functionality
    const dataToExport = {
        filters: currentFilters,
        cleanupReports: mockData.cleanupReports,
        mlPredictions: mockData.mlPredictionZones,
        observations: mockData.pollutionObservations
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debrisense_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully', 'success');
}

function resetMockData() {
    // TODO: Implement data reset functionality
    showNotification('Mock data reset', 'warning');
    location.reload();
}

function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Show logout notification
        showNotification('Logging out...', 'info');
        
        // Clear any stored session data (if any)
        localStorage.removeItem('debrisense_user');
        sessionStorage.clear();
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Add custom styles for dropdown positioning
function addDropdownStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-menu-end {
            right: 0 !important;
            left: auto !important;
        }
        
        @media (max-width: 768px) {
            .dropdown-menu-end {
                right: auto !important;
                left: 0 !important;
                min-width: 200px;
            }
        }
        
        .navbar-nav .dropdown-menu {
            margin-top: 0.5rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 9999 !important;
        }
        
        .dropdown-menu {
            z-index: 9999 !important;
        }
        
        .navbar-nav .dropdown {
            z-index: 9999 !important;
        }
        
        /* Ensure dropdown items are also on top */
        .dropdown-item {
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);
}

// Show notification
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Placeholder functions for page-specific functionality
function initializeCharts() {
    // TODO: Initialize Chart.js charts
    console.log('Charts initialized');
}

function initializeMap() {
    // TODO: Initialize Leaflet map
    console.log('Map initialized');
}

function updateMapWithFilters() {
    // TODO: Update map with current filters
    console.log('Map updated with filters');
}

function updateChartsWithFilters() {
    // TODO: Update charts with current filters
    console.log('Charts updated with filters');
}

function updateReportsWithFilters() {
    // TODO: Update reports table with current filters
    console.log('Reports updated with filters');
}

function updateToolsWithFilters() {
    // TODO: Update tools with current filters
    console.log('Tools updated with filters');
}

// Export functions for use in other files
window.DebriSense = {
    currentFilters,
    applyFilters,
    clearFilters,
    showNotification,
    exportAllData,
    resetMockData,
    toggleSeason,
    logout
}; 