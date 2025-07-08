// DebriSense Reports JavaScript
// Handles cleanup reports management, charts, and data visualization

let reportsCharts = {};
let currentReports = [];
let selectedReport = null;

// Initialize reports when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports page initialized');
    
    // Initialize after components are loaded
    setTimeout(() => {
        initializeReports();
        setupSearchAndSort();
        initializeCharts();
        populateObservations();
    }, 1000);
});

// Initialize reports functionality
function initializeReports() {
    console.log('Initializing reports...');
    
    currentReports = [...mockData.cleanupReports];
    populateReportsTable();
    updateSummaryStats();
    
    // Test jsPDF availability
    setTimeout(() => {
        if (typeof window.jspdf !== 'undefined') {
            console.log('jsPDF library loaded successfully');
        } else {
            console.warn('jsPDF library not available - PDF export will fall back to CSV');
        }
    }, 2000);
    
    console.log('Reports initialized successfully');
}

// Populate reports table
function populateReportsTable() {
    const tableBody = document.getElementById('reportsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = currentReports.map(report => `
        <tr>
            <td><strong>${report.id}</strong></td>
            <td>${new Date(report.date).toLocaleDateString()}</td>
            <td>${report.location}</td>
            <td>${report.state}</td>
            <td>${report.river}</td>
            <td>${getTotalItems(report.plastic_items)}</td>
            <td>${report.submitted_by}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="viewReportDetails('${report.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" onclick="exportSingleReport('${report.id}')" title="Export">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Get total items from plastic items object
function getTotalItems(plasticItems) {
    return Object.values(plasticItems).reduce((sum, count) => sum + count, 0);
}

// Update summary statistics
function updateSummaryStats() {
    const totalReports = currentReports.length;
    const totalItems = currentReports.reduce((sum, report) => sum + getTotalItems(report.plastic_items), 0);
    const activeTeams = new Set(currentReports.map(report => report.submitted_by)).size;
    const avgItemsPerReport = totalReports > 0 ? Math.round(totalItems / totalReports) : 0;
    
    // Update DOM elements
    const elements = {
        totalReports: document.getElementById('totalReports'),
        totalItems: document.getElementById('totalItems'),
        activeTeams: document.getElementById('activeTeams'),
        avgItemsPerReport: document.getElementById('avgItemsPerReport')
    };
    
    if (elements.totalReports) elements.totalReports.textContent = totalReports;
    if (elements.totalItems) elements.totalItems.textContent = totalItems.toLocaleString();
    if (elements.activeTeams) elements.activeTeams.textContent = activeTeams;
    if (elements.avgItemsPerReport) elements.avgItemsPerReport.textContent = avgItemsPerReport;
}

// Setup search and sort functionality
function setupSearchAndSort() {
    const searchInput = document.getElementById('searchReports');
    const sortSelect = document.getElementById('sortReports');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterReports();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortReports();
        });
    }
}

// Filter reports based on search
function filterReports() {
    const searchTerm = document.getElementById('searchReports').value.toLowerCase();
    
    currentReports = mockData.cleanupReports.filter(report => {
        return report.location.toLowerCase().includes(searchTerm) ||
               report.state.toLowerCase().includes(searchTerm) ||
               report.river.toLowerCase().includes(searchTerm) ||
               report.submitted_by.toLowerCase().includes(searchTerm) ||
               report.id.toLowerCase().includes(searchTerm);
    });
    
    sortReports();
    populateReportsTable();
    updateSummaryStats();
}

// Sort reports
function sortReports() {
    const sortBy = document.getElementById('sortReports').value;
    
    currentReports.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'location':
                return a.location.localeCompare(b.location);
            case 'items-desc':
                return getTotalItems(b.plastic_items) - getTotalItems(a.plastic_items);
            case 'items-asc':
                return getTotalItems(a.plastic_items) - getTotalItems(b.plastic_items);
            default:
                return 0;
        }
    });
    
    populateReportsTable();
}

// Initialize charts
function initializeCharts() {
    console.log('Initializing reports charts...');
    
    initializePollutionTypesChart();
    initializeStateActivityChart();
    
    console.log('Reports charts initialized successfully');
}

