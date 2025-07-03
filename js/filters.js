// DebriSense Filters JavaScript
// Handles filter interactions and data filtering logic

// Filter state management
class FilterManager {
    constructor() {
        this.filters = {
            season: 'Northeast Monsoon',
            state: '',
            river: '',
            pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear']
        };
        this.pendingFilters = { ...this.filters }; // Store pending filter changes
        this.filteredData = {
            cleanupReports: [],
            mlPredictions: [],
            observations: []
        };
    }

    // Apply filters to all data
    applyFilters() {
        this.filteredData.cleanupReports = this.filterCleanupReports();
        this.filteredData.mlPredictions = this.filterMLPredictions();
        this.filteredData.observations = this.filterObservations();
        
        // Trigger UI updates
        this.updateUI();
        
        // Update URL
        this.updateURL();
        
        console.log('Filters applied:', this.filters);
        console.log('Filtered data:', this.filteredData);
    }

    // Filter cleanup reports
    filterCleanupReports() {
        return mockData.cleanupReports.filter(report => {
            // Season filter (if applicable)
            if (this.filters.season && report.date) {
                const reportDate = new Date(report.date);
                const isNortheastMonsoon = reportDate.getMonth() >= 10 || reportDate.getMonth() <= 3;
                const reportSeason = isNortheastMonsoon ? 'Northeast Monsoon' : 'Southwest Monsoon';
                if (reportSeason !== this.filters.season) return false;
            }
            
            // State filter
            if (this.filters.state && report.state !== this.filters.state) {
                return false;
            }
            
            // River filter
            if (this.filters.river && report.river !== this.filters.river) {
                return false;
            }
            
            // Pollution type filter (check if any items match selected types)
            if (this.filters.pollutionTypes.length > 0) {
                const hasMatchingItems = this.filters.pollutionTypes.some(type => {
                    const itemKey = this.getPlasticItemKey(type);
                    return report.plastic_items[itemKey] > 0;
                });
                if (!hasMatchingItems) return false;
            }
            
            return true;
        });
    }

    // Filter ML predictions
    filterMLPredictions() {
        return mockData.mlPredictionZones.filter(prediction => {
            // Season filter
            if (this.filters.season && prediction.season !== this.filters.season) {
                return false;
            }
            
            // State filter
            if (this.filters.state && prediction.state !== this.filters.state) {
                return false;
            }
            
            // River filter
            if (this.filters.river && prediction.river_basin !== this.filters.river) {
                return false;
            }
            
            // Pollution type filter
            if (this.filters.pollutionTypes.length > 0) {
                const hasMatchingTypes = this.filters.pollutionTypes.some(type => 
                    prediction.top_pollution_types.includes(type)
                );
                if (!hasMatchingTypes) return false;
            }
            
            return true;
        });
    }

    // Filter observations
    filterObservations() {
        return mockData.pollutionObservations.filter(observation => {
            // State filter
            if (this.filters.state && observation.state !== this.filters.state) {
                return false;
            }
            
            // River filter
            if (this.filters.river && observation.river !== this.filters.river) {
                return false;
            }
            
            return true;
        });
    }

    // Get plastic item key from display name
    getPlasticItemKey(displayName) {
        const mapping = {
            'Plastic Bottles': 'plastic_bottles',
            'Plastic Bags': 'plastic_bags',
            'Food Wrappers': 'food_wrappers',
            'Straws': 'straws',
            'Cigarette Butts': 'cigarette_butts',
            'Fishing Gear': 'fishing_gear',
            'Others': 'others'
        };
        return mapping[displayName] || displayName.toLowerCase().replace(' ', '_');
    }

    // Update UI based on filtered data
    updateUI() {
        // Update stats
        this.updateStats();
        
        // Update tables
        this.updateTables();
        
        // Update charts
        this.updateCharts();
        
        // Update map
        this.updateMap();
    }

    // Update statistics
    updateStats() {
        const totalReports = this.filteredData.cleanupReports.length;
        const avgRiskScore = this.filteredData.mlPredictions.length > 0 
            ? (this.filteredData.mlPredictions.reduce((sum, p) => sum + p.predicted_risk_score, 0) / this.filteredData.mlPredictions.length).toFixed(2)
            : '0.00';
        const highRiskZones = this.filteredData.mlPredictions.filter(p => p.predicted_risk_score > 0.7).length;
        
        // Update DOM elements
        const elements = {
            totalReports: document.getElementById('totalReports'),
            avgRiskScore: document.getElementById('avgRiskScore'),
            highRiskZones: document.getElementById('highRiskZones')
        };
        
        if (elements.totalReports) elements.totalReports.textContent = totalReports;
        if (elements.avgRiskScore) elements.avgRiskScore.textContent = avgRiskScore;
        if (elements.highRiskZones) elements.highRiskZones.textContent = highRiskZones;
        
        // Update dashboard stats if on dashboard page
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }
        
