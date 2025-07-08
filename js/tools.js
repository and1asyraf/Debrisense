// DebriSense Tools JavaScript
// Handles NGO tools, report generation, and export functionality

let generatedResults = [];

// Initialize tools when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tools page initialized');
    
    // Initialize after components are loaded
    setTimeout(() => {
        setupToolEventListeners();
    }, 1000);
});

// Setup event listeners for tools
function setupToolEventListeners() {
    // Planning region change
    const planningRegion = document.getElementById('planningRegion');
    if (planningRegion) {
        planningRegion.addEventListener('change', function() {
            if (this.value) {
                updatePlanningTool();
            }
        });
    }
    
    // Risk location input
    const riskLocation = document.getElementById('riskLocation');
    if (riskLocation) {
        riskLocation.addEventListener('input', function() {
            if (this.value.length > 2) {
                suggestLocations(this.value);
            }
        });
    }
}

// Generate cleanup plan
function generateCleanupPlan() {
    const region = document.getElementById('planningRegion').value;
    const period = document.getElementById('planningPeriod').value;
    
    if (!region) {
        DebriSense.showNotification('Please select a region', 'warning');
        return;
    }
    
    console.log(`Generating cleanup plan for ${region} over ${period}`);
    
    // TODO: Implement real planning algorithm
    const plan = generateMockCleanupPlan(region, period);
    
    displayResults('cleanup-plan', plan);
    DebriSense.showNotification('Cleanup plan generated successfully', 'success');
}

// Generate mock cleanup plan
function generateMockCleanupPlan(region, period) {
    const highRiskZones = mockData.mlPredictionZones.filter(zone => 
        zone.state === region && zone.predicted_risk_score > 0.6
    );
    
    const plan = {
        title: `Cleanup Plan for ${region}`,
        period: period,
        generated: new Date().toISOString(),
        summary: {
            totalZones: highRiskZones.length,
            priorityZones: highRiskZones.filter(z => z.predicted_risk_score > 0.8).length,
            estimatedItems: highRiskZones.length * 150,
            recommendedTeams: Math.ceil(highRiskZones.length / 2)
        },
        zones: highRiskZones.map(zone => ({
            name: zone.river_basin,
            riskScore: zone.predicted_risk_score,
            priority: zone.predicted_risk_score > 0.8 ? 'High' : 'Medium',
            recommendedDate: getRecommendedDate(period),
            estimatedItems: Math.round(zone.predicted_risk_score * 200),
            accessPoints: getAccessPoints(zone.river_basin),
            equipment: getRequiredEquipment(zone.predicted_risk_score)
        })),
        recommendations: [
            `Focus on ${highRiskZones.filter(z => z.predicted_risk_score > 0.8).length} high-priority zones`,
            'Coordinate with local authorities for permits',
            'Ensure proper waste disposal arrangements',
            'Document all cleanup activities for future analysis'
        ]
    };
    
    return plan;
}

// Get recommended date based on period
function getRecommendedDate(period) {
    const today = new Date();
    const days = {
        '1m': 30,
        '3m': 90,
        '6m': 180
    };
    
    const futureDate = new Date(today.getTime() + (days[period] * 24 * 60 * 60 * 1000));
    return futureDate.toLocaleDateString();
}

// Get access points for a river
function getAccessPoints(riverName) {
    const accessPoints = {
        'Sungai Klang': ['Port Klang', 'Klang Town', 'Shah Alam'],
        'Sungai Pinang': ['Penang Port', 'Georgetown', 'Batu Ferringhi'],
        'Sungai Petagas': ['Kota Kinabalu', 'Tanjung Aru', 'Likas Bay'],
        'Sungai Johor': ['Johor Bahru', 'Pasir Gudang', 'Tanjung Langsat'],
        'Sungai Linggi': ['Port Dickson', 'Lukut', 'Nilai']
    };
    
    return accessPoints[riverName] || ['Multiple access points available'];
}

// Get required equipment based on risk score
function getRequiredEquipment(riskScore) {
    if (riskScore > 0.8) {
        return ['Heavy-duty gloves', 'Safety boots', 'Waste containers', 'Safety vests', 'First aid kit'];
    } else if (riskScore > 0.6) {
        return ['Gloves', 'Safety boots', 'Waste containers', 'Safety vests'];
    } else {
        return ['Gloves', 'Waste containers'];
    }
}

// Assess risk for a location
function assessRisk() {
    const location = document.getElementById('riskLocation').value;
    const river = document.getElementById('riskRiver').value;
    
    if (!location) {
        DebriSense.showNotification('Please enter a location', 'warning');
        return;
    }
    
    console.log(`Assessing risk for ${location}, river: ${river}`);
    
    // TODO: Implement real risk assessment
    const assessment = generateMockRiskAssessment(location, river);
    
    displayResults('risk-assessment', assessment);
    DebriSense.showNotification('Risk assessment completed', 'success');
}

