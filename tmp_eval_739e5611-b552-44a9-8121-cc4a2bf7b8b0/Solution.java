
public class Solution {
    public boolean isPalindrome(String s) {
    for(int i = 0; i < s.length(); i++) {
        if(s.charAt(i) != s.charAt(s.length() - i - 1)) return false;
    }
    return true;
}

    public static void main(String[] args) {
        try {
            System.out.println(new Solution().isPalindrome("hello"));
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
