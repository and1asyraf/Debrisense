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
                applyBtn.innerHTML = 'Apply (Pending)';
            } else {
                applyBtn.classList.remove('pending');
                applyBtn.innerHTML = 'Apply';
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

// DebriSense Map Filters JavaScript
// Handles filter functionality for the enhanced dashboard

// Global filter state
let globalFilters = {
    state: '',
    river: '',
    pollutionTypes: [],
    dateRange: {
        start: '2024-07-01',
        end: '2024-10-15'
    },
    riskLevel: 'all' // all, low, moderate, high
};

// Initialize filter functionality
function initializeFilters() {
    console.log('🔧 Initializing map filters...');
    
    // Set up filter event listeners
    setupFilterEventListeners();
    
    // Initialize filter state
    updateFilterState();
    
    console.log('✅ Filters initialized');
}

// Set up filter event listeners
function setupFilterEventListeners() {
    // State filter
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) {
        stateFilter.addEventListener('change', function() {
            globalFilters.state = this.value;
            updateFilterState();
            console.log('📍 State filter changed to:', this.value);
        });
    }
    
    // River filter
    const riverFilter = document.getElementById('riverFilter');
    if (riverFilter) {
        riverFilter.addEventListener('change', function() {
            globalFilters.river = this.value;
            updateFilterState();
            console.log('🌊 River filter changed to:', this.value);
        });
    }
    
    // Pollution type filters
    const pollutionCheckboxes = [
        'plasticBottles', 'plasticBags', 'foodWrappers', 
        'straws', 'fishingGear', 'others'
    ];
    
    pollutionCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                updatePollutionTypeFilters();
                console.log('🗑️ Pollution type filter updated');
            });
        }
    });
    
    // Date range filters
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) {
        startDate.addEventListener('change', function() {
            globalFilters.dateRange.start = this.value;
            updateFilterState();
            console.log('📅 Start date changed to:', this.value);
        });
    }
    
    if (endDate) {
        endDate.addEventListener('change', function() {
            globalFilters.dateRange.end = this.value;
            updateFilterState();
            console.log('📅 End date changed to:', this.value);
        });
    }
}

// Update pollution type filters
function updatePollutionTypeFilters() {
    const pollutionTypes = {
        'plasticBottles': 'Plastic Bottles',
        'plasticBags': 'Plastic Bags',
        'foodWrappers': 'Food Wrappers',
        'straws': 'Straws',
        'fishingGear': 'Fishing Gear',
        'others': 'Others'
    };
    
    globalFilters.pollutionTypes = [];
    
    Object.keys(pollutionTypes).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            globalFilters.pollutionTypes.push(pollutionTypes[id]);
        }
    });
    
    updateFilterState();
}

// Update filter state and UI
function updateFilterState() {
    // Update filter status display
    updateFilterStatusDisplay();
    
    // Update filter button state
    updateFilterButtonState();
    
    // Log current filter state
    console.log('🔍 Current filter state:', globalFilters);
}

// Update filter status display
function updateFilterStatusDisplay() {
    const statusElement = document.getElementById('filterStatus');
    if (!statusElement) return;
    
    const activeFilters = [];
    
    if (globalFilters.state) {
        activeFilters.push(globalFilters.state);
    }
    
    if (globalFilters.river) {
        activeFilters.push(globalFilters.river);
    }
    
    if (globalFilters.pollutionTypes.length > 0 && globalFilters.pollutionTypes.length < 6) {
        activeFilters.push(`${globalFilters.pollutionTypes.length} pollution types`);
    }
    
    if (activeFilters.length > 0) {
        statusElement.textContent = `Filtered: ${activeFilters.join(' | ')}`;
        statusElement.className = 'text-primary fw-bold';
    } else {
        statusElement.textContent = 'Showing all data';
        statusElement.className = 'text-muted';
    }
}

// Update filter button state
function updateFilterButtonState() {
    const applyButton = document.querySelector('button[onclick="applyMapFilters()"]');
    if (!applyButton) return;
    
    // Check if any filters are active
    const hasActiveFilters = globalFilters.state || 
                           globalFilters.river || 
                           globalFilters.pollutionTypes.length < 6;
    
    if (hasActiveFilters) {
        applyButton.classList.add('btn-warning');
        applyButton.innerHTML = 'Apply';
    } else {
        applyButton.classList.remove('btn-warning');
        applyButton.innerHTML = 'Apply';
    }
}

