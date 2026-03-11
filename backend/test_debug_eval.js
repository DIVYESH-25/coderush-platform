const fs = require('fs');

(async () => {
    const API_URL = "http://localhost:5000/api";

    // 1. Register
    const regRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            teamName: "DebugTester-" + Date.now(),
            member1: "Tester",
            college: "Test Univ",
            email: "debug@test.com",
            phone: "0000000000"
        })
    });
    const regData = await regRes.json();
    const token = regData.token;
    console.log("Registered. Token received.");

    // 2. Submit Round 2 with correct solutions
    const solutions = [
        "def sum_arr(arr):\n    return sum(arr)",
        "public boolean isPalindrome(String s) {\n    return s.equals(new StringBuilder(s).reverse().toString());\n}",
        "def filter_even(nums):\n    return [x for x in nums if x % 2 == 0]",
        "public String reverse(String s) {\n    return new StringBuilder(s).reverse().toString();\n}",
        "def factorial(n):\n    if n == 0: return 1\n    res = 1\n    for i in range(1, n+1): res *= i\n    return res",
        "public int binarySearch(int[] arr, int target) {\n    int l=0, r=arr.length-1;\n    while(l<=r) {\n        int m=l+(r-l)/2;\n        if(arr[m]==target) return m;\n        if(arr[m]<target) l=m+1; else r=m-1;\n    }\n    return -1;\n}"
    ];

    console.log("Submitting Round 2 solutions...");
    const subRes = await fetch(`${API_URL}/round/submit-round`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            round: 2,
            solutions: solutions
        })
    });

    const subData = await subRes.json();
    console.log("Submit Result:", JSON.stringify(subData, null, 2));

    if (subData.score === 60) {
        console.log("SUCCESS: All 60 tests passed!");
    } else {
        console.log(`FAILURE: Expected 60 but got ${subData.score}`);
    }
})();