        // Update recent activity table if on dashboard page
        if (typeof populateRecentActivity === 'function') {
            populateRecentActivity();
        }
    }

    // Update tables
    updateTables() {
        const reportsTable = document.getElementById('reportsTable');
        if (reportsTable) {
            this.updateReportsTable(reportsTable);
        }
    }

    // Update reports table
    updateReportsTable(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.filteredData.cleanupReports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.id}</td>
                <td>${report.location}</td>
                <td>${report.state}</td>
                <td>${report.river}</td>
                <td>${new Date(report.date).toLocaleDateString()}</td>
                <td>${this.getTotalItems(report.plastic_items)}</td>
                <td>${report.submitted_by}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewReportDetails('${report.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Get total items from plastic items object
    getTotalItems(plasticItems) {
        return Object.values(plasticItems).reduce((sum, count) => sum + count, 0);
    }

    // Update charts with filtered data
    updateCharts() {
        console.log('Updating charts with filtered data...');
        
        // Update insights charts if on insights page
        if (typeof updateChartsWithFilters === 'function') {
            console.log('Calling updateChartsWithFilters...');
            updateChartsWithFilters();
        }
        
        // Update dashboard charts if they exist
        if (typeof updateDashboardCharts === 'function') {
            console.log('Calling updateDashboardCharts...');
            updateDashboardCharts();
        }
        
        // Update any other chart functions
        if (typeof updateInsightsCharts === 'function') {
            console.log('Calling updateInsightsCharts...');
            updateInsightsCharts();
        }
        
        console.log('Charts update completed');
    }

    // Update map with filtered data
    updateMap() {
        console.log('Updating map with filtered data...');
        
        // Update dashboard map
        if (typeof updateMapWithFilters === 'function') {
            console.log('Calling updateMapWithFilters...');
            updateMapWithFilters();
        }
        
        // Update any other map functions
        if (typeof updateMapLayers === 'function') {
            console.log('Calling updateMapLayers...');
            updateMapLayers();
        }
        
        console.log('Map update completed');
    }

    // Update URL with current filters
    updateURL() {
        const params = new URLSearchParams();
        if (this.filters.season) params.set('season', this.filters.season);
        if (this.filters.state) params.set('state', this.filters.state);
        if (this.filters.river) params.set('river', this.filters.river);
        if (this.filters.pollutionTypes.length > 0) {
            params.set('types', this.filters.pollutionTypes.join(','));
        }
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newURL);
    }

    // Set pending filter value (doesn't apply immediately)
    setPendingFilter(type, value) {
        this.pendingFilters[type] = value;
        console.log('Pending filter set:', type, value);
        
        // Check if pending filters differ from current filters
        const hasChanges = JSON.stringify(this.pendingFilters) !== JSON.stringify(this.filters);
        this.updateApplyButtonState(hasChanges);
    }
    
    // Set filter value (immediate application)
    setFilter(type, value) {
        this.filters[type] = value;
        this.applyFilters();
    }
    
    // Apply pending filters
    applyPendingFilters() {
        this.filters = { ...this.pendingFilters };
        this.applyFilters();
        this.updateApplyButtonState(false); // Reset button state
        console.log('Pending filters applied:', this.filters);
    }

    // Clear all filters
    clearFilters() {
        this.filters = {
            season: 'Northeast Monsoon',
            state: '',
            river: '',
            pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear']
        };
        this.pendingFilters = { ...this.filters };
        
        // Reset form elements
        this.resetFormElements();
        
        this.applyFilters();
    }

    // Reset form elements
    resetFormElements() {
        const stateFilter = document.getElementById('stateFilter');
        const riverFilter = document.getElementById('riverFilter');
        
        if (stateFilter) stateFilter.value = '';
        if (riverFilter) riverFilter.value = '';
        
        // Reset checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
        
        // Reset season radio buttons
        const seasonInputs = document.querySelectorAll('input[name="season"]');
        seasonInputs[0].checked = true;
    }

    // Get filtered data
    getFilteredData() {
        return this.filteredData;
    }

    // Get current filters
    getFilters() {
        return this.filters;
    }
    
    // Update apply button state
    updateApplyButtonState(hasChanges) {
        const applyBtn = document.getElementById('applyFiltersBtn');
        if (applyBtn) {
            if (hasChanges) {
                applyBtn.classList.add('pending');
                applyBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Apply Filters (Pending)';
            } else {
                applyBtn.classList.remove('pending');
                applyBtn.innerHTML = '<i class="fas fa-filter me-2"></i>Apply Filters';
            }
        }
    }
}

