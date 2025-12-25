import axios from 'axios';

const API_KEY = '9e8516245eb94d2a8e691ea50a2a32ab';
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function testAPI() {
    console.log('Testing Spoonacular API...\n');

    // Test 1: Simple search
    try {
        console.log('Test 1: Simple search for "pasta"');
        const response = await axios.get(`${BASE_URL}/complexSearch`, {
            params: {
                apiKey: API_KEY,
                query: 'pasta',
                number: 2
            }
        });
        console.log('✅ Success! Found', response.data.results.length, 'recipes');
        console.log('First recipe:', response.data.results[0]?.title);
    } catch (err) {
        console.log('❌ Failed!');
        console.log('Status:', err.response?.status);
        console.log('Error:', err.response?.data || err.message);
    }

    console.log('\n---\n');

    // Test 2: Check API key validity
    try {
        console.log('Test 2: Checking API key with a simple endpoint');
        const response = await axios.get('https://api.spoonacular.com/recipes/random', {
            params: {
                apiKey: API_KEY,
                number: 1
            }
        });
        console.log('✅ API Key is valid!');
        console.log('Random recipe:', response.data.recipes[0]?.title);
    } catch (err) {
        console.log('❌ API Key validation failed!');
        console.log('Status:', err.response?.status);
        console.log('Error:', err.response?.data || err.message);
    }
}

testAPI();