// Generate mock risk assessment
function generateMockRiskAssessment(location, river) {
    const riskScore = Math.random() * 0.8 + 0.2; // Random score between 0.2 and 1.0
    const riskLevel = riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low';
    
    const assessment = {
        title: `Risk Assessment for ${location}`,
        location: location,
        river: river,
        generated: new Date().toISOString(),
        riskScore: riskScore,
        riskLevel: riskLevel,
        factors: {
            proximityToRiver: Math.random() > 0.5 ? 'High' : 'Medium',
            populationDensity: Math.random() > 0.5 ? 'High' : 'Medium',
            historicalData: Math.random() > 0.5 ? 'Available' : 'Limited',
            seasonalImpact: Math.random() > 0.5 ? 'Significant' : 'Moderate'
        },
        predictions: {
            nextMonth: riskScore + (Math.random() * 0.1 - 0.05),
            nextQuarter: riskScore + (Math.random() * 0.2 - 0.1),
            nextYear: riskScore + (Math.random() * 0.3 - 0.15)
        },
        recommendations: [
            riskScore > 0.7 ? 'Immediate cleanup action recommended' : 'Regular monitoring recommended',
            'Install waste collection bins in high-traffic areas',
            'Conduct community awareness programs',
            'Coordinate with local authorities for enforcement'
        ],
        similarLocations: getSimilarLocations(location, riskScore)
    };
    
    return assessment;
}

// Get similar locations
function getSimilarLocations(location, riskScore) {
    const similar = mockData.mlPredictionZones
        .filter(zone => Math.abs(zone.predicted_risk_score - riskScore) < 0.2)
        .slice(0, 3);
    
    return similar.map(zone => ({
        name: zone.river_basin,
        state: zone.state,
        riskScore: zone.predicted_risk_score
    }));
}

// Export data
function exportData() {
    const dataType = document.getElementById('exportDataType').value;
    const format = document.getElementById('exportFormat').value;
    
    console.log(`Exporting ${dataType} data in ${format} format`);
    
    // TODO: Implement real data export
    const exportData = generateExportData(dataType);
    
    downloadFile(exportData, format, `debrisense_${dataType}_${new Date().toISOString().split('T')[0]}`);
    
    DebriSense.showNotification(`Data exported successfully in ${format.toUpperCase()} format`, 'success');
}

// Generate export data
function generateExportData(dataType) {
    switch (dataType) {
        case 'cleanup':
            return mockData.cleanupReports;
        case 'predictions':
            return mockData.mlPredictionZones;
        case 'observations':
            return mockData.pollutionObservations;
        case 'all':
            return {
                cleanupReports: mockData.cleanupReports,
                mlPredictions: mockData.mlPredictionZones,
                observations: mockData.pollutionObservations,
                filters: filterManager.getFilters()
            };
        default:
            return mockData.cleanupReports;
    }
}

// Download file
function downloadFile(data, format, filename) {
    if (format === 'pdf') {
        generatePDF(data, filename);
        return;
    }
    
    let content, mimeType, extension;
    
    switch (format) {
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'xlsx':
            // TODO: Implement Excel export
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate PDF
function generatePDF(data, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('DebriSense Data Export', 20, 20);
    
    // Add export info
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Data type: ${Array.isArray(data) ? `${data.length} records` : 'Complex data'}`, 20, 50);
    
    if (Array.isArray(data) && data.length > 0) {
        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Prepare table data
        const tableData = data.map(item => 
            headers.map(header => {
                const value = item[header];
                return typeof value === 'object' ? JSON.stringify(value) : String(value);
            })
        );
        
        // Add table
        doc.autoTable({
            startY: 70,
            head: [headers],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [46, 125, 50] },
            styles: { fontSize: 8 },
            columnStyles: {
                // Auto-adjust column widths
            }
        });
    } else if (typeof data === 'object') {
        // Handle complex object data
        let yPosition = 70;
        doc.setFontSize(10);
        
        Object.entries(data).forEach(([key, value]) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            doc.text(`${displayKey}:`, 20, yPosition);
            
            if (typeof value === 'object' && value !== null) {
                yPosition += 10;
                doc.setFontSize(8);
                doc.text(JSON.stringify(value, null, 2), 25, yPosition);
                yPosition += 15;
            } else {
                doc.text(String(value), 80, yPosition);
                yPosition += 10;
            }
            
            doc.setFontSize(10);
        });
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.text(`Generated by DebriSense on ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 20);
    
    // Save PDF
    doc.save(`${filename}.pdf`);
}

// Convert data to CSV
function convertToCSV(data) {
    if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        return csvContent;
    }
    return '';
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const timeRange = document.getElementById('reportTimeRange').value;
    
    console.log(`Generating ${reportType} report for ${timeRange}`);
    
    // TODO: Implement real report generation
    const report = generateMockReport(reportType, timeRange);
    
    displayResults('report', report);
    DebriSense.showNotification('Report generated successfully', 'success');
}