// Initialize pollution types chart
function initializePollutionTypesChart() {
    const ctx = document.getElementById('pollutionTypesChart');
    if (!ctx) return;
    
    const pollutionData = aggregatePollutionTypes();
    
    reportsCharts.pollutionTypes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: pollutionData.labels,
            datasets: [{
                data: pollutionData.values,
                backgroundColor: [
                    '#2E7D32',
                    '#81C784',
                    '#FFC107',
                    '#FF9800',
                    '#F44336',
                    '#9C27B0'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize state activity chart
function initializeStateActivityChart() {
    const ctx = document.getElementById('stateActivityChart');
    if (!ctx) return;
    
    const stateData = aggregateStateActivity();
    
    reportsCharts.stateActivity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stateData.labels,
            datasets: [{
                label: 'Cleanup Reports',
                data: stateData.values,
                backgroundColor: '#2E7D32',
                borderColor: '#2E7D32',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Aggregate pollution types from reports
function aggregatePollutionTypes() {
    const pollutionCounts = {};
    
    currentReports.forEach(report => {
        Object.entries(report.plastic_items).forEach(([type, count]) => {
            const displayName = getDisplayName(type);
            pollutionCounts[displayName] = (pollutionCounts[displayName] || 0) + count;
        });
    });
    
    return {
        labels: Object.keys(pollutionCounts),
        values: Object.values(pollutionCounts)
    };
}

// Aggregate state activity
function aggregateStateActivity() {
    const stateCounts = {};
    
    currentReports.forEach(report => {
        stateCounts[report.state] = (stateCounts[report.state] || 0) + 1;
    });
    
    return {
        labels: Object.keys(stateCounts),
        values: Object.values(stateCounts)
    };
}

// Get display name for pollution type
function getDisplayName(type) {
    const mapping = {
        'plastic_bottles': 'Plastic Bottles',
        'plastic_bags': 'Plastic Bags',
        'food_wrappers': 'Food Wrappers',
        'straws': 'Straws',
        'cigarette_butts': 'Cigarette Butts',
        'others': 'Others'
    };
    return mapping[type] || type;
}

// Populate observations table
function populateObservations() {
    const tableBody = document.getElementById('observationsTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = mockData.pollutionObservations.map(observation => `
        <tr>
            <td>${new Date(observation.date).toLocaleDateString()}</td>
            <td>${observation.observer_name}</td>
            <td>${observation.location}</td>
            <td>${observation.pollution_type}</td>
            <td>${observation.notes}</td>
        </tr>
    `).join('');
}

// Show add report modal
function showAddReportModal() {
    // Set default date to today
    document.getElementById('reportDate').value = new Date().toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('addReportModal'));
    modal.show();
}

// Submit new report
function submitReport() {
    const form = document.getElementById('addReportForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Collect form data
    const newReport = {
        id: `CR${Date.now()}`,
        location: document.getElementById('reportLocation').value,
        date: document.getElementById('reportDate').value,
        state: document.getElementById('reportState').value,
        river: document.getElementById('reportRiver').value,
        submitted_by: document.getElementById('reportSubmitter').value,
        source: document.getElementById('reportSource').value,
        plastic_items: {
            plastic_bottles: parseInt(document.getElementById('plasticBottles').value) || 0,
            plastic_bags: parseInt(document.getElementById('plasticBags').value) || 0,
            straws: parseInt(document.getElementById('straws').value) || 0,
            food_wrappers: parseInt(document.getElementById('foodWrappers').value) || 0,
            cigarette_butts: parseInt(document.getElementById('cigaretteButts').value) || 0,
            others: parseInt(document.getElementById('others').value) || 0
        }
    };
    
    // Add to mock data
    mockData.cleanupReports.unshift(newReport);
    
    // Update current reports
    currentReports = [...mockData.cleanupReports];
    
    // Update UI
    populateReportsTable();
    updateSummaryStats();
    updateCharts();
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addReportModal'));
    modal.hide();
    form.reset();
    
    DebriSense.showNotification('Report submitted successfully', 'success');
}

// View report details
function viewReportDetails(reportId) {
    const report = mockData.cleanupReports.find(r => r.id === reportId);
    if (!report) return;
    
    selectedReport = report;
    
    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <h6>Report Information</h6>
                <table class="table table-sm">
                    <tr>
                        <td><strong>ID:</strong></td>
                        <td>${report.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Location:</strong></td>
                        <td>${report.location}</td>
                    </tr>
                    <tr>
                        <td><strong>Date:</strong></td>
                        <td>${new Date(report.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>State:</strong></td>
                        <td>${report.state}</td>
                    </tr>
                    <tr>
                        <td><strong>River:</strong></td>
                        <td>${report.river}</td>
                    </tr>
                    <tr>
                        <td><strong>Submitted by:</strong></td>
                        <td>${report.submitted_by}</td>
                    </tr>
                    <tr>
                        <td><strong>Source:</strong></td>
                        <td>${report.source}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Items Collected</h6>
                <div class="row">
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.plastic_bottles}</div>
                            <div class="stats-label">Plastic Bottles</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.plastic_bags}</div>
                            <div class="stats-label">Plastic Bags</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.straws}</div>
                            <div class="stats-label">Straws</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.food_wrappers}</div>
                            <div class="stats-label">Food Wrappers</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.cigarette_butts}</div>
                            <div class="stats-label">Cigarette Butts</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="stats-card">
                            <div class="stats-number">${report.plastic_items.others}</div>
                            <div class="stats-label">Others</div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="text-center">
                    <h5>Total Items: ${getTotalItems(report.plastic_items)}</h5>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('reportDetailsContent').innerHTML = modalContent;
    
    // Store the current report ID for export
    window.currentReportId = reportId;
    
    const modal = new bootstrap.Modal(document.getElementById('reportDetailsModal'));
    modal.show();
}

// Export single report
function exportSingleReport(reportId) {
    const report = mockData.cleanupReports.find(r => r.id === reportId);
    if (!report) return;
    
    try {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            console.warn('jsPDF not available, falling back to CSV export');
            exportSingleReportCSV(reportId);
            return;
        }
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Cleanup Report', 20, 20);
        
        // Add report details
        doc.setFontSize(12);
        doc.text(`Report ID: ${report.id}`, 20, 40);
        doc.text(`Location: ${report.location}`, 20, 50);
        doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 60);
        doc.text(`State: ${report.state}`, 20, 70);
        doc.text(`River: ${report.river}`, 20, 80);
        doc.text(`Submitted by: ${report.submitted_by}`, 20, 90);
        doc.text(`Source: ${report.source}`, 20, 100);
        
        // Add items collected table
        doc.text('Items Collected:', 20, 120);
        
        const tableData = [
            ['Item Type', 'Quantity'],
            ['Plastic Bottles', report.plastic_items.plastic_bottles.toString()],
            ['Plastic Bags', report.plastic_items.plastic_bags.toString()],
            ['Straws', report.plastic_items.straws.toString()],
            ['Food Wrappers', report.plastic_items.food_wrappers.toString()],
            ['Cigarette Butts', report.plastic_items.cigarette_butts.toString()],
            ['Others', report.plastic_items.others.toString()],
            ['TOTAL', getTotalItems(report.plastic_items).toString()]
        ];
        
        doc.autoTable({
            startY: 130,
            head: [['Item Type', 'Quantity']],
            body: tableData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [46, 125, 50] }
        });
        
        // Add footer
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} by DebriSense`, 20, doc.internal.pageSize.height - 20);
        
        // Save PDF
        doc.save(`cleanup_report_${reportId}.pdf`);
        
        DebriSense.showNotification('Report exported as PDF successfully', 'success');
    } catch (error) {
        console.error('PDF generation failed:', error);
        console.log('Falling back to CSV export');
        exportSingleReportCSV(reportId);
    }
}

// Fallback CSV export for single report
function exportSingleReportCSV(reportId) {
    const report = mockData.cleanupReports.find(r => r.id === reportId);
    if (!report) return;
    
    const csvContent = `Report ID,Location,Date,State,River,Plastic Bottles,Plastic Bags,Straws,Food Wrappers,Cigarette Butts,Others,Total Items,Submitted By,Source
${report.id},${report.location},${report.date},${report.state},${report.river},${report.plastic_items.plastic_bottles},${report.plastic_items.plastic_bags},${report.plastic_items.straws},${report.plastic_items.food_wrappers},${report.plastic_items.cigarette_butts},${report.plastic_items.others},${getTotalItems(report.plastic_items)},${report.submitted_by},${report.source}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanup_report_${reportId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('Report exported as CSV successfully', 'success');
}

// Export all reports
function exportReports() {
    try {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            console.warn('jsPDF not available, falling back to CSV export');
            exportReportsCSV();
            return;
        }
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Cleanup Reports Summary', 20, 20);
        
        // Add summary info
        doc.setFontSize(12);
        doc.text(`Total Reports: ${currentReports.length}`, 20, 40);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
        
        // Prepare table data
        const tableData = currentReports.map(report => [
            report.id,
            report.location,
            new Date(report.date).toLocaleDateString(),
            report.state,
            report.river,
            getTotalItems(report.plastic_items).toString(),
            report.submitted_by
        ]);
        
        // Add table
        doc.autoTable({
            startY: 70,
            head: [['Report ID', 'Location', 'Date', 'State', 'River', 'Total Items', 'Submitted By']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [46, 125, 50] },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 35 },
                2: { cellWidth: 20 },
                3: { cellWidth: 25 },
                4: { cellWidth: 30 },
                5: { cellWidth: 20 },
                6: { cellWidth: 35 }
            }
        });
        
        // Add summary statistics
        const totalItems = currentReports.reduce((sum, report) => sum + getTotalItems(report.plastic_items), 0);
        const states = [...new Set(currentReports.map(r => r.state))];
        
        doc.setFontSize(12);
        doc.text('Summary Statistics:', 20, doc.lastAutoTable.finalY + 20);
        doc.setFontSize(10);
        doc.text(`Total Items Collected: ${totalItems}`, 20, doc.lastAutoTable.finalY + 30);
        doc.text(`States Covered: ${states.join(', ')}`, 20, doc.lastAutoTable.finalY + 40);
        
        // Add footer
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()} by DebriSense`, 20, doc.internal.pageSize.height - 20);
        
        // Save PDF
        doc.save(`cleanup_reports_${new Date().toISOString().split('T')[0]}.pdf`);
        
        DebriSense.showNotification('Reports exported as PDF successfully', 'success');
    } catch (error) {
        console.error('PDF generation failed:', error);
        console.log('Falling back to CSV export');
        exportReportsCSV();
    }
}

// Fallback CSV export for all reports
function exportReportsCSV() {
    const csvHeaders = 'Report ID,Location,Date,State,River,Plastic Bottles,Plastic Bags,Straws,Food Wrappers,Cigarette Butts,Others,Total Items,Submitted By,Source\n';
    const csvContent = currentReports.map(report => 
        `${report.id},${report.location},${report.date},${report.state},${report.river},${report.plastic_items.plastic_bottles},${report.plastic_items.plastic_bags},${report.plastic_items.straws},${report.plastic_items.food_wrappers},${report.plastic_items.cigarette_butts},${report.plastic_items.others},${getTotalItems(report.plastic_items)},${report.submitted_by},${report.source}`
    ).join('\n');
    
    const blob = new Blob([csvHeaders + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanup_reports_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('Reports exported as CSV successfully', 'success');
}

// Update charts with new data
function updateCharts() {
    if (reportsCharts.pollutionTypes) {
        const pollutionData = aggregatePollutionTypes();
        reportsCharts.pollutionTypes.data.labels = pollutionData.labels;
        reportsCharts.pollutionTypes.data.datasets[0].data = pollutionData.values;
        reportsCharts.pollutionTypes.update();
    }
    
    if (reportsCharts.stateActivity) {
        const stateData = aggregateStateActivity();
        reportsCharts.stateActivity.data.labels = stateData.labels;
        reportsCharts.stateActivity.data.datasets[0].data = stateData.values;
        reportsCharts.stateActivity.update();
    }
}

// Update reports with filters
function updateReportsWithFilters() {
    console.log('Updating reports with filters...');
    
    // Filter reports based on current filters
    const filters = filterManager.getFilters();
    
    currentReports = mockData.cleanupReports.filter(report => {
        // Season filter (if applicable)
        if (filters.season && report.date) {
            const reportDate = new Date(report.date);
            const isNortheastMonsoon = reportDate.getMonth() >= 10 || reportDate.getMonth() <= 3;
            const reportSeason = isNortheastMonsoon ? 'Northeast Monsoon' : 'Southwest Monsoon';
            if (reportSeason !== filters.season) return false;
        }
        
        // State filter
        if (filters.state && report.state !== filters.state) return false;
        
        // River filter
        if (filters.river && report.river !== filters.river) return false;
        
        return true;
    });
    
    // Update UI
    populateReportsTable();
    updateSummaryStats();
    updateCharts();
    
    console.log(`Reports updated: ${currentReports.length} reports displayed`);
}

// Export functions for global use
window.reportsFunctions = {
    exportReports,
    exportSingleReport,
    viewReportDetails,
    showAddReportModal,
    submitReport,
    updateReportsWithFilters
};

// Debug function to test export
window.testExport = function() {
    console.log('Testing export functionality...');
    console.log('jsPDF available:', typeof window.jspdf !== 'undefined');
    console.log('Current reports:', currentReports.length);
    console.log('Mock data available:', typeof mockData !== 'undefined');
    
    if (currentReports.length > 0) {
        console.log('First report:', currentReports[0]);
        exportSingleReport(currentReports[0].id);
    } else {
        console.log('No reports available to test');
    }
};

// Export current report from modal
window.exportCurrentReport = function() {
    if (window.currentReportId) {
        exportSingleReport(window.currentReportId);
    } else {
        console.error('No report ID available for export');
        DebriSense.showNotification('No report selected for export', 'error');
    }
}; 