// Get filtered data based on current filters
function getFilteredData(dataArray, filterType = 'zones') {
    if (!dataArray || !Array.isArray(dataArray)) {
        console.warn('⚠️ Invalid data array provided for filtering');
        return [];
    }
    
    return dataArray.filter(item => {
        // State filter
        if (globalFilters.state && item.state !== globalFilters.state) {
            return false;
        }
        
        // River filter
        if (globalFilters.river) {
            const riverField = filterType === 'zones' ? 'river_basin' : 'river';
            if (item[riverField] !== globalFilters.river) {
                return false;
            }
        }
        
        // Date range filter (if applicable)
        if (item.date || item.last_updated) {
            const itemDate = new Date(item.date || item.last_updated);
            const startDate = new Date(globalFilters.dateRange.start);
            const endDate = new Date(globalFilters.dateRange.end);
            
            if (itemDate < startDate || itemDate > endDate) {
                return false;
            }
        }
        
        // Pollution type filter (for reports and observations)
        if (filterType === 'reports' && globalFilters.pollutionTypes.length > 0) {
            const itemTypes = Object.keys(item.plastic_items || {});
            const hasMatchingType = itemTypes.some(type => 
                globalFilters.pollutionTypes.includes(type)
            );
            if (!hasMatchingType) {
                return false;
            }
        }
        
        return true;
    });
}

// Clear all filters
function clearAllFilters() {
    console.log('🧹 Clearing all filters...');
    
    // Reset filter state
    globalFilters = {
        state: '',
        river: '',
        pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Fishing Gear', 'Others'],
        dateRange: {
            start: '2024-07-01',
            end: '2024-10-15'
        },
        riskLevel: 'all'
    };
    
    // Reset UI elements
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) stateFilter.value = '';
    
    const riverFilter = document.getElementById('riverFilter');
    if (riverFilter) riverFilter.value = '';
    
    // Reset checkboxes
    const pollutionCheckboxes = [
        'plasticBottles', 'plasticBags', 'foodWrappers', 
        'straws', 'fishingGear', 'others'
    ];
    
    pollutionCheckboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = true;
    });
    
    // Reset date inputs
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) startDate.value = '2024-07-01';
    if (endDate) endDate.value = '2024-10-15';
    
    // Update UI
    updateFilterState();
    
    console.log('✅ All filters cleared');
}

// Export filter state
function exportFilterState() {
    const filterState = {
        timestamp: new Date().toISOString(),
        filters: globalFilters,
        description: 'DebriSense Map Filter Configuration'
    };
    
    const blob = new Blob([JSON.stringify(filterState, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debrisense_filters_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('💾 Filter state exported');
}

// Import filter state
function importFilterState(filterData) {
    try {
        if (typeof filterData === 'string') {
            filterData = JSON.parse(filterData);
        }
        
        if (filterData.filters) {
            globalFilters = { ...filterData.filters };
            applyImportedFilters();
            console.log('📥 Filter state imported successfully');
            return true;
        }
    } catch (error) {
        console.error('❌ Failed to import filter state:', error);
        return false;
    }
}

// Apply imported filters to UI
function applyImportedFilters() {
    // Apply state filter
    const stateFilter = document.getElementById('stateFilter');
    if (stateFilter) stateFilter.value = globalFilters.state;
    
    // Apply river filter
    const riverFilter = document.getElementById('riverFilter');
    if (riverFilter) riverFilter.value = globalFilters.river;
    
    // Apply pollution type filters
    const pollutionTypes = {
        'Plastic Bottles': 'plasticBottles',
        'Plastic Bags': 'plasticBags',
        'Food Wrappers': 'foodWrappers',
        'Straws': 'straws',
        'Fishing Gear': 'fishingGear',
        'Others': 'others'
    };
    
    Object.keys(pollutionTypes).forEach(type => {
        const checkboxId = pollutionTypes[type];
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = globalFilters.pollutionTypes.includes(type);
        }
    });
    
    // Apply date filters
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) startDate.value = globalFilters.dateRange.start;
    if (endDate) endDate.value = globalFilters.dateRange.end;
    
    // Update UI
    updateFilterState();
}

// Get filter summary for display
function getFilterSummary() {
    const summary = {
        totalFilters: 0,
        activeFilters: [],
        dataImpact: 'none'
    };
    
    if (globalFilters.state) {
        summary.totalFilters++;
        summary.activeFilters.push(`State: ${globalFilters.state}`);
    }
    
    if (globalFilters.river) {
        summary.totalFilters++;
        summary.activeFilters.push(`River: ${globalFilters.river}`);
    }
    
    if (globalFilters.pollutionTypes.length < 6) {
        summary.totalFilters++;
        summary.activeFilters.push(`${globalFilters.pollutionTypes.length} pollution types`);
    }
    
    // Determine data impact
    if (summary.totalFilters === 0) {
        summary.dataImpact = 'none';
    } else if (summary.totalFilters <= 2) {
        summary.dataImpact = 'moderate';
    } else {
        summary.dataImpact = 'high';
    }
    
    return summary;
}

// Initialize filters when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        initializeFilters();
    }, 500);
});

// Export functions for global use
window.filterFunctions = {
    clearAllFilters,
    exportFilterState,
    importFilterState,
    getFilterSummary,
    getFilteredData
}; 