// Generate mock report
function generateMockReport(reportType, timeRange) {
    const report = {
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        type: reportType,
        timeRange: timeRange,
        generated: new Date().toISOString(),
        summary: {
            totalReports: mockData.cleanupReports.length,
            totalItems: mockData.cleanupReports.reduce((sum, report) => 
                sum + getTotalItems(report.plastic_items), 0),
            highRiskZones: mockData.mlPredictionZones.filter(z => z.predicted_risk_score > 0.7).length,
            activeTeams: new Set(mockData.cleanupReports.map(r => r.submitted_by)).size
        },
        keyFindings: [
            'Plastic bottles remain the most common debris type',
            'High-risk zones concentrated in urban coastal areas',
            'Seasonal variations show increased risk during monsoon periods',
            'Community participation has increased by 25% this year'
        ],
        recommendations: [
            'Increase cleanup frequency in high-risk zones',
            'Implement source reduction programs in urban areas',
            'Enhance community engagement and education',
            'Strengthen enforcement of waste management regulations'
        ],
        data: {
            topPollutionTypes: aggregatePollutionTypes(),
            stateActivity: aggregateStateActivity(),
            riskTrends: generateTrendData()
        }
    };
    
    return report;
}

// Get total items from plastic items object
function getTotalItems(plasticItems) {
    return Object.values(plasticItems).reduce((sum, count) => sum + count, 0);
}

// Aggregate pollution types
function aggregatePollutionTypes() {
    const pollutionCounts = {};
    
    mockData.cleanupReports.forEach(report => {
        Object.entries(report.plastic_items).forEach(([type, count]) => {
            const displayName = getDisplayName(type);
            pollutionCounts[displayName] = (pollutionCounts[displayName] || 0) + count;
        });
    });
    
    return pollutionCounts;
}

// Aggregate state activity
function aggregateStateActivity() {
    const stateCounts = {};
    
    mockData.cleanupReports.forEach(report => {
        stateCounts[report.state] = (stateCounts[report.state] || 0) + 1;
    });
    
    return stateCounts;
}