// Initialize filter manager
const filterManager = new FilterManager();

// Export for global use
window.filterManager = filterManager;

// Initialize filter event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFilterEventListeners();
    // Apply initial filters (without pending state)
    filterManager.applyFilters();
});

// Initialize filter event listeners
function initializeFilterEventListeners() {
    // State filter
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) {
        stateFilter.addEventListener('change', function() {
            filterManager.setPendingFilter('state', this.value);
        });
    }
    
    // River filter
    const riverFilter = document.getElementById('riverFilter');
    if (riverFilter) {
        riverFilter.addEventListener('change', function() {
            filterManager.setPendingFilter('river', this.value);
        });
    }
    
    // Season radio buttons
    const seasonInputs = document.querySelectorAll('input[name="season"]');
    seasonInputs.forEach(input => {
        input.addEventListener('change', function() {
            filterManager.setPendingFilter('season', this.value);
        });
    });
    
    // Pollution type checkboxes
    const pollutionCheckboxes = document.querySelectorAll('#plasticBottles, #plasticBags, #foodWrappers, #straws, #cigaretteButts, #fishingGear');
    pollutionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedTypes = Array.from(pollutionCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            filterManager.setPendingFilter('pollutionTypes', checkedTypes);
        });
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterManager.clearFilters();
        });
    }
    
    console.log('Filter event listeners initialized');
}

// Global clear filters function (for onclick attribute)
function clearFilters() {
    filterManager.clearFilters();
}

// Global apply filters function (for onclick attribute)
function applyFilters() {
    filterManager.applyPendingFilters();
    
    // Get filter summary for notification
    const filters = filterManager.getFilters();
    const filteredData = filterManager.getFilteredData();
    
    let filterSummary = [];
    if (filters.state) filterSummary.push(`State: ${filters.state}`);
    if (filters.river) filterSummary.push(`River: ${filters.river}`);
    if (filters.season) filterSummary.push(`Season: ${filters.season}`);
    if (filters.pollutionTypes.length < 6) {
        filterSummary.push(`Types: ${filters.pollutionTypes.length} selected`);
    }
    
    const summary = filterSummary.length > 0 ? ` (${filterSummary.join(', ')})` : '';
    const message = `Filters applied! Showing ${filteredData.mlPredictions.length} zones${summary}`;
    
    // Show success notification
    if (typeof DebriSense !== 'undefined' && DebriSense.showNotification) {
        DebriSense.showNotification(message, 'success');
    } else {
        console.log(message);
    }
}

// View report details function
function viewReportDetails(reportId) {
    const report = mockData.cleanupReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Create modal content
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">Cleanup Report Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6">
                    <h6>Report Information</h6>
                    <p><strong>ID:</strong> ${report.id}</p>
                    <p><strong>Location:</strong> ${report.location}</p>
                    <p><strong>State:</strong> ${report.state}</p>
                    <p><strong>River:</strong> ${report.river}</p>
                    <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
                    <p><strong>Submitted by:</strong> ${report.submitted_by}</p>
                    <p><strong>Source:</strong> ${report.source}</p>
                </div>
                <div class="col-md-6">
                    <h6>Plastic Items Collected</h6>
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Plastic Bottles</span>
                            <span class="badge bg-primary">${report.plastic_items.plastic_bottles}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Plastic Bags</span>
                            <span class="badge bg-primary">${report.plastic_items.plastic_bags}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Straws</span>
                            <span class="badge bg-primary">${report.plastic_items.straws}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Food Wrappers</span>
                            <span class="badge bg-primary">${report.plastic_items.food_wrappers}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Others</span>
                            <span class="badge bg-primary">${report.plastic_items.others}</span>
                        </li>
                    </ul>
                    <div class="mt-3">
                        <strong>Total Items:</strong> ${filterManager.getTotalItems(report.plastic_items)}
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onclick="exportReport('${report.id}')">
                <i class="fas fa-download me-2"></i>Export Report
            </button>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('reportDetailsModal');
    if (modal) {
        modal.querySelector('.modal-content').innerHTML = modalContent;
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// Export single report
function exportReport(reportId) {
    const report = mockData.cleanupReports.find(r => r.id === reportId);
    if (!report) return;
    
    const csvContent = `Report ID,Location,State,River,Date,Plastic Bottles,Plastic Bags,Straws,Food Wrappers,Others,Total Items,Submitted By,Source
${report.id},${report.location},${report.state},${report.river},${report.date},${report.plastic_items.plastic_bottles},${report.plastic_items.plastic_bags},${report.plastic_items.straws},${report.plastic_items.food_wrappers},${report.plastic_items.others},${filterManager.getTotalItems(report.plastic_items)},${report.submitted_by},${report.source}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanup_report_${reportId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('Report exported successfully', 'success');
} 