const form = document.getElementById('predictionForm');
const annualIncomeInput = document.getElementById('annualIncome');
const spendingScoreInput = document.getElementById('spendingScore');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const annualIncome = annualIncomeInput.value;
    const spendingScore = spendingScoreInput.value;

    resultDiv.classList.add('hidden');
    resultDiv.classList.remove('error-box');
    resultDiv.innerHTML = `<span class="text-xl">Predicting...</span><span class="loading-spinner"></span>`;
    resultDiv.classList.remove('hidden');

    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                "Annual Income (k$)": parseInt(annualIncome),
                "Spending Score (1-100)": parseInt(spendingScore)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error occurred.');
        }
        
        const data = await response.json();
        const prediction = data.prediction;

        // Simple interpretation of clusters based on a common analysis of the mall dataset
        const clusterDescriptions = {
            1: 'Low Income, Low Spending',
            2: 'Low Income, High Spending',
            3: 'Mid Income, Mid Spending',
            4: 'High Income, Low Spending',
            5: 'High Income, High Spending'
        };

        const description = clusterDescriptions[prediction] || 'Unknown Segment';

        resultDiv.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">Prediction: Cluster ${prediction}</h2>
            <p class="text-lg">${description}</p>
        `;

    } catch (error) {
        resultDiv.classList.add('error-box');
        resultDiv.innerHTML = `<p class="text-lg font-semibold">Error: ${error.message}</p>`;
    }
    
});