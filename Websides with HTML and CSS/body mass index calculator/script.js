document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateBMI();
});

document.getElementById('bmiForm').addEventListener('reset', function() {
    document.getElementById('result').classList.add('hidden');
});

function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // Validate inputs
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    // Calculate BMI: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Determine category
    let category = '';
    let categoryClass = '';
    let info = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
        info = 'You may need to gain weight. Consult a healthcare professional for personalized advice.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        categoryClass = 'normal';
        info = 'Your weight is in a healthy range. Keep up with regular exercise and balanced nutrition!';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
        info = 'You may benefit from lifestyle changes. Consider consulting a healthcare provider.';
    } else {
        category = 'Obese';
        categoryClass = 'obese';
        info = 'It is recommended to consult a healthcare professional for personalized guidance.';
    }

    // Display results
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    const categoryElement = document.getElementById('category');
    categoryElement.textContent = category;
    categoryElement.className = 'result-category ' + categoryClass;
    document.getElementById('info').textContent = info;
    document.getElementById('result').classList.remove('hidden');
}
