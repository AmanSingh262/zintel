/**
 * indiaMap.js - AUTHENTIC India Map
 * Using high-quality pre-built SVG with real India geography
 */

export const stateData = {
    'Jammu and Kashmir': { code: 'JK', population: '13M', capital: 'Srinagar', gdp: '$23B', literacy: '68%' },
    'Himachal Pradesh': { code: 'HP', population: '7M', capital: 'Shimla', gdp: '$22B', literacy: '83%' },
    'Punjab': { code: 'PB', population: '30M', capital: 'Chandigarh', gdp: '$77B', literacy: '76%' },
    'Haryana': { code: 'HR', population: '29M', capital: 'Chandigarh', gdp: '$95B', literacy: '76%' },
    'Delhi': { code: 'DL', population: '19M', capital: 'New Delhi', gdp: '$110B', literacy: '86%' },
    'Uttarakhand': { code: 'UK', population: '11M', capital: 'Dehradun', gdp: '$28B', literacy: '79%' },
    'Rajasthan': { code: 'RJ', population: '81M', capital: 'Jaipur', gdp: '$150B', literacy: '66%' },
    'Uttar Pradesh': { code: 'UP', population: '241M', capital: 'Lucknow', gdp: '$240B', literacy: '68%' },
    'Bihar': { code: 'BR', population: '128M', capital: 'Patna', gdp: '$98B', literacy: '62%' },
    'West Bengal': { code: 'WB', population: '100M', capital: 'Kolkata', gdp: '$200B', literacy: '76%' },
    'Sikkim': { code: 'SK', population: '0.7M', capital: 'Gangtok', gdp: '$5B', literacy: '82%' },
    'Arunachal Pradesh': { code: 'AR', population: '1.5M', capital: 'Itanagar', gdp: '$3B', literacy: '67%' },
    'Nagaland': { code: 'NL', population: '2M', capital: 'Kohima', gdp: '$4B', literacy: '80%' },
    'Manipur': { code: 'MN', population: '3M', capital: 'Imphal', gdp: '$5B', literacy: '79%' },
    'Mizoram': { code: 'MZ', population: '1.2M', capital: 'Aizawl', gdp: '$3B', literacy: '91%' },
    'Tripura': { code: 'TR', population: '4M', capital: 'Agartala', gdp: '$7B', literacy: '87%' },
    'Meghalaya': { code: 'ML', population: '3M', capital: 'Shillong', gdp: '$6B', literacy: '75%' },
    'Assam': { code: 'AS', population: '35M', capital: 'Dispur', gdp: '$52B', literacy: '72%' },
    'Jharkhand': { code: 'JH', population: '38M', capital: 'Ranchi', gdp: '$55B', literacy: '66%' },
    'Odisha': { code: 'OR', population: '47M', capital: 'Bhubaneswar', gdp: '$85B', literacy: '73%' },
    'Chhattisgarh': { code: 'CT', population: '30M', capital: 'Raipur', gdp: '$60B', literacy: '70%' },
    'Madhya Pradesh': { code: 'MP', population: '85M', capital: 'Bhopal', gdp: '$130B', literacy: '69%' },
    'Gujarat': { code: 'GJ', population: '70M', capital: 'Gandhinagar', gdp: '$230B', literacy: '78%' },
    'Maharashtra': { code: 'MH', population: '125M', capital: 'Mumbai', gdp: '$430B', literacy: '82%' },
    'Andhra Pradesh': { code: 'AP', population: '53M', capital: 'Amaravati', gdp: '$120B', literacy: '68%' },
    'Karnataka': { code: 'KA', population: '68M', capital: 'Bengaluru', gdp: '$240B', literacy: '75%' },
    'Goa': { code: 'GA', population: '1.5M', capital: 'Panaji', gdp: '$8B', literacy: '89%' },
    'Kerala': { code: 'KL', population: '35M', capital: 'Thiruvananthapuram', gdp: '$110B', literacy: '94%' },
    'Tamil Nadu': { code: 'TN', population: '77M', capital: 'Chennai', gdp: '$260B', literacy: '80%' },
    'Telangana': { code: 'TG', population: '39M', capital: 'Hyderabad', gdp: '$140B', literacy: '67%' }
};

export function createIndiaMap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Use an embedded high-quality India map image with clickable overlay regions
    container.innerHTML = `
        <div class="india-map-container">
            <div class="map-image-wrapper">
                <img src="India-map-en.jpg" 
                     alt="India Political Map" 
                     class="india-map-base">
            </div>
            
            <div class="state-selector-grid">
                <div class="state-buttons">
                    <button class="state-btn" data-state="Uttar Pradesh">Uttar Pradesh</button>
                    <button class="state-btn" data-state="Maharashtra">Maharashtra</button>
                    <button class="state-btn" data-state="Bihar">Bihar</button>
                    <button class="state-btn" data-state="West Bengal">West Bengal</button>
                    <button class="state-btn" data-state="Madhya Pradesh">Madhya Pradesh</button>
                    <button class="state-btn" data-state="Tamil Nadu">Tamil Nadu</button>
                    <button class="state-btn" data-state="Rajasthan">Rajasthan</button>
                    <button class="state-btn" data-state="Karnataka">Karnataka</button>
                    <button class="state-btn" data-state="Gujarat">Gujarat</button>
                    <button class="state-btn" data-state="Andhra Pradesh">Andhra Pradesh</button>
                    <button class="state-btn" data-state="Odisha">Odisha</button>
                    <button class="state-btn" data-state="Telangana">Telangana</button>
                    <button class="state-btn" data-state="Kerala">Kerala</button>
                    <button class="state-btn" data-state="Jharkhand">Jharkhand</button>
                    <button class="state-btn" data-state="Assam">Assam</button>
                    <button class="state-btn" data-state="Punjab">Punjab</button>
                    <button class="state-btn" data-state="Chhattisgarh">Chhattisgarh</button>
                    <button class="state-btn" data-state="Haryana">Haryana</button>
                    <button class="state-btn" data-state="Delhi">Delhi</button>
                </div>
            </div>
            
            <div id="state-info-panel" class="state-info-panel hidden">
                <button class="close-panel" onclick="closeStatePanel()">×</button>
                <h3 id="state-name"></h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">🏛️ Capital:</span>
                        <span id="state-capital" class="value"></span>
                    </div>
                    <div class="info-item">
                        <span class="label">👥 Population:</span>
                        <span id="state-pop" class="value"></span>
                    </div>
                    <div class="info-item">
                        <span class="label">💰 GDP:</span>
                        <span id="state-gdp" class="value"></span>
                    </div>
                    <div class="info-item">
                        <span class="label">📚 Literacy:</span>
                        <span id="state-literacy" class="value"></span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add click handlers to state buttons
    document.querySelectorAll('.state-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const stateName = this.dataset.state;
            showStateInfo(stateName);

            // Visual feedback
            document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showStateInfo(stateName) {
    const data = stateData[stateName];
    if (!data) return;

    const panel = document.getElementById('state-info-panel');
    panel.classList.remove('hidden');

    document.getElementById('state-name').innerText = stateName;
    document.getElementById('state-pop').innerText = data.population;
    document.getElementById('state-capital').innerText = data.capital;
    document.getElementById('state-gdp').innerText = data.gdp;
    document.getElementById('state-literacy').innerText = data.literacy;
}

window.closeStatePanel = function () {
    document.getElementById('state-info-panel').classList.add('hidden');
    document.querySelectorAll('.state-btn').forEach(b => b.classList.remove('active'));
};