// Generate trend data
function generateTrendData() {
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [0.45, 0.52, 0.48, 0.61, 0.67, 0.74]
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

// Display results
function displayResults(type, data) {
    const container = document.getElementById('generatedResults');
    if (!container) return;
    
    let html = '';
    
    switch (type) {
        case 'cleanup-plan':
            html = generateCleanupPlanHTML(data);
            break;
        case 'risk-assessment':
            html = generateRiskAssessmentHTML(data);
            break;
        case 'report':
            html = generateReportHTML(data);
            break;
        default:
            html = '<div class="text-center text-muted">No results to display</div>';
    }
    
    container.innerHTML = html;
    
    // Add download button
    const downloadBtn = document.createElement('div');
    downloadBtn.className = 'text-center mt-3';
    downloadBtn.innerHTML = `
        <button class="btn btn-outline-primary" onclick="downloadResult('${type}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
            <i class="fas fa-download me-2"></i>
            Download Result
        </button>
    `;
    container.appendChild(downloadBtn);
}

// Generate cleanup plan HTML
function generateCleanupPlanHTML(plan) {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Plan Summary</h6>
                <ul class="list-unstyled">
                    <li><strong>Total Zones:</strong> ${plan.summary.totalZones}</li>
                    <li><strong>Priority Zones:</strong> ${plan.summary.priorityZones}</li>
                    <li><strong>Estimated Items:</strong> ${plan.summary.estimatedItems}</li>
                    <li><strong>Recommended Teams:</strong> ${plan.summary.recommendedTeams}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Recommendations</h6>
                <ul class="list-unstyled">
                    ${plan.recommendations.map(rec => `<li><i class="fas fa-check text-success me-2"></i>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
        <hr>
        <h6>Target Zones</h6>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Zone</th>
                        <th>Risk Score</th>
                        <th>Priority</th>
                        <th>Recommended Date</th>
                        <th>Estimated Items</th>
                    </tr>
                </thead>
                <tbody>
                    ${plan.zones.map(zone => `
                        <tr>
                            <td>${zone.name}</td>
                            <td><span class="risk-score ${getRiskClass(zone.riskScore)}">${(zone.riskScore * 100).toFixed(1)}%</span></td>
                            <td><span class="badge ${zone.priority === 'High' ? 'bg-danger' : 'bg-warning'}">${zone.priority}</span></td>
                            <td>${zone.recommendedDate}</td>
                            <td>${zone.estimatedItems}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate risk assessment HTML
function generateRiskAssessmentHTML(assessment) {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Assessment Summary</h6>
                <ul class="list-unstyled">
                    <li><strong>Location:</strong> ${assessment.location}</li>
                    <li><strong>River:</strong> ${assessment.river || 'Not specified'}</li>
                    <li><strong>Risk Score:</strong> <span class="risk-score ${getRiskClass(assessment.riskScore)}">${(assessment.riskScore * 100).toFixed(1)}%</span></li>
                    <li><strong>Risk Level:</strong> <span class="badge ${assessment.riskLevel === 'High' ? 'bg-danger' : assessment.riskLevel === 'Medium' ? 'bg-warning' : 'bg-success'}">${assessment.riskLevel}</span></li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Risk Factors</h6>
                <ul class="list-unstyled">
                    <li><strong>Proximity to River:</strong> ${assessment.factors.proximityToRiver}</li>
                    <li><strong>Population Density:</strong> ${assessment.factors.populationDensity}</li>
                    <li><strong>Historical Data:</strong> ${assessment.factors.historicalData}</li>
                    <li><strong>Seasonal Impact:</strong> ${assessment.factors.seasonalImpact}</li>
                </ul>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <h6>Recommendations</h6>
                <ul class="list-unstyled">
                    ${assessment.recommendations.map(rec => `<li><i class="fas fa-lightbulb text-warning me-2"></i>${rec}</li>`).join('')}
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Similar Locations</h6>
                <ul class="list-unstyled">
                    ${assessment.similarLocations.map(loc => `<li><i class="fas fa-map-marker-alt text-primary me-2"></i>${loc.name} (${loc.state}) - ${(loc.riskScore * 100).toFixed(1)}%</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Generate report HTML
function generateReportHTML(report) {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Report Summary</h6>
                <ul class="list-unstyled">
                    <li><strong>Total Reports:</strong> ${report.summary.totalReports}</li>
                    <li><strong>Total Items:</strong> ${report.summary.totalItems.toLocaleString()}</li>
                    <li><strong>High Risk Zones:</strong> ${report.summary.highRiskZones}</li>
                    <li><strong>Active Teams:</strong> ${report.summary.activeTeams}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Key Findings</h6>
                <ul class="list-unstyled">
                    ${report.keyFindings.map(finding => `<li><i class="fas fa-chart-line text-primary me-2"></i>${finding}</li>`).join('')}
                </ul>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-12">
                <h6>Recommendations</h6>
                <ul class="list-unstyled">
                    ${report.recommendations.map(rec => `<li><i class="fas fa-check-circle text-success me-2"></i>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// Get risk class
function getRiskClass(riskScore) {
    if (riskScore <= 0.3) return 'risk-low';
    if (riskScore <= 0.6) return 'risk-moderate';
    return 'risk-high';
}

// Download result
function downloadResult(type, data) {
    const filename = `debrisense_${type}_${new Date().toISOString().split('T')[0]}`;
    downloadFile(data, 'json', filename);
}

// Export all tools
function exportAllTools() {
    const allData = {
        cleanupPlans: generatedResults.filter(r => r.type === 'cleanup-plan'),
        riskAssessments: generatedResults.filter(r => r.type === 'risk-assessment'),
        reports: generatedResults.filter(r => r.type === 'report'),
        timestamp: new Date().toISOString()
    };
    
    downloadFile(allData, 'json', `debrisense_all_tools_${new Date().toISOString().split('T')[0]}`);
    DebriSense.showNotification('All tools data exported successfully', 'success');
}

// Show help modal
function showHelpModal() {
    const modal = new bootstrap.Modal(document.getElementById('helpModal'));
    modal.show();
}

// Update planning tool
function updatePlanningTool() {
    // TODO: Update planning tool based on selected region
    console.log('Planning tool updated');
}

// Suggest locations
function suggestLocations(query) {
    // TODO: Implement location suggestions
    console.log('Suggesting locations for:', query);
}

// Update tools with filters
function updateToolsWithFilters() {
    console.log('Updating tools with filters...');
    
    // TODO: Update tools based on current filters
    console.log('Tools updated with filters');
}

// Export functions for global use
window.toolsFunctions = {
    exportAllTools,
    showHelpModal,
    updateToolsWithFilters
}; 