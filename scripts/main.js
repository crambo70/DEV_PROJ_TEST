// Main JavaScript file for DEV_PROJ_TEST
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('demo-button');
    const text = document.getElementById('demo-text');
    
    button.addEventListener('click', function() {
        text.innerHTML = 'Hello! JavaScript is working perfectly! 🎉';
        text.style.color = '#007bff';
        text.style.fontWeight = 'bold';
    });
    
    console.log('DEV_PROJ_TEST JavaScript loaded successfully!');
});