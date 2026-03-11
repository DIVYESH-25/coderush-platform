const { evaluateCode } = require("./backend/utils/codeEvaluator");

(async () => {
    const tests = [
        { lang: "python", fn: "sum_arr", code: "def sum_arr(arr):\n    return sum(arr)", input: [1, 2, 3] },
        { lang: "java", fn: "isPalindrome", code: "public boolean isPalindrome(String s) {\n    return s.equals(new StringBuilder(s).reverse().toString());\n}", input: "racecar" },
        { lang: "python", fn: "filter_even", code: "def filter_even(nums):\n    return [x for x in nums if x % 2 == 0]", input: [1, 2, 3, 4] },
        { lang: "java", fn: "reverse", code: "public String reverse(String s) {\n    return new StringBuilder(s).reverse().toString();\n}", input: "hello" },
        { lang: "python", fn: "factorial", code: "def factorial(n):\n    if n == 0: return 1\n    res = 1\n    for i in range(1, n+1): res *= i\n    return res", input: 5 },
        { lang: "java", fn: "binarySearch", code: "public int binarySearch(int[] arr, int target) {\n    int l=0, r=arr.length-1;\n    while(l<=r) {\n        int m=l+(r-l)/2;\n        if(arr[m]==target) return m;\n        if(arr[m]<target) l=m+1; else r=m-1;\n    }\n    return -1;\n}", input: [[1, 2, 3], 2] }
    ];

    for (const t of tests) {
        console.log(`Testing ${t.fn}...`);
        const result = await evaluateCode(t.lang, t.code, t.fn, t.input);
        console.log(`${t.fn} Result:`, result);
    }
})();
