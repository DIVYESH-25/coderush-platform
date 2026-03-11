(async () => {
    try {
        const uniqueId = Date.now().toString();

        // 1. Register a fresh valid user exactly like the UI
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamName: `TestingTeam-${uniqueId}`,
                member1: "Mock Tester",
                college: "Virtual College",
                email: `test${uniqueId}@mock.com`,
                phone: "1234567890"
            })
        });

        const regData = await regRes.json();
        const token = regData.token;
        console.log("Logged in:", token.substring(0, 20));

        // 2. Submit explicit answers
        const submitRes = await fetch('http://localhost:5000/api/round/submit-round', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                round: 1,
                answers: [{ id: 1, selected: "8" }, { id: 2, selected: "3" }]
            })
        });

        const fs = require('fs');
        const submitData = await submitRes.json();
        fs.writeFileSync('submit_result.json', JSON.stringify(submitData, null, 2));
        console.log("Submit result saved to submit_result.json");
    } catch (e) {
        console.error("Test Error:", e.message || e);
    }
})